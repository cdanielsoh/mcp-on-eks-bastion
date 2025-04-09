import React, { useState } from 'react';

const ResourceList = ({ resources, resourceType, onResourceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Define column headers based on resource type
  const getColumns = () => {
    switch (resourceType) {
      case 'pods':
        return [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'namespace', label: 'Namespace' },
        ];
      case 'deployments':
        return [
          { key: 'name', label: 'Name' },
          { key: 'replicas', label: 'Replicas' },
          { key: 'namespace', label: 'Namespace' },
        ];
      case 'services':
        return [
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'namespace', label: 'Namespace' },
        ];
      case 'nodes':
        return [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'role', label: 'Role' },
        ];
      default:
        return [{ key: 'name', label: 'Name' }];
    }
  };

  // Filter resources based on search term
  const filteredResources = resources.filter((resource) => {
    return resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           resource.namespace?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle resource selection
  const handleSelect = (resource) => {
    setSelectedItem(resource.name);
    onResourceSelect(resource);
  };

  // Get status color for pods
  const getStatusColor = (status) => {
    switch (status) {
      case 'Running':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Succeeded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = getColumns();

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={`Search ${resourceType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <tr
                  key={resource.name}
                  onClick={() => handleSelect(resource)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedItem === resource.name ? 'bg-blue-50' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${resource.name}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {column.key === 'status' ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(resource[column.key])}`}>
                          {resource[column.key]}
                        </span>
                      ) : (
                        <div className="text-gray-900">{resource[column.key]}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm ? 'No matching resources found' : 'No resources available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceList;