import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useChatInteract, useChatMessages } from '@chainlit/react-client';

// Create context
const AppContext = createContext();

// Custom provider component
export const AppProvider = ({ children }) => {
  // State for Kubernetes resources
  const [resources, setResources] = useState({
    pods: [],
    nodes: [],
    deployments: [],
    services: []
  });
  const [selectedNamespace, setSelectedNamespace] = useState('All namespaces');
  const [namespaces, setNamespaces] = useState(['All namespaces']);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceType, setResourceType] = useState('pods');
  const [isLoading, setIsLoading] = useState(false);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState('');

  // Use Chainlit hooks
  const { callAction } = useChatInteract();
  const { messages } = useChatMessages();

  // Extract available namespaces from resources
  useEffect(() => {
    if (resources.pods.length > 0) {
      const uniqueNamespaces = [...new Set(resources.pods.map(pod => pod.namespace))];
      setNamespaces(['All namespaces', ...uniqueNamespaces]);
    }
  }, [resources.pods]);

  // Function to refresh Kubernetes resources
  const refreshResources = useCallback(async () => {
    setIsLoading(true);
    try {
      await callAction({
        name: 'refresh_resources',
        payload: JSON.stringify({ cluster: selectedCluster })
      });

      // The response will be in the messages, so we'll check for the latest message
      // with JSON content after a delay
      setTimeout(() => {
        const latestJsonMessage = [...messages].reverse().find(msg => {
          try {
            const parsed = JSON.parse(msg.output);
            return parsed.success === true && parsed.resources;
          } catch (e) {
            return false;
          }
        });

        if (latestJsonMessage) {
          const parsedData = JSON.parse(latestJsonMessage.output);
          setResources(parsedData.resources);
        }

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing resources:', error);
      setIsLoading(false);
    }
  }, [callAction, messages, selectedCluster]);

  // Function to fetch resources filtered by namespace
  const fetchResourcesByNamespace = useCallback(async (namespace) => {
    setIsLoading(true);
    try {
      await callAction({
        name: 'get_kubernetes_resources',
        payload: JSON.stringify({ namespace })
      });

      // Wait for the response in messages
      setTimeout(() => {
        const latestJsonMessage = [...messages].reverse().find(msg => {
          try {
            JSON.parse(msg.output);
            return true;
          } catch (e) {
            return false;
          }
        });

        if (latestJsonMessage) {
          const parsedData = JSON.parse(latestJsonMessage.output);
          if (!parsedData.error) {
            setResources(parsedData);
          }
        }

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching resources by namespace:', error);
      setIsLoading(false);
    }
  }, [callAction, messages]);

  // Function to fetch available EKS clusters
  const fetchClusters = useCallback(async () => {
    try {
      await callAction({
        name: 'get_eks_clusters'
      });

      // Wait for the response in messages
      setTimeout(() => {
        const latestJsonMessage = [...messages].reverse().find(msg => {
          try {
            const parsed = JSON.parse(msg.output);
            return parsed.clusters;
          } catch (e) {
            return false;
          }
        });

        if (latestJsonMessage) {
          const parsedData = JSON.parse(latestJsonMessage.output);
          if (parsedData.clusters && Array.isArray(parsedData.clusters)) {
            setClusters(parsedData.clusters);
            if (parsedData.clusters.length > 0 && !selectedCluster) {
              setSelectedCluster(parsedData.clusters[0]);
            }
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
  }, [callAction, messages, selectedCluster]);

  // Function to change selected namespace and fetch filtered resources
  const changeNamespace = useCallback((namespace) => {
    setSelectedNamespace(namespace);
    fetchResourcesByNamespace(namespace);
  }, [fetchResourcesByNamespace]);

  // Function to select a resource for detailed view
  const selectResource = useCallback((resource, type) => {
    setSelectedResource(resource);
    setResourceType(type);
  }, []);

  // Value object to be provided to consumers
  const value = {
    resources,
    namespaces,
    selectedNamespace,
    selectedResource,
    resourceType,
    isLoading,
    clusters,
    selectedCluster,
    setSelectedCluster,
    refreshResources,
    changeNamespace,
    selectResource,
    fetchClusters
  };

  // Using React.createElement instead of JSX syntax which might be causing parsing issues
  return React.createElement(
    AppContext.Provider,
    { value },
    children
  );
};

// Custom hook for consuming the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;