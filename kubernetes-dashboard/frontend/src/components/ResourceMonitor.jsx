import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PodCharts from './charts/PodCharts';
import NodeCharts from './charts/NodeCharts';
import DeploymentCharts from './charts/DeploymentCharts';
import ServiceCharts from './charts/ServiceCharts';
import ResourceTable from './tables/ResourceTable';
import TabPanel from './tables/TabPanel';
import ResourceHeader from './common/ResourceHeader';

/**
 * Component for displaying and monitoring Kubernetes resources
 */
function ResourceMonitor({
  resources,
  isLoading,
  timestamp,
  selectedNamespace,
  onNamespaceChange,
  searchTerm,
  onSearchChange,
  selectedCluster,
  availableClusters,
  onClusterChange,
  onRefresh,
  error
}) {
  const [activeTab, setActiveTab] = useState(0);

  // Get unique namespaces from resources
  const getUniqueNamespaces = () => {
    const namespaces = new Set();

    // Add namespaces from pods
    resources.pods.forEach(pod => {
      if (pod.namespace) namespaces.add(pod.namespace);
    });

    // Add namespaces from deployments
    resources.deployments.forEach(deployment => {
      if (deployment.namespace) namespaces.add(deployment.namespace);
    });

    // Add namespaces from services
    resources.services.forEach(service => {
      if (service.namespace) namespaces.add(service.namespace);
    });

    return ['All namespaces', ...Array.from(namespaces).sort()];
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter resources based on namespace and search term
  const getFilteredResources = (resourceList, resourceType) => {
    let filtered = [...resourceList];

    // Filter by namespace if applicable and not "All namespaces"
    if (selectedNamespace !== 'All namespaces' && filtered.some(item => item.namespace)) {
      filtered = filtered.filter(item => item.namespace === selectedNamespace);
    }

    // Apply search filter for pods
    if (searchTerm && resourceType === 'pods') {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Column definitions for different resource types
  const columnDefinitions = {
    pods: [
      { id: 'name', label: 'Name' },
      { id: 'namespace', label: 'Namespace' },
      { id: 'status', label: 'Status' },
      { id: 'ready', label: 'Ready' },
      { id: 'restarts', label: 'Restarts' },
      { id: 'age', label: 'Age' },
      { id: 'cpu_usage', label: 'CPU' },
      { id: 'memory_usage', label: 'Memory' }
    ],
    nodes: [
      { id: 'name', label: 'Name' },
      { id: 'status', label: 'Status' },
      { id: 'roles', label: 'Roles' },
      { id: 'age', label: 'Age' },
      { id: 'version', label: 'Version' },
      { id: 'internal_ip', label: 'Internal IP' },
      { id: 'instance_type', label: 'Instance Type' },
      { id: 'cpu_capacity', label: 'CPU Capacity' },
      { id: 'memory_capacity', label: 'Memory Capacity' }
    ],
    deployments: [
      { id: 'name', label: 'Name' },
      { id: 'namespace', label: 'Namespace' },
      { id: 'desired_replicas', label: 'Desired' },
      { id: 'available_replicas', label: 'Available' },
      { id: 'ready_replicas', label: 'Ready' },
      { id: 'age', label: 'Age' }
    ],
    services: [
      { id: 'name', label: 'Name' },
      { id: 'namespace', label: 'Namespace' },
      { id: 'type', label: 'Type' },
      { id: 'cluster_ip', label: 'Cluster IP' },
      { id: 'external_ip', label: 'External IP' },
      { id: 'ports', label: 'Ports' },
      { id: 'age', label: 'Age' }
    ]
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
      <ResourceHeader
        title="Kubernetes Resource Monitor"
        selectedCluster={selectedCluster}
        availableClusters={availableClusters}
        onClusterChange={onClusterChange}
        onRefresh={onRefresh}
        isLoading={isLoading}
        timestamp={timestamp}
      />

      {/* Error message if any */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Resource tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Pods" />
          <Tab label="Nodes" />
          <Tab label="Deployments" />
          <Tab label="Services" />
        </Tabs>
      </Box>

      {/* Pods tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Namespace</InputLabel>
            <Select
              value={selectedNamespace}
              label="Namespace"
              onChange={(e) => onNamespaceChange(e.target.value)}
              disabled={isLoading}
            >
              {getUniqueNamespaces().map((namespace) => (
                <MenuItem key={namespace} value={namespace}>{namespace}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            sx={{ flexGrow: 1 }}
            label="Search pods"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
          />
        </Box>

        <ResourceTable
          data={getFilteredResources(resources.pods, 'pods')}
          columns={columnDefinitions.pods}
          isLoading={isLoading}
        />

        <PodCharts
          pods={getFilteredResources(resources.pods, 'pods')}
        />
      </TabPanel>

      {/* Nodes tab */}
      <TabPanel value={activeTab} index={1}>
        <ResourceTable
          data={resources.nodes}
          columns={columnDefinitions.nodes}
          isLoading={isLoading}
        />

        <NodeCharts
          nodes={resources.nodes}
        />
      </TabPanel>

      {/* Deployments tab */}
      <TabPanel value={activeTab} index={2}>
        <Box sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Namespace</InputLabel>
            <Select
              value={selectedNamespace}
              label="Namespace"
              onChange={(e) => onNamespaceChange(e.target.value)}
              disabled={isLoading}
            >
              {getUniqueNamespaces().map((namespace) => (
                <MenuItem key={namespace} value={namespace}>{namespace}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ResourceTable
          data={getFilteredResources(resources.deployments, 'deployments')}
          columns={columnDefinitions.deployments}
          isLoading={isLoading}
        />

        <DeploymentCharts
          deployments={getFilteredResources(resources.deployments, 'deployments')}
        />
      </TabPanel>

      {/* Services tab */}
      <TabPanel value={activeTab} index={3}>
        <Box sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Namespace</InputLabel>
            <Select
              value={selectedNamespace}
              label="Namespace"
              onChange={(e) => onNamespaceChange(e.target.value)}
              disabled={isLoading}
            >
              {getUniqueNamespaces().map((namespace) => (
                <MenuItem key={namespace} value={namespace}>{namespace}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ResourceTable
          data={getFilteredResources(resources.services, 'services')}
          columns={columnDefinitions.services}
          isLoading={isLoading}
        />

        <ServiceCharts
          services={getFilteredResources(resources.services, 'services')}
        />
      </TabPanel>
    </Paper>
  );
}

export default ResourceMonitor;