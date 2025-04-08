import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Chip,
  styled
} from '@mui/material';

// Styled components for status indicators
const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;

  switch (status) {
    case 'Running':
      color = theme.palette.success.main;
      backgroundColor = theme.palette.success.light;
      break;
    case 'Pending':
      color = theme.palette.warning.main;
      backgroundColor = theme.palette.warning.light;
      break;
    case 'Failed':
      color = theme.palette.error.main;
      backgroundColor = theme.palette.error.light;
      break;
    case 'Succeeded':
      color = theme.palette.info.main;
      backgroundColor = theme.palette.info.light;
      break;
    case 'Ready':
      color = theme.palette.success.main;
      backgroundColor = theme.palette.success.light;
      break;
    case 'NotReady':
      color = theme.palette.error.main;
      backgroundColor = theme.palette.error.light;
      break;
    default:
      color = theme.palette.grey[600];
      backgroundColor = theme.palette.grey[200];
  }

  return {
    backgroundColor,
    color,
    '& .MuiChip-label': {
      fontWeight: 600,
    },
    height: 24,
    fontSize: '0.75rem',
  };
});

/**
 * Table component to display Kubernetes resources
 */
function ResourceTable({ data, columns, isLoading }) {
  // Render cell content with special handling for status fields
  const renderCellContent = (item, column) => {
    const value = item[column.id];

    // Status fields need special rendering
    if (column.id === 'status') {
      return (
        <StatusChip
          label={value}
          status={value}
          size="small"
        />
      );
    }

    return value;
  };

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary" display="inline">
                  Loading resources...
                </Typography>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No resources found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.name || index}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                }}
              >
                {columns.map((column) => (
                  <TableCell key={`${item.name}-${column.id}`}>
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResourceTable;