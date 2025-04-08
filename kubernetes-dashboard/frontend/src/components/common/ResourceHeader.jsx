import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Header component for resource monitor with cluster selection and refresh controls
 */
function ResourceHeader({
  title,
  selectedCluster,
  availableClusters,
  onClusterChange,
  onRefresh,
  isLoading,
  timestamp
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Cluster selection and refresh button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <FormControl sx={{ minWidth: 300, mr: 2 }}>
          <InputLabel id="cluster-select-label">EKS Cluster</InputLabel>
          <Select
            labelId="cluster-select-label"
            value={selectedCluster}
            label="EKS Cluster"
            onChange={(e) => onClusterChange(e.target.value)}
            disabled={isLoading || availableClusters.length <= 1}
          >
            {availableClusters.map((cluster) => (
              <MenuItem key={cluster} value={cluster}>
                {cluster}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          Last updated: {timestamp.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default ResourceHeader;