import React from 'react';
import { 
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEstimate } from '../../contexts/EstimateContext';
import { sections } from '../../config/sections';
import TableManager from './TableManager';

/**
 * SectionManager component renders and manages all estimate sections
 */
const SectionManager = () => {
  const { 
    sectionData,
    removeSection
  } = useEstimate();

  // Get section order based on configuration
  const getSectionOrder = () => {
    // Filter section IDs that exist in current sectionData
    return sections.order.filter(id => sectionData[id]);
  };

  const orderedSections = getSectionOrder();

  const handleDeleteSection = (sectionId) => {
    if (window.confirm(`Are you sure you want to delete this section?`)) {
      removeSection(sectionId);
    }
  };

  if (orderedSections.length === 0) {
    return null;
  }

  return (
    <Box>
      {orderedSections.map((sectionId) => {
        const section = sectionData[sectionId];
        if (!section) return null;

        return (
          <Paper 
            key={sectionId} 
            elevation={3} 
            sx={{ 
              mb: 4, 
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'black',
                color: 'white',
                p: 1,
                pl: 2
              }}
            >
              <Typography variant="h6" component="h2">
                {section.title}
              </Typography>

              <Tooltip title="Delete Section">
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteSection(sectionId)}
                  sx={{ color: 'white' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <TableManager 
              sectionId={sectionId}
              rows={section.rows}
            />
          </Paper>
        );
      })}
    </Box>
  );
};

export default SectionManager;