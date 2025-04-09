import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ClusterInfo = () => {
  const { resources, selectedCluster, selectedNamespace } = useAppContext();

  // Calculate summary statistics
  const stats = [
    { name: 'Pods', value: resources.pods.length, icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ) },
    { name: 'Deployments', value: resources.deployments.length, icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ) },
    { name: 'Services', value: resources.services.length, icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ) },
    { name: 'Nodes', value: resources.nodes.length, icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ) },
  ];

  // Find running vs total pods
  const runningPods = resources.pods.filter(pod => pod.status === 'Running').length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Cluster Overview</h2>
          <p className="text-sm text-gray-500">
            Cluster: <span className="font-medium">{selectedCluster || 'Not selected'}</span>
            {selectedNamespace !== 'All namespaces' && (
              <> | Namespace: <span className="font-medium">{selectedNamespace}</span></>
            )}
          </p>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {runningPods} / {resources.pods.length} pods running
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">{stat.icon}</div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">{stat.name}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterInfo;