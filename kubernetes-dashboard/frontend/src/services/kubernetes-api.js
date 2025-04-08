/**
 * Kubernetes API service for mock data
 * This simplified version only provides mock data
 */

/**
 * Mock function to use when backend interaction fails
 * @returns {Promise<Object>} - Mock Kubernetes resources
 */
export const getMockKubernetesResources = async () => {
  // This function provides mock data for development and testing
  return {
    pods: [
      { name: 'nginx-pod-1', namespace: 'default', status: 'Running', ready: '1/1', restarts: 0, age: '2d', cpu_usage: '23m', memory_usage: '32Mi' },
      { name: 'mysql-pod-1', namespace: 'database', status: 'Running', ready: '1/1', restarts: 1, age: '5d', cpu_usage: '45m', memory_usage: '128Mi' },
      { name: 'redis-pod-1', namespace: 'cache', status: 'Running', ready: '1/1', restarts: 0, age: '1d', cpu_usage: '10m', memory_usage: '64Mi' },
      { name: 'app-backend-1', namespace: 'application', status: 'Pending', ready: '0/1', restarts: 0, age: '30m', cpu_usage: '0m', memory_usage: '0Mi' },
      { name: 'app-frontend-1', namespace: 'application', status: 'Running', ready: '1/1', restarts: 0, age: '45m', cpu_usage: '15m', memory_usage: '48Mi' },
    ],
    nodes: [
      { name: 'ip-10-0-1-23.ec2.internal', status: 'Ready', roles: 'control-plane', age: '30d', version: 'v1.24.0', internal_ip: '10.0.1.23', instance_type: 'm5.large', cpu_capacity: '2', memory_capacity: '8Gi', cpu_percent: '35', memory_percent: '45' },
      { name: 'ip-10-0-1-24.ec2.internal', status: 'Ready', roles: 'worker', age: '30d', version: 'v1.24.0', internal_ip: '10.0.1.24', instance_type: 'm5.large', cpu_capacity: '2', memory_capacity: '8Gi', cpu_percent: '25', memory_percent: '60' },
      { name: 'ip-10-0-1-25.ec2.internal', status: 'Ready', roles: 'worker', age: '30d', version: 'v1.24.0', internal_ip: '10.0.1.25', instance_type: 'm5.large', cpu_capacity: '2', memory_capacity: '8Gi', cpu_percent: '40', memory_percent: '55' },
    ],
    deployments: [
      { name: 'nginx-deployment', namespace: 'default', desired_replicas: 3, available_replicas: 3, ready_replicas: 3, age: '5d' },
      { name: 'mysql-deployment', namespace: 'database', desired_replicas: 1, available_replicas: 1, ready_replicas: 1, age: '5d' },
      { name: 'redis-deployment', namespace: 'cache', desired_replicas: 3, available_replicas: 3, ready_replicas: 3, age: '2d' },
      { name: 'app-backend', namespace: 'application', desired_replicas: 2, available_replicas: 1, ready_replicas: 1, age: '1d' },
      { name: 'app-frontend', namespace: 'application', desired_replicas: 2, available_replicas: 2, ready_replicas: 2, age: '1d' },
    ],
    services: [
      { name: 'nginx-service', namespace: 'default', type: 'ClusterIP', cluster_ip: '10.96.0.1', external_ip: 'N/A', ports: '80:80/TCP', age: '5d' },
      { name: 'mysql-service', namespace: 'database', type: 'ClusterIP', cluster_ip: '10.96.0.2', external_ip: 'N/A', ports: '3306:3306/TCP', age: '5d' },
      { name: 'redis-service', namespace: 'cache', type: 'ClusterIP', cluster_ip: '10.96.0.3', external_ip: 'N/A', ports: '6379:6379/TCP', age: '2d' },
      { name: 'app-backend-service', namespace: 'application', type: 'ClusterIP', cluster_ip: '10.96.0.4', external_ip: 'N/A', ports: '8080:8080/TCP', age: '1d' },
      { name: 'app-frontend-service', namespace: 'application', type: 'LoadBalancer', cluster_ip: '10.96.0.5', external_ip: 'a1b2c3d4.elb.us-west-2.amazonaws.com', ports: '80:80/TCP', age: '1d' },
    ]
  };
};