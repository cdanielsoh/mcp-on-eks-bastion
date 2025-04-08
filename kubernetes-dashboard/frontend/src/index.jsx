import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ChainlitAPI, ChainlitContext } from '@chainlit/react-client';
import App from './App';
import './styles.css';

// Configuration for Chainlit server
const CHAINLIT_SERVER_URL = 'http://localhost:8000';
const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, 'webapp');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChainlitContext.Provider value={apiClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ChainlitContext.Provider>
  </React.StrictMode>
);