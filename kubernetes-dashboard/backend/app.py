import chainlit as cl
import asyncio
import json
import time
from InlineAgent.agent import InlineAgent
from InlineAgent.tools import MCPHttp
from utils.kubernetes_helper import fetch_kubernetes_resources, get_eks_clusters

# Configuration
EC2_HOST = "ec2-35-85-57-47.us-west-2.compute.amazonaws.com"
MCP_PORT = 8000
EKS_CLUSTER = "23D6D50DCD777B7C1572AF24A62D7388.gr7.us-west-2.eks.amazonaws.com"

# Global variables
agent = None
mcp_client = None
kubernetes_resources = {
    'pods': [],
    'nodes': [],
    'deployments': [],
    'services': []
}
last_update_time = 0


async def initialize_agent():
    """Initialize the MCP client and InlineAgent"""
    global agent, mcp_client

    try:
        # Configure connection to the Kubernetes MCP server
        mcp_client = await MCPHttp.create(
            url=f"http://{EC2_HOST}:{MCP_PORT}/sse",
            headers={},
            timeout=10,
            sse_read_timeout=300
        )

        # Create the InlineAgent with the MCP client
        agent = InlineAgent(
            foundation_model="us.anthropic.claude-3-5-haiku-20241022-v1:0",
            instruction="""You are a Kubernetes cluster management assistant that helps users manage their EKS cluster.
            You have access to various kubectl commands through an MCP server.
            When users ask you about Kubernetes resources or want to perform actions, use the appropriate tools.
            Always show the relevant information clearly and explain what you're doing.
            """,
            agent_name="kubernetes-assistant",
            action_groups=[
                {
                    "name": "KubernetesActions",
                    "description": "Tools for managing Kubernetes clusters",
                    "mcp_clients": [mcp_client]
                }
            ]
        )

        return agent
    except Exception as e:
        # Send error message
        await cl.Message(f"Error initializing agent: {str(e)}").send()
        return None


async def close_mcp_client():
    """Close the MCP client connection"""
    global mcp_client
    if mcp_client:
        try:
            await mcp_client.aclose()
        except Exception:
            pass
        mcp_client = None


# Register chatlit actions for API-like functionality
@cl.action_callback("get_kubernetes_resources")
async def get_kubernetes_resources_action(action):
    """Action to get Kubernetes resources"""
    global kubernetes_resources, last_update_time

    try:
        # Parse payload
        namespace = 'All namespaces'
        if action.payload:
            payload_data = json.loads(action.payload)
            namespace = payload_data.get('namespace', 'All namespaces')

        # Check if we need to update the cache (every 30 seconds)
        current_time = time.time()
        if current_time - last_update_time > 30:
            # Fetch resources from Kubernetes
            kubernetes_resources = await fetch_kubernetes_resources(EKS_CLUSTER)
            last_update_time = current_time

        # Filter by namespace if provided
        if namespace and namespace != 'All namespaces':
            filtered_resources = {
                'pods': [pod for pod in kubernetes_resources['pods'] if pod['namespace'] == namespace],
                'deployments': [dep for dep in kubernetes_resources['deployments'] if dep['namespace'] == namespace],
                'services': [svc for svc in kubernetes_resources['services'] if svc['namespace'] == namespace],
                'nodes': kubernetes_resources['nodes']  # Nodes don't have namespaces
            }
            return await cl.Message(json.dumps(filtered_resources)).send()

        # Return all resources
        return await cl.Message(json.dumps(kubernetes_resources)).send()
    except Exception as e:
        error_message = {"error": str(e)}
        return await cl.Message(json.dumps(error_message)).send()


@cl.action_callback("get_eks_clusters")
async def get_eks_clusters_action(action):
    """Action to get available EKS clusters"""
    try:
        # Get available EKS clusters
        clusters = await get_eks_clusters()
        return await cl.Message(json.dumps({"clusters": clusters})).send()
    except Exception as e:
        error_message = {"error": str(e), "clusters": [EKS_CLUSTER]}
        return await cl.Message(json.dumps(error_message)).send()


@cl.action_callback("refresh_resources")
async def refresh_resources_action(action):
    """Action to force refresh Kubernetes resources"""
    global kubernetes_resources, last_update_time

    try:
        # Parse payload
        cluster_name = EKS_CLUSTER
        if action.payload:
            payload_data = json.loads(action.payload)
            cluster_name = payload_data.get('cluster', EKS_CLUSTER)

        # Force refresh resources
        kubernetes_resources = await fetch_kubernetes_resources(cluster_name)
        last_update_time = time.time()

        response = {"success": True, "resources": kubernetes_resources}
        return await cl.Message(json.dumps(response)).send()
    except Exception as e:
        error_message = {"error": str(e), "success": False}
        return await cl.Message(json.dumps(error_message)).send()


@cl.on_chat_start
async def start_chat():
    """Initialize the chat session"""
    # Send a welcome message
    await cl.Message("# ☸️ Welcome to the Kubernetes Cluster Manager\n\n"
                     "This assistant helps you manage your Kubernetes cluster through natural language commands.").send()

    # Show connection settings
    await cl.Message(f"## Connection Settings\n"
                     f"- EC2 Host: `{EC2_HOST}`\n"
                     f"- MCP Port: `{MCP_PORT}`\n"
                     f"- Cluster: `{EKS_CLUSTER}`").send()

    # Initialize the agent
    await cl.Message("Initializing Kubernetes assistant...").send()

    global agent
    agent = await initialize_agent()

    if agent:
        await cl.Message("✅ Kubernetes assistant initialized successfully!").send()

        # Initial greeting from the assistant
        try:
            initial_response = await agent.invoke(
                "Hello! I'm your Kubernetes assistant. How can I help you with your EKS cluster today?"
            )
            await cl.Message(initial_response).send()
        except Exception as e:
            await cl.Message(f"Error: {str(e)}").send()
    else:
        await cl.Message("⚠️ Failed to initialize Kubernetes assistant.").send()


@cl.on_message
async def on_message(message: cl.Message):
    """Handle user messages"""
    global agent

    if not agent:
        await cl.Message("Initializing agent...").send()
        agent = await initialize_agent()

        if not agent:
            await cl.Message(
                "⚠️ Failed to initialize the Kubernetes assistant. Please check your connection settings.").send()
            return

        await cl.Message("✅ Agent initialized successfully!").send()

    # Process the message
    try:
        # Let the user know we're processing
        processing_msg = await cl.Message("Processing your request...").send()

        # Get response from agent
        response = await agent.invoke(message.content)

        # Update processing message with response
        await cl.Message(response).send()

    except Exception as e:
        await cl.Message(f"⚠️ Error: {str(e)}").send()


@cl.on_stop
async def on_stop():
    """Clean up when the chat stops"""
    await close_mcp_client()