import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Typography,
  TextField,
  Tooltip,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import PropTypes from 'prop-types';
import { useEstimate } from '../../contexts/EstimateContext';
import { sections } from '../../config/sections';
import ProviderModal from '../providers/ProviderModal';
import { 
  calculateEstimatedTotal, 
  calculateActualTotal, 
  calculateProfitability 
} from '../../utils/calculations';
import { 
  formatNumber, 
  parseNumber, 
  getProfitabilityColor 
} from '../../utils/formatters';

/**
 * TableManager component manages a section's data table
 */
const TableManager = ({ sectionId, rows }) => {
  const { 
    addRow, 
    removeRow, 
    updateRow, 
    updateProviders 
  } = useEstimate();
  
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [sectionTotal, setSectionTotal] = useState(0);
  
  // Get headers for the section
  const headers = sections.data[sectionId]?.headers || sections.commonHeaders;
  
  // Calculate section total
  useEffect(() => {
    if (!rows) return;
    
    const total = rows.reduce((sum, row) => {
      return sum + parseNumber(row.totalAct);
    }, 0);
    
    setSectionTotal(total);
  }, [rows]);
  
  // Handle cell value change
  const handleCellChange = (rowIndex, field, value) => {
    const updatedData = { [field]: value };
    
    // If related to calculation fields, recalculate totals
    if (['qty', 'priceEst', 'discount', 'factor', 'cr', 'priceAct'].includes(field)) {
      const updatedRow = { ...rows[rowIndex], ...updatedData };
      
      // Calculate totals
      const totalEst = calculateEstimatedTotal(updatedRow);
      const totalAct = calculateActualTotal(updatedRow);
      const profitability = calculateProfitability(totalEst, totalAct);
      
      Object.assign(updatedData, {
        totalEst,
        totalAct,
        profitability
      });
    }
    
    updateRow(sectionId, rowIndex, updatedData);
  };
  
  // Format number display for UI
  const displayNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return formatNumber(parseNumber(value));
  };
  
  // Handle provider modal open
  const handleOpenProviderModal = (rowIndex) => {
    setActiveRow(rowIndex);
    setProviderModalOpen(true);
  };
  
  // Handle provider save
  const handleSaveProviders = (providers) => {
    if (activeRow !== null) {
      updateProviders(sectionId, activeRow, providers);
    }
    setProviderModalOpen(false);
    setActiveRow(null);
  };
  
  // Handle adding a new row
  const handleAddRow = () => {
    addRow(sectionId);
  };
  
  // Handle deleting a row
  const handleDeleteRow = (rowIndex) => {
    removeRow(sectionId, rowIndex);
  };
  
  // Render provider summary
  const renderProviderSummary = (providers) => {
    if (!providers || providers.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary">
          No providers
        </Typography>
      );
    }
    
    return (
      <Typography variant="body2" noWrap>
        {providers.map(p => `${p.name} (${p.percentage}%)`).join(', ')}
      </Typography>
    );
  };
  
  return (
    <>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" align="center">
                <Tooltip title="Add Row">
                  <IconButton 
                    size="small" 
                    onClick={handleAddRow}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              
              {headers.map((header, index) => (
                <TableCell 
                  key={index}
                  align={
                    ['Qty', 'Price (est)', 'Total (est)', 'Discount', 
                     'Factor', 'CR', 'Price (act)', 'Total (act)', 
                     'Profitability %'].includes(header) 
                    ? 'right' : 'left'
                  }
                  sx={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    bgcolor: '#d9d9d9'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                <TableCell padding="checkbox">
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteRow(rowIndex)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                
                {/* Service */}
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={row.service || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'service', e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                </TableCell>
                
                {/* Description */}
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={row.description || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'description', e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                </TableCell>
                
                {/* Duration */}
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={row.duration || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'duration', e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                </TableCell>
                
                {/* Unit */}
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={row.unit || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'unit', e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                </TableCell>
                
                {/* Qty */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.qty || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'qty', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'qty', displayNumber(e.target.value))}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* Price (est) */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.priceEst || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'priceEst', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'priceEst', displayNumber(e.target.value))}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* Total (est) */}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {displayNumber(row.totalEst)}
                </TableCell>
                
                {/* Discount */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.discount || '1'}
                    onChange={(e) => handleCellChange(rowIndex, 'discount', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'discount', displayNumber(e.target.value) || '1')}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* Factor */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.factor || '1'}
                    onChange={(e) => handleCellChange(rowIndex, 'factor', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'factor', displayNumber(e.target.value) || '1')}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* CR */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.cr || '1'}
                    onChange={(e) => handleCellChange(rowIndex, 'cr', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'cr', displayNumber(e.target.value) || '1')}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* Providers */}
                <TableCell>
                  <Button
                    startIcon={<PeopleIcon />}
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenProviderModal(rowIndex)}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none', width: '100%' }}
                  >
                    {renderProviderSummary(row.providers)}
                  </Button>
                </TableCell>
                
                {/* Price (act) */}
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    value={row.priceAct || ''}
                    onChange={(e) => handleCellChange(rowIndex, 'priceAct', e.target.value)}
                    onBlur={(e) => handleCellChange(rowIndex, 'priceAct', displayNumber(e.target.value))}
                    InputProps={{ 
                      disableUnderline: true,
                      style: { textAlign: 'right' }
                    }}
                  />
                </TableCell>
                
                {/* Total (act) */}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {displayNumber(row.totalAct)}
                </TableCell>
                
                {/* Profitability % */}
                <TableCell align="right">
                    <Box
                        sx={{
                        backgroundColor: getProfitabilityColor(row.profitability),
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
                        {row.profitability}%
                    </Box>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Section Total */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          p: 1,
          bgcolor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body1" fontWeight="bold">
          Section Total: {formatNumber(sectionTotal)}
        </Typography>
      </Box>
      
      {/* Provider Modal */}
      {activeRow !== null && (
        <ProviderModal
          open={providerModalOpen}
          onClose={() => setProviderModalOpen(false)}
          providers={rows[activeRow]?.providers || []}
          onSave={handleSaveProviders}
        />
      )}
    </>
  );
};

TableManager.propTypes = {
  sectionId: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired
};

export default TableManager;