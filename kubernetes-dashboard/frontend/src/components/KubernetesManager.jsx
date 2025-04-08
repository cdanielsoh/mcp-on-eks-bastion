import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Paper, Alert } from '@mui/material';
import { useChatData, useChatInteract } from '@chainlit/react-client';
import ChainlitChatbox from './ChainlitChatbox';
import ResourceMonitor from './ResourceMonitor';
import { getMockKubernetesResources } from '../services/kubernetes-api';

// Configuration
const EC2_HOST = "ec2-35-85-57-47.us-west-2.compute.amazonaws.com";
const MCP_PORT = 8000;
const DEFAULT_CLUSTER = "23D6D50DCD777B7C1572AF24A62D7388.gr7.us-west-2.eks.amazonaws.com";

/**
 * Main component that combines chat interface and resource monitoring
 */
function KubernetesManager() {
  const { callAction } = useChatInteract();
  const { loading } = useChatData();

  const [kubernetesResources, setKubernetesResources] = useState({
    pods: [],
    nodes: [],
    deployments: [],
    services: []
  });
  const [resourceTimestamp, setResourceTimestamp] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState('All namespaces');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState(DEFAULT_CLUSTER);
  const [availableClusters, setAvailableClusters] = useState([DEFAULT_CLUSTER]);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false); // Toggle for development

  // Function to parse JSON from action response
  const parseActionResponse = (response) => {
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error parsing action response:', error);
      return null;
    }
  };

  // Function to fetch Kubernetes resources
  const fetchKubernetesResources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data;
      if (useMockData) {
        // Use mock data for development/testing
        data = await getMockKubernetesResources();
      } else {
        // Call the action and parse response
        const actionResponse = await callAction({
          name: 'get_kubernetes_resources',
          value: JSON.stringify({ namespace: selectedNamespace }),
        });

        // Parse the response
        data = parseActionResponse(actionResponse);

        if (!data) {
          throw new Error('Failed to parse resources data');
        }

        // Check for errors in response
        if (data.error) {
          throw new Error(data.error);
        }
      }

      setKubernetesResources(data);
      setResourceTimestamp(new Date());
    } catch (error) {
      console.error("Error fetching Kubernetes resources:", error);
      setError(`Failed to fetch resources: ${error.message}`);

      // Fall back to mock data if API fails
      if (!useMockData) {
        console.log("Falling back to mock data");
        const mockData = await getMockKubernetesResources();
        setKubernetesResources(mockData);
        setUseMockData(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh resources
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for development/testing
        const data = await getMockKubernetesResources();
        setKubernetesResources(data);
      } else {
        // Call the action and parse response
        const actionResponse = await callAction({
          name: 'refresh_resources',
          value: JSON.stringify({ cluster: selectedCluster }),
        });

        // Parse the response
        const data = parseActionResponse(actionResponse);

        if (!data) {
          throw new Error('Failed to parse refresh response');
        }

        // Check for success
        if (!data.success) {
          throw new Error(data.error || 'Failed to refresh resources');
        }

        setKubernetesResources(data.resources);
      }

      setResourceTimestamp(new Date());
    } catch (error) {
      console.error("Error refreshing resources:", error);
      setError(`Failed to refresh resources: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available clusters
  const fetchClusters = async () => {
    try {
      if (!useMockData) {
        // Call the action and parse response
        const actionResponse = await callAction({
          name: 'get_eks_clusters',
          value: JSON.stringify({}),
        });

        // Parse the response
        const data = parseActionResponse(actionResponse);

        if (data && data.clusters && data.clusters.length > 0) {
          setAvailableClusters(data.clusters);
          if (!data.clusters.includes(selectedCluster)) {
            setSelectedCluster(data.clusters[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching clusters:", error);
      // Keep using the default cluster if we can't fetch the list
    }
  };

  // Fetch clusters and resources when component mounts
  useEffect(() => {
    fetchClusters();
    fetchKubernetesResources();

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchKubernetesResources();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch resources when selected cluster changes
  useEffect(() => {
    if (selectedCluster) {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCluster]);

  // Handle namespace change
  const handleNamespaceChange = (namespace) => {
    setSelectedNamespace(namespace);
    // If using the real API with backend filtering
    if (!useMockData) {
      fetchKubernetesResources();
    }
  };

  // Handle cluster change
  const handleClusterChange = (cluster) => {
    setSelectedCluster(cluster);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ height: 'calc(100vh - 64px)', p: 2 }}>
      {/* Chat Interface */}
      <Box sx={{ width: '40%', height: '100%', overflow: 'auto' }}>
        <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            ☸️ Kubernetes Assistant
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Connection: {EC2_HOST}:{MCP_PORT}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cluster: {selectedCluster}
            </Typography>
          </Box>
          {useMockData && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Using mock data for visualization. Chat functionality is still connected to the real cluster.
            </Alert>
          )}
          <Stack sx={{ height: 'calc(100% - 100px)' }}>
            <ChainlitChatbox />
          </Stack>
        </Paper>
      </Box>

      {/* Kubernetes Resources Interface */}
      <Box sx={{ width: '60%', height: '100%', overflow: 'auto' }}>
        <ResourceMonitor
          resources={kubernetesResources}
          isLoading={isLoading || loading}
          timestamp={resourceTimestamp}
          selectedNamespace={selectedNamespace}
          onNamespaceChange={handleNamespaceChange}
          searchTerm={searchTerm}
          onSearchChange={(term) => setSearchTerm(term)}
          selectedCluster={selectedCluster}
          availableClusters={availableClusters}
          onClusterChange={handleClusterChange}
          onRefresh={handleRefresh}
          error={error}
        />
      </Box>
    </Stack>
  );
}

export default KubernetesManager;