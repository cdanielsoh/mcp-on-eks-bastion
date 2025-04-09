import React, { useState } from 'react';

const ResourceDetails = ({ resource, resourceType }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!resource) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">No resource selected</h3>
          <p className="mt-1 text-sm text-gray-500">Select a resource from the list to view details.</p>
        </div>
      </div>
    );
  }

  // Format resource details based on resource type
  const getResourceDetails = () => {
    switch (resourceType) {
      case 'pods':
        return [
          { label: 'Name', value: resource.name },
          { label: 'Namespace', value: resource.namespace },
          { label: 'Status', value: resource.status },
          { label: 'Pod IP', value: resource.podIP || 'N/A' },
          { label: 'Node', value: resource.nodeName || 'N/A' },
          { label: 'Created', value: resource.creationTimestamp || 'N/A' },
        ];
      case 'deployments':
        return [
          { label: 'Name', value: resource.name },
          { label: 'Namespace', value: resource.namespace },
          { label: 'Replicas', value: `${resource.availableReplicas || 0}/${resource.replicas || 0}` },
          { label: 'Strategy', value: resource.strategy || 'N/A' },
          { label: 'Created', value: resource.creationTimestamp || 'N/A' },
        ];
      case 'services':
        return [
          { label: 'Name', value: resource.name },
          { label: 'Namespace', value: resource.namespace },
          { label: 'Type', value: resource.type },
          { label: 'Cluster IP', value: resource.clusterIP || 'N/A' },
          { label: 'External IP', value: resource.externalIP || 'N/A' },
          { label: 'Ports', value: resource.ports ? resource.ports.join(', ') : 'N/A' },
          { label: 'Created', value: resource.creationTimestamp || 'N/A' },
        ];
      case 'nodes':
        return [
          { label: 'Name', value: resource.name },
          { label: 'Status', value: resource.status },
          { label: 'Role', value: resource.role || 'N/A' },
          { label: 'Internal IP', value: resource.internalIP || 'N/A' },
          { label: 'External IP', value: resource.externalIP || 'N/A' },
          { label: 'OS', value: resource.os || 'N/A' },
          { label: 'Architecture', value: resource.architecture || 'N/A' },
          { label: 'Kernel Version', value: resource.kernelVersion || 'N/A' },
          { label: 'Container Runtime', value: resource.containerRuntime || 'N/A' },
        ];
      default:
        return [{ label: 'Name', value: resource.name }];
    }
  };

  // Format the YAML representation
  const formatYAML = () => {
    // Simple YAML formatter
    const obj = { ...resource };
    // Delete some unnecessary fields for cleaner output
    delete obj.events;

    return JSON.stringify(obj, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
      .replace(/"/g, '\''); // Replace double quotes with single quotes for values
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {resourceType.charAt(0).toUpperCase() + resourceType.slice(0, -1).slice(1)} Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">{resource.name}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('yaml')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'yaml'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            YAML
          </button>
          {resourceType === 'pods' && (
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Logs
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-auto p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {getResourceDetails().map((detail) => (
                <div key={detail.label} className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === 'yaml' && (
          <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto">
            <pre className="text-sm">{formatYAML()}</pre>
          </div>
        )}

        {activeTab === 'logs' && resourceType === 'pods' && (
          <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto h-full">
            <p className="text-gray-400 mb-2">// Logs for {resource.name}</p>
            <p className="text-gray-400 mb-4 text-sm">To view real logs, click on "Chat" and ask the Kubernetes assistant to show logs for this pod.</p>
            <pre className="text-sm text-gray-300">
              {`Logs would be displayed here through the Kubernetes agent.
To fetch logs, please use the Chat interface:

Example command: "Show logs for pod ${resource.name} in namespace ${resource.namespace}"`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetails;