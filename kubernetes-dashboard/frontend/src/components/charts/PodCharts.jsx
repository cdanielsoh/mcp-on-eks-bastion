import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Charts for pod resource visualization
 */
function PodCharts({ pods }) {
  // Status colors for visualizations
  const STATUS_COLORS = {
    Running: '#4CAF50',    // Green
    Pending: '#FFC107',    // Yellow
    Failed: '#F44336',     // Red
    Succeeded: '#2196F3',  // Blue
    Unknown: '#9E9E9E',    // Gray
    Terminating: '#FF9800' // Orange
  };

  // Prepare data for charts
  const preparePodStatusData = () => {
    const statusCount = {};

    pods.forEach(pod => {
      statusCount[pod.status] = (statusCount[pod.status] || 0) + 1;
    });

    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  };

  const prepareNamespaceData = () => {
    const namespaceCount = {};

    pods.forEach(pod => {
      namespaceCount[pod.namespace] = (namespaceCount[pod.namespace] || 0) + 1;
    });

    return Object.keys(namespaceCount).map(namespace => ({
      name: namespace,
      value: namespaceCount[namespace]
    }));
  };

  // Create random colors for namespaces
  const getRandomColor = (index) => {
    const colors = [
      '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63',
      '#009688', '#3F51B5', '#CDDC39', '#00BCD4', '#FFC107'
    ];
    return colors[index % colors.length];
  };

  const statusData = preparePodStatusData();
  const namespaceData = prepareNamespaceData();

  // Custom formatter for PieChart tooltip
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2">
            <strong>{payload[0].name}</strong>: {payload[0].value} pods ({((payload[0].value / pods.length) * 100).toFixed(1)}%)
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom legend formatter
  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
        {payload.map((entry, index) => (
          <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center', mx: 1, mb: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%',
                mr: 0.5
              }}
            />
            <Typography variant="caption">
              {entry.value} ({entry.payload.value} pods)
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Pod Visualizations</Typography>

      <Grid container spacing={2}>
        {/* Pod Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Pod Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || '#9E9E9E'}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pod Namespace Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Pods by Namespace
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={namespaceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {namespaceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getRandomColor(index)}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PodCharts;