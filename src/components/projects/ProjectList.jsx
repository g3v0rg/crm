import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  useRecordContext,
  Button,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';
import { Box, Tooltip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import StatusField from '../common/StatusField';
import ProfitabilityField from '../common/ProfitabilityField';
import { formatDate } from '../../utils/formatters';

// Custom date field to format dates as "14 Feb 2025, 09:42"
const CustomDateField = ({ source }) => {
  const record = useRecordContext();
  if (!record || !record[source]) return null;
  return <span>{formatDate(record[source])}</span>;
};

// Custom number field without currency symbol
const CustomNumberField = ({ source }) => {
  const record = useRecordContext();
  if (!record) return null;
  
  const value = record[source];
  if (value === undefined || value === null) return null;
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  
  return <span>{formattedValue}</span>;
};

// Custom final profit field with bold styling
const FinalProfitField = ({ source }) => {
  const record = useRecordContext();
  if (!record) return null;
  
  const value = record[source];
  if (value === undefined || value === null) return null;
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  
  return <span style={{ fontWeight: 'bold' }}>{formattedValue}</span>;
};

// Custom action buttons for each row - ICON ONLY version
const ProjectActions = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  
  if (!record) return null;
  
  return (
    <Box 
      display="flex" 
      justifyContent="center"
      gap={1} 
      onClick={e => e.stopPropagation()}
      sx={{ minWidth: '110px' }}
    >
      <Tooltip title="Edit Estimate">
        <IconButton
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/estimates/${record.id}`);
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Edit Info">
        <IconButton 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${record.id}`);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this project?')) {
              // Delete action would go here
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Custom toolbar with create and export buttons positioned to the left
const ListActions = () => (
  <TopToolbar sx={{ 
    justifyContent: 'flex-start', 
    marginLeft: 0,
    gap: 1
  }}>
    <CreateButton label="Create New Project" />
    <ExportButton label="Export" />
  </TopToolbar>
);

const ProjectList = (props) => {
  return (
    <List
      {...props}
      actions={<ListActions />}
      sort={{ field: 'creation_date', order: 'DESC' }}
      sx={{
        '& .RaList-actions': {
          justifyContent: 'flex-start !important',
          marginBottom: '16px',
        },
        fontSize: '0.875rem',
      }}
      exporter={false}
    >
      <Datagrid
        bulkActionButtons={false}
        rowClick={(id, resource, record) => `/estimates/${record.id}`}
        sx={{
          '& .RaDatagrid-table': {
            tableLayout: 'fixed',
          },
          '& .RaDatagrid-headerCell': {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            padding: '8px 12px',
            '&:first-of-type': {
              width: '35px',
              maxWidth: '35px',
              paddingLeft: '8px',
              paddingRight: '8px',
            },
            '& .MuiTableSortLabel-root': {
              color: '#FFFFFF',
              '&.Mui-active': {
                color: '#FFFFFF',
                '& .MuiTableSortLabel-icon': {
                  color: '#FFFFFF !important'
                }
              }
            },
            '& .MuiCheckbox-root': {
              color: '#FFFFFF',
              '&.Mui-checked': {
                color: '#FFFFFF',
              }
            }
          },
          '& .MuiTableCell-root': {
            padding: '8px 12px',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:first-of-type': {
              width: '35px',
              maxWidth: '35px',
              paddingLeft: '8px',
              paddingRight: '8px',
            }
          },
          '& .MuiTableRow-root.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            '& .MuiCheckbox-root': {
              color: '#000000',
            }
          },
          '& .MuiCheckbox-root': {
            padding: '0 4px',
          }
        }}
      >
        <TextField source="id" label="#" />
        <CustomDateField source="creation_date" label="Creation Date" />
        <TextField source="project_name" label="Project Name" />
        <TextField source="client_name" label="Client Name" />
        <TextField source="producer" label="Producer" />
        <StatusField source="status" label="Status" />
        <CustomNumberField source="total_project_cost" label="Total Project Cost" />
        <CustomNumberField source="total_expenses" label="Total Expenses" />
        <CustomNumberField source="total_bonuses" label="Total Bonuses" />
        <CustomNumberField source="net_profit" label="Net Profit" />
        <ProfitabilityField source="profitability" label="Profitability %" />
        <FinalProfitField source="final_profit" label="Final Profit" />
        <ProjectActions />
      </Datagrid>
    </List>
  );
};

export default ProjectList;