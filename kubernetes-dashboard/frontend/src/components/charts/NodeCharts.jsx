import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Charts for node resource visualization
 */
function NodeCharts({ nodes }) {
  // Transform node data for charts
  const prepareNodeCapacityData = () => {
    return nodes.map(node => {
      // Extract CPU capacity as number
      const cpuCapacity = parseInt(node.cpu_capacity) || 0;

      // Clean memory capacity (remove Ki, Mi, etc.) and convert to number
      const memoryCapacityStr = node.memory_capacity || '0';
      const memoryValue = parseFloat(memoryCapacityStr.replace(/[^0-9.]/g, '')) || 0;

      // Normalize memory units (assumes most common is Gi for nodes)
      let normalizedMemory = memoryValue;
      if (memoryCapacityStr.includes('Ki')) {
        normalizedMemory = memoryValue / (1024 * 1024);
      } else if (memoryCapacityStr.includes('Mi')) {
        normalizedMemory = memoryValue / 1024;
      }

      return {
        name: node.name.split('.')[0], // Shorten node name
        cpu: cpuCapacity,
        memory: Math.round(normalizedMemory * 10) / 10, // Round to 1 decimal place
        status: node.status
      };
    });
  };

  // Node status colors
  const NODE_STATUS_COLORS = {
    Ready: '#4CAF50',
    NotReady: '#F44336'
  };

  // Custom bar chart tooltip
  const renderTooltip = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      const node = nodes.find(n => n.name.includes(label));

      return (
        <Paper sx={{ p: 1.5, minWidth: 200 }}>
          <Typography variant="subtitle2">{node?.name || label}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
            <strong>Status:</strong> {node?.status || 'Unknown'}
          </Typography>
          <Typography variant="body2">
            <strong>Roles:</strong> {node?.roles || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>CPU Capacity:</strong> {node?.cpu_capacity || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Memory Capacity:</strong> {node?.memory_capacity || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>K8s Version:</strong> {node?.version || 'N/A'}
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  const nodeData = prepareNodeCapacityData();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Node Visualizations</Typography>

      <Grid container spacing={2}>
        {/* CPU Capacity Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Node CPU Capacity
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={nodeData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'CPU Cores', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Bar
                  dataKey="cpu"
                  name="CPU Cores"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Memory Capacity Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Node Memory Capacity (GB)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={nodeData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Memory (GB)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={renderTooltip} />
                <Legend />
                <Bar
                  dataKey="memory"
                  name="Memory (GB)"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Node Details Cards */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Node Details</Typography>
      <Grid container spacing={2}>
        {nodes.map((node, index) => (
          <Grid item xs={12} md={6} key={node.name || index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {node.name.split('.')[0]}
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.7em',
                      color: 'white',
                      backgroundColor: NODE_STATUS_COLORS[node.status] || '#9E9E9E'
                    }}
                  >
                    {node.status}
                  </Box>
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Roles:</strong> {node.roles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Internal IP:</strong> {node.internal_ip}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Age:</strong> {node.age}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>K8s Version:</strong> {node.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Instance Type:</strong> {node.instance_type || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>CPU/Memory:</strong> {node.cpu_capacity} cores / {node.memory_capacity}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NodeCharts;