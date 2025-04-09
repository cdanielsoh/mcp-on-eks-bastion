import React from 'react';

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-20`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0681 2.00692C10.6502 1.55144 11.3149 1.30078 12 1.30078C12.6851 1.30078 13.3498 1.55144 13.9319 2.00692L21.0827 7.50175C21.4966 7.82771 21.8336 8.24566 22.0703 8.72118C22.307 9.19669 22.4373 9.7184 22.4519 10.2499C22.4664 10.7815 22.3649 11.3098 22.1543 11.7978C21.9437 12.2859 21.6296 12.7214 21.2338 13.0682L13.9319 18.9931C13.3498 19.4486 12.6851 19.6992 12 19.6992C11.3149 19.6992 10.6502 19.4486 10.0681 18.9931L2.76615 13.0682C2.37039 12.7214 2.05634 12.2859 1.84573 11.7978C1.63513 11.3098 1.53361 10.7815 1.54811 10.2499C1.56262 9.7184 1.69299 9.19669 1.92967 8.72118C2.16635 8.24566 2.50344 7.82771 2.91731 7.50175L10.0681 2.00692Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-lg font-semibold">Kubernetes UI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="px-2 py-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                  activeTab === item.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Connection Info */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <div className="mb-1">Connection Settings:</div>
          <div className="truncate">EC2 Host: <span className="text-gray-300">ec2-35-85-57-47.us-west-2.compute.amazonaws.com</span></div>
          <div>MCP Port: <span className="text-gray-300">8000</span></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;