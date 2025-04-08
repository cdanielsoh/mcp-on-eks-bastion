import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * Charts for service resource visualization
 */
function ServiceCharts({ services }) {
  // Colors for service types
  const SERVICE_TYPE_COLORS = {
    ClusterIP: '#2196F3',      // Blue
    NodePort: '#4CAF50',       // Green
    LoadBalancer: '#9C27B0',   // Purple
    ExternalName: '#FF9800',   // Orange
    default: '#9E9E9E'         // Gray
  };

  // Transform data for charts
  const prepareServiceTypeData = () => {
    const typeCount = {};

    services.forEach(service => {
      typeCount[service.type] = (typeCount[service.type] || 0) + 1;
    });

    return Object.keys(typeCount).map(type => ({
      name: type,
      value: typeCount[type]
    }));
  };

  const prepareNamespaceData = () => {
    const namespaceCount = {};

    services.forEach(service => {
      namespaceCount[service.namespace] = (namespaceCount[service.namespace] || 0) + 1;
    });

    return Object.keys(namespaceCount).map(namespace => ({
      name: namespace,
      value: namespaceCount[namespace]
    }));
  };

  // Create namespace colors
  const getNamespaceColor = (index) => {
    const colors = [
      '#3F51B5', '#009688', '#FF5722', '#607D8B', '#E91E63',
      '#CDDC39', '#00BCD4', '#FFC107', '#795548', '#9C27B0'
    ];
    return colors[index % colors.length];
  };

  // Custom tooltip
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="body2">
            <strong>{payload[0].name}</strong>: {payload[0].value} services ({((payload[0].value / services.length) * 100).toFixed(1)}%)
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom legend
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
              {entry.value} ({entry.payload.value} services)
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const typeData = prepareServiceTypeData();
  const namespaceData = prepareNamespaceData();

  // Find exposed services (LoadBalancer or NodePort)
  const exposedServices = services.filter(
    svc => svc.type === 'LoadBalancer' || svc.type === 'NodePort'
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Service Visualizations</Typography>

      <Grid container spacing={2}>
        {/* Service Type Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Service Types
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={typeData}
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
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SERVICE_TYPE_COLORS[entry.name] || SERVICE_TYPE_COLORS.default}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Service Namespace Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Services by Namespace
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
                      fill={getNamespaceColor(index)}
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

      {/* Exposed Services */}
      {exposedServices.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Externally Exposed Services
          </Typography>
          <Grid container spacing={2}>
            {exposedServices.map((service, index) => (
              <Grid item xs={12} md={6} key={service.name || index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.name}
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.7em',
                          bgcolor: SERVICE_TYPE_COLORS[service.type] || SERVICE_TYPE_COLORS.default,
                          color: 'white'
                        }}
                      >
                        {service.type}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {service.namespace}
                    </Typography>
                    <Typography variant="body2">
                      <strong>External IP:</strong> {service.external_ip}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ports:</strong> {service.ports}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Age:</strong> {service.age}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default ServiceCharts;