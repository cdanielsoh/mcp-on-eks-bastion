import json
import subprocess
import asyncio
import boto3
from datetime import datetime
import re
from typing import Dict, List, Any, Optional

# Configuration
AWS_REGION = "us-west-2"  # Change to your AWS region


async def get_eks_clusters() -> List[str]:
    """Get list of EKS clusters using boto3"""
    try:
        # Run this in a thread pool to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        clusters = await loop.run_in_executor(None, _get_eks_clusters_sync)
        return clusters
    except Exception as e:
        print(f"Error getting EKS clusters: {str(e)}")
        return []


def _get_eks_clusters_sync() -> List[str]:
    """Synchronous version of get_eks_clusters for thread pool execution"""
    eks_client = boto3.client('eks', region_name=AWS_REGION)
    response = eks_client.list_clusters()
    return response.get('clusters', [])


async def run_kubectl_command(command: str) -> str:
    """Run kubectl command and return the output"""
    try:
        # Run subprocess in a thread pool to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, lambda: subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        ))
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running kubectl command: {e}")
        return ""


async def fetch_kubernetes_resources(cluster_name: str) -> Dict[str, List[Dict[str, Any]]]:
    """Fetch Kubernetes resources using kubectl commands"""
    if not cluster_name:
        clusters = await get_eks_clusters()
        if clusters:
            cluster_name = clusters[0]
        else:
            raise Exception("No EKS clusters found")

    # Update AWS kubeconfig
    update_kubeconfig_cmd = f"aws eks update-kubeconfig --name {cluster_name} --region {AWS_REGION}"
    await run_kubectl_command(update_kubeconfig_cmd)

    # Run all kubectl commands concurrently for better performance
    pods_cmd = "kubectl get pods --all-namespaces -o json"
    nodes_cmd = "kubectl get nodes -o json"
    deployments_cmd = "kubectl get deployments --all-namespaces -o json"
    services_cmd = "kubectl get services --all-namespaces -o json"

    # Execute commands concurrently
    pods_task = run_kubectl_command(pods_cmd)
    nodes_task = run_kubectl_command(nodes_cmd)
    deployments_task = run_kubectl_command(deployments_cmd)
    services_task = run_kubectl_command(services_cmd)

    pods_output, nodes_output, deployments_output, services_output = await asyncio.gather(
        pods_task, nodes_task, deployments_task, services_task
    )

    # Process data
    pods_data = json.loads(pods_output) if pods_output else {"items": []}
    nodes_data = json.loads(nodes_output) if nodes_output else {"items": []}
    deployments_data = json.loads(deployments_output) if deployments_output else {"items": []}
    services_data = json.loads(services_output) if services_output else {"items": []}

    # Process each resource type
    pods_list = process_pods(pods_data)
    nodes_list = process_nodes(nodes_data)
    deployments_list = process_deployments(deployments_data)
    services_list = process_services(services_data)

    # Return the processed resources
    return {
        'pods': pods_list,
        'nodes': nodes_list,
        'deployments': deployments_list,
        'services': services_list
    }


def process_pods(pods_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Process raw pod data into a simplified format"""
    pods_list = []
    for pod in pods_data.get("items", []):
        pod_info = {
            "name": pod.get("metadata", {}).get("name", ""),
            "namespace": pod.get("metadata", {}).get("namespace", ""),
            "status": pod.get("status", {}).get("phase", ""),
            "ready": check_pod_ready(pod),
            "restarts": get_pod_restarts(pod),
            "age": calculate_age(pod.get("metadata", {}).get("creationTimestamp", "")),
            "cpu_usage": "N/A",  # Would need metrics-server for real values
            "memory_usage": "N/A"  # Would need metrics-server for real values
        }
        pods_list.append(pod_info)
    return pods_list


def process_nodes(nodes_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Process raw node data into a simplified format"""
    nodes_list = []
    for node in nodes_data.get("items", []):
        node_status = "Ready"
        for condition in node.get("status", {}).get("conditions", []):
            if condition.get("type") == "Ready" and condition.get("status") != "True":
                node_status = "NotReady"

        node_info = {
            "name": node.get("metadata", {}).get("name", ""),
            "status": node_status,
            "roles": get_node_roles(node),
            "age": calculate_age(node.get("metadata", {}).get("creationTimestamp", "")),
            "version": node.get("status", {}).get("nodeInfo", {}).get("kubeletVersion", ""),
            "internal_ip": get_node_internal_ip(node),
            "instance_type": node.get("metadata", {}).get("labels", {}).get("node.kubernetes.io/instance-type", ""),
            "cpu_capacity": node.get("status", {}).get("capacity", {}).get("cpu", ""),
            "memory_capacity": node.get("status", {}).get("capacity", {}).get("memory", ""),
            "cpu_percent": "N/A",  # Would need metrics-server for real values
            "memory_percent": "N/A"  # Would need metrics-server for real values
        }
        nodes_list.append(node_info)
    return nodes_list


def process_deployments(deployments_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Process raw deployment data into a simplified format"""
    deployments_list = []
    for deployment in deployments_data.get("items", []):
        deployment_info = {
            "name": deployment.get("metadata", {}).get("name", ""),
            "namespace": deployment.get("metadata", {}).get("namespace", ""),
            "desired_replicas": deployment.get("spec", {}).get("replicas", 0),
            "available_replicas": deployment.get("status", {}).get("availableReplicas", 0),
            "ready_replicas": deployment.get("status", {}).get("readyReplicas", 0),
            "age": calculate_age(deployment.get("metadata", {}).get("creationTimestamp", ""))
        }
        deployments_list.append(deployment_info)
    return deployments_list


def process_services(services_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Process raw service data into a simplified format"""
    services_list = []
    for service in services_data.get("items", []):
        service_info = {
            "name": service.get("metadata", {}).get("name", ""),
            "namespace": service.get("metadata", {}).get("namespace", ""),
            "type": service.get("spec", {}).get("type", ""),
            "cluster_ip": service.get("spec", {}).get("clusterIP", ""),
            "external_ip": get_external_ip(service),
            "ports": format_ports(service.get("spec", {}).get("ports", [])),
            "age": calculate_age(service.get("metadata", {}).get("creationTimestamp", ""))
        }
        services_list.append(service_info)
    return services_list


# Helper functions

def check_pod_ready(pod: Dict[str, Any]) -> str:
    """Check if pod is ready"""
    container_statuses = pod.get("status", {}).get("containerStatuses", [])
    if not container_statuses:
        return "0/0"

    ready_count = sum(1 for status in container_statuses if status.get("ready", False))
    return f"{ready_count}/{len(container_statuses)}"


def get_pod_restarts(pod: Dict[str, Any]) -> int:
    """Get total pod restarts"""
    container_statuses = pod.get("status", {}).get("containerStatuses", [])
    if not container_statuses:
        return 0

    return sum(status.get("restartCount", 0) for status in container_statuses)


def get_node_roles(node: Dict[str, Any]) -> str:
    """Extract node roles from labels"""
    labels = node.get("metadata", {}).get("labels", {})
    roles = []

    for label in labels:
        if label.startswith("node-role.kubernetes.io/"):
            roles.append(label.split("/")[1])

    return ", ".join(roles) if roles else "worker"


def get_node_internal_ip(node: Dict[str, Any]) -> str:
    """Get node internal IP"""
    addresses = node.get("status", {}).get("addresses", [])
    for address in addresses:
        if address.get("type") == "InternalIP":
            return address.get("address", "")
    return ""


def get_external_ip(service: Dict[str, Any]) -> str:
    """Get external IP address of service"""
    if service.get("spec", {}).get("type") == "LoadBalancer":
        ingress = service.get("status", {}).get("loadBalancer", {}).get("ingress", [])
        if ingress and len(ingress) > 0:
            return ingress[0].get("hostname", "") or ingress[0].get("ip", "")
    return "N/A"


def format_ports(ports: List[Dict[str, Any]]) -> str:
    """Format service ports"""
    port_strings = []
    for port in ports:
        protocol = port.get("protocol", "TCP")
        port_str = f"{port.get('port', '')}"
        if "targetPort" in port:
            port_str += f":{port.get('targetPort', '')}"
        port_str += f"/{protocol}"
        port_strings.append(port_str)

    return ", ".join(port_strings)


def calculate_age(timestamp_str: str) -> str:
    """Calculate age from timestamp"""
    if not timestamp_str:
        return ""

    try:
        created_time = datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%SZ")
        now = datetime.utcnow()
        diff = now - created_time

        days = diff.days
        hours, remainder = divmod(diff.seconds, 3600)
        minutes, _ = divmod(remainder, 60)

        if days > 0:
            return f"{days}d"
        elif hours > 0:
            return f"{hours}h"
        else:
            return f"{minutes}m"
    except Exception:
        return ""