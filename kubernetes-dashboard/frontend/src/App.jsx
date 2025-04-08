import React, { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { useChatSession } from '@chainlit/react-client';
import KubernetesManager from './components/KubernetesManager';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3261a8', // Kubernetes blue
    },
    secondary: {
      main: '#326ce5', // Lighter Kubernetes blue
    },
    background: {
      default: '#f5f5f5', // Light gray background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
  },
});

/**
 * Main application component
 */
function App() {
  // Connect to the chat session
  const { connect, disconnect } = useChatSession();

  useEffect(() => {
    // Establish connection when the component mounts
    connect({
      userEnv: {}, // Add any user environment variables here if needed
    });

    // Disconnect when the component unmounts
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
          >
            <img
              src="https://kubernetes.io/images/favicon.png"
              alt="Kubernetes Logo"
              style={{ height: 24, marginRight: 8 }}
            />
            Kubernetes Cluster Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <KubernetesManager />
    </ThemeProvider>
  );
}

export default App;