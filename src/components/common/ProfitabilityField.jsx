import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useRecordContext } from 'react-admin';

const ProfitabilityField = (props) => {
  const { source } = props;
  const record = useRecordContext(props);
  
  if (!record || record[source] === undefined) return null;
  
  // Parse the profitability value
  let profitability = record[source];
  if (typeof profitability === 'string') {
    profitability = parseInt(profitability.replace('%', ''), 10) || 0;
  }
  
  // Get color based on profitability (red for negative, green for positive)
  const getColor = (value) => {
    if (value < 0) return '#b71c1c'; // Red for negative
    return '#2e7d32'; // Green for positive
  };
  
  const profitColor = getColor(profitability);
  
  return (
    <Box
      sx={{
        backgroundColor: profitColor,
        color: '#FFFFFF',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        minWidth: '60px',
        textAlign: 'center'
      }}
    >
      {profitability}%
    </Box>
  );
};

ProfitabilityField.propTypes = {
  source: PropTypes.string.isRequired
};

export default ProfitabilityField;