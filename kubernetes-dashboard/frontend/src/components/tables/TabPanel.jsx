import React from 'react';
import { Box } from '@mui/material';

/**
 * Tab panel component for displaying content in tabs
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`kubernetes-tabpanel-${index}`}
      aria-labelledby={`kubernetes-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;