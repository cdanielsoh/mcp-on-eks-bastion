import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Header = ({ toggleSidebar, activeTab }) => {
  const {
    selectedNamespace,
    namespaces,
    changeNamespace,
    refreshResources,
    isLoading,
    clusters,
    selectedCluster,
    setSelectedCluster
  } = useAppContext();

  const handleClusterChange = (e) => {
    const newCluster = e.target.value;
    setSelectedCluster(newCluster);
    // Refresh resources for the new cluster
    setTimeout(() => refreshResources(), 100);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' ? 'Kubernetes Dashboard' : 'Chat with Kubernetes Assistant'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {activeTab === 'dashboard' && (
            <>
              {/* Cluster Selector */}
              <div className="flex items-center">
                <label htmlFor="cluster" className="mr-2 text-sm font-medium text-gray-700">
                  Cluster:
                </label>
                <select
                  id="cluster"
                  value={selectedCluster}
                  onChange={handleClusterChange}
                  className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {clusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                      {cluster}
                    </option>
                  ))}
                </select>
              </div>

              {/* Namespace Selector */}
              <div className="flex items-center">
                <label htmlFor="namespace" className="mr-2 text-sm font-medium text-gray-700">
                  Namespace:
                </label>
                <select
                  id="namespace"
                  value={selectedNamespace}
                  onChange={(e) => changeNamespace(e.target.value)}
                  className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {namespaces.map((namespace) => (
                    <option key={namespace} value={namespace}>
                      {namespace}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshResources}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>Refresh</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;