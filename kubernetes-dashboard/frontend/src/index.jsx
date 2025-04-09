import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ChainlitAPI, ChainlitContext } from '@chainlit/react-client';
import App from './App';
import './index.css';

// Get the server URL from environment variables or use a default
// Note the /chainlit path which is where your FastAPI app mounts Chainlit
const CHAINLIT_SERVER_URL = 'http://localhost:8000/chainlit';

// Initialize the Chainlit API client
const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, 'kubernetes-dashboard');

// Log connection info
console.log(`Connecting to Chainlit server at: ${CHAINLIT_SERVER_URL}`);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChainlitContext.Provider value={apiClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ChainlitContext.Provider>
  </React.StrictMode>
);