import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Charts for deployment resource visualization
 */
function DeploymentCharts({ deployments }) {
  // Transform data for chart
  const prepareReplicaData = () => {
    return deployments.map(deployment => ({
      name: deployment.name.length > 15 ? deployment.name.substring(0, 15) + '...' : deployment.name,
      fullName: deployment.name,
      namespace: deployment.namespace,
      desired: deployment.desired_replicas,
      available: deployment.available_replicas,
      ready: deployment.ready_replicas,
      age: deployment.age
    }));
  };

  // Custom tooltip
  const renderTooltip = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      const deployment = payload[0].payload;

      return (
        <Paper sx={{ p: 1.5, minWidth: 200 }}>
          <Typography variant="subtitle2">{deployment.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {deployment.namespace}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {payload.map((p, index) => (
              <Typography key={index} variant="body2" sx={{ color: p.color }}>
                <strong>{p.name}:</strong> {p.value}
              </Typography>
            ))}
            <Typography variant="body2">
              <strong>Age:</strong> {deployment.age}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return null;
  };

  // Colors for charts
  const COLORS = {
    desired: '#2196F3',
    available: '#4CAF50',
    ready: '#FFC107'
  };

  const replicaData = prepareReplicaData();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Deployment Visualizations</Typography>

      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Deployment Replicas
        </Typography>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={replicaData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip content={renderTooltip} />
            <Legend />
            <Bar
              dataKey="desired"
              name="Desired Replicas"
              fill={COLORS.desired}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="available"
              name="Available Replicas"
              fill={COLORS.available}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="ready"
              name="Ready Replicas"
              fill={COLORS.ready}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Health Status Analysis */}
      {deployments.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Deployment Health Status
          </Typography>
          <DeploymentHealthStatus deployments={deployments} />
        </Box>
      )}
    </Box>
  );
}

/**
 * Component to show deployment health status summary
 */
function DeploymentHealthStatus({ deployments }) {
  // Count healthy vs unhealthy deployments
  const healthStatus = deployments.reduce((acc, deployment) => {
    // A deployment is considered healthy if available equals desired
    const isHealthy = deployment.available_replicas === deployment.desired_replicas;

    if (isHealthy) {
      acc.healthy += 1;
    } else {
      acc.unhealthy += 1;
    }

    return acc;
  }, { healthy: 0, unhealthy: 0 });

  // Find problematic deployments
  const problematicDeployments = deployments.filter(
    d => d.available_replicas !== d.desired_replicas
  );

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="body1">
        {healthStatus.healthy} of {deployments.length} deployments are healthy (
        {((healthStatus.healthy / deployments.length) * 100).toFixed(0)}%)
      </Typography>

      {healthStatus.unhealthy > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="error.main">
            Problematic deployments:
          </Typography>
          <Box component="ul" sx={{ mt: 0.5, pl: 2 }}>
            {problematicDeployments.map((d, i) => (
              <Typography component="li" variant="body2" key={i}>
                <strong>{d.name}</strong> ({d.namespace}): {d.available_replicas} of {d.desired_replicas} replicas available
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DeploymentCharts;