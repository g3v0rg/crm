import React, { useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useRecordContext, useUpdate, useNotify, useRefresh } from 'react-admin';

const StatusField = (props) => {
  const { source } = props;
  const record = useRecordContext(props);
  const [anchorEl, setAnchorEl] = useState(null);
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  
  if (!record || !record[source]) return null;
  
  const status = record[source];
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#455a64';
      case 'In Progress': return '#d84315';
      case 'Cancelled': return '#b71c1c';
      case 'Complete': return '#2e7d32';
      default: return '#455a64';
    }
  };
  
  const statusColor = getStatusColor(status);
  
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleStatusChange = (newStatus) => {
    update(
      'projects',
      { id: record.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          notify('Status updated', { type: 'success' });
          refresh();
        },
        onError: error => notify(`Error: ${error.message}`, { type: 'warning' }),
      }
    );
    handleClose();
  };
  
  const open = Boolean(anchorEl);
  
  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          backgroundColor: statusColor,
          color: '#FFFFFF',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.875rem',
          minWidth: '90px',
          textAlign: 'center'
        }}
      >
        {status}
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            minWidth: 120
          }
        }}
      >
        {['New', 'In Progress', 'Cancelled', 'Complete'].map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleStatusChange(option)}
            selected={option === status}
            sx={{
              fontSize: '0.875rem',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0,0,0,0.08)'  
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

StatusField.propTypes = {
  source: PropTypes.string.isRequired
};

export default StatusField;