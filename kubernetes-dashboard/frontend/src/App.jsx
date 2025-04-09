import React, { useEffect } from 'react';
import { useChatSession, useChatData, sessionState } from '@chainlit/react-client';
import MainLayout from './components/Layout/MainLayout';
import { AppProvider } from './context/AppContext';
import { useRecoilValue } from "recoil";

function App() {
  const { connect } = useChatSession();
  const { loading, connected, error } = useChatData();
  const session = useRecoilValue(sessionState);

  // Connect to the Chainlit WebSocket server on component mount
  useEffect(() => {
    // Connect to the Chainlit server
    if (session?.socket.connected) {
      return;
    }
    fetch("http://localhost:8000", {credentials: "include"})
      .then(() => {
        connect({
          userEnv
        });
      });
  }, [connect]);

  // Handle connection states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Connecting to Kubernetes Assistant...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">
          Error connecting to Kubernetes Assistant. Please check if the server is running.
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Disconnected from Kubernetes Assistant. Attempting to reconnect...</div>
      </div>
    );
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;