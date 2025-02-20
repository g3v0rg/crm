import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  Divider,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { validateProviders } from '../../utils/calculations';

/**
 * ProviderModal component for managing service providers and their percentages
 */
const ProviderModal = ({ open, onClose, providers = [], onSave }) => {
  const [providersList, setProvidersList] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [error, setError] = useState('');

  // Initialize providers list when modal opens
  useEffect(() => {
    if (open) {
      const initialProviders = providers.length > 0 
        ? [...providers] 
        : [{ name: '', percentage: '' }];
      
      setProvidersList(initialProviders);
      updateTotalPercentage(initialProviders);
    }
  }, [open, providers]);

  // Calculate total percentage
  const updateTotalPercentage = (list) => {
    const total = list.reduce((sum, provider) => {
      return sum + (parseInt(provider.percentage) || 0);
    }, 0);
    
    setTotalPercentage(total);
    
    // Validate percentage
    if (list.some(p => p.name || p.percentage)) {
      if (total !== 100) {
        setError('Total percentage must equal 100%');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  // Add new provider row
  const addProvider = () => {
    const newList = [...providersList, { name: '', percentage: '' }];
    setProvidersList(newList);
  };

  // Remove provider at specified index
  const removeProvider = (index) => {
    const newList = providersList.filter((_, i) => i !== index);
    
    // If removing the last provider, add an empty one
    if (newList.length === 0) {
      newList.push({ name: '', percentage: '' });
    }
    
    setProvidersList(newList);
    updateTotalPercentage(newList);
  };

  // Handle provider name change
  const handleNameChange = (index, value) => {
    const newList = [...providersList];
    newList[index].name = value;
    setProvidersList(newList);
  };

  // Handle provider percentage change
  const handlePercentageChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newList = [...providersList];
    newList[index].percentage = value;
    setProvidersList(newList);
    updateTotalPercentage(newList);
  };

  // Handle save button click
  const handleSave = () => {
    // Filter out empty providers
    const filteredProviders = providersList.filter(
      provider => provider.name.trim() && parseInt(provider.percentage) > 0
    );
    
    // Validate if any providers exist
    if (filteredProviders.length > 0) {
      if (!validateProviders(filteredProviders)) {
        setError('Total percentage must equal 100%');
        return;
      }
    }
    
    onSave(filteredProviders);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Manage Providers</Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        <List sx={{ width: '100%' }}>
          {providersList.map((provider, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <ListItem
                sx={{
                  display: 'flex',
                  gap: 2,
                  py: 1,
                }}
                disableGutters
              >
                <TextField
                  label="Provider Name"
                  value={provider.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                
                <TextField
                  label="Percentage"
                  value={provider.percentage}
                  onChange={(e) => handlePercentageChange(index, e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: '%',
                  }}
                  sx={{ width: '120px' }}
                />
                
                <IconButton 
                  onClick={() => removeProvider(index)}
                  color="error"
                  size="small"
                  aria-label="remove provider"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            startIcon={<AddIcon />}
            onClick={addProvider}
            color="primary"
            variant="outlined"
          >
            Add Provider
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Typography 
          variant="body2" 
          color={totalPercentage === 100 ? 'success.main' : 'error.main'}
          sx={{ mr: 'auto', fontWeight: 'bold' }}
        >
          Total: {totalPercentage}%
        </Typography>
        
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        
        <Button 
          onClick={handleSave} 
          color="primary"
          variant="contained"
          disabled={providersList.some(p => p.name || p.percentage) && totalPercentage !== 100}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProviderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  onSave: PropTypes.func.isRequired
};

export default ProviderModal;