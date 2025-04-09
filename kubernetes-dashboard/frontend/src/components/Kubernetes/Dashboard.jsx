import React, { useState } from 'react';
import ResourceList from './ResourceList';
import ResourceDetails from './ResourceDetails';
import ClusterInfo from './ClusterInfo';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { resources, selectedResource, resourceType, selectResource } = useAppContext();
  const [activeResourceType, setActiveResourceType] = useState('pods');

  const tabs = [
    { id: 'pods', label: 'Pods', count: resources.pods.length },
    { id: 'deployments', label: 'Deployments', count: resources.deployments.length },
    { id: 'services', label: 'Services', count: resources.services.length },
    { id: 'nodes', label: 'Nodes', count: resources.nodes.length },
  ];

  const handleTabChange = (tabId) => {
    setActiveResourceType(tabId);
    selectResource(null, tabId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Cluster Info */}
      <ClusterInfo />

      <div className="flex-grow flex mt-6 space-x-6">
        {/* Left panel: Resource list */}
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow">
          {/* Tabs for resource types */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeResourceType === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                    activeResourceType === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Resource list */}
          <ResourceList
            resources={resources[activeResourceType] || []}
            resourceType={activeResourceType}
            onResourceSelect={(resource) => selectResource(resource, activeResourceType)}
          />
        </div>

        {/* Right panel: Resource details */}
        <div className="w-1/2 bg-white rounded-lg shadow">
          <ResourceDetails resource={selectedResource} resourceType={resourceType} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;