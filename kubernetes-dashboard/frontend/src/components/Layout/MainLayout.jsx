import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatWindow from '../Chat/ChatWindow';
import Dashboard from '../Kubernetes/Dashboard';
import { useAppContext } from '../../context/AppContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { fetchClusters, refreshResources } = useAppContext();

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchClusters();
    // Initial resource fetch will happen after cluster is selected
  }, [fetchClusters]);

  // Refresh resources when the active tab changes to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      refreshResources();
    }
  }, [activeTab, refreshResources]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Header toggleSidebar={toggleSidebar} activeTab={activeTab} />

        {/* Content Area */}
        <main className="flex-grow p-6 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'chat' && <ChatWindow />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;