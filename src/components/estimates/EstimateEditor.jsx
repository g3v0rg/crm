import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Paper,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  TopToolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EstimateProvider, useEstimate } from '../../contexts/EstimateContext';
import SectionManager from './SectionManager';
import HeaderMetrics from '../common/HeaderMetrics';

// Constants from layout
const APP_BAR_HEIGHT = 64;

// Wrapper component that provides the EstimateContext
const EstimateEditorWrapper = () => {
  const { id } = useParams();
  
  return (
    <EstimateProvider projectId={id}>
      <EstimateEditorContent />
    </EstimateProvider>
  );
};

// Actions toolbar - styled like in Projects view
const ActionToolbar = ({ onBack, onExport, onSave, onAddSection, selectedSection, sections, onSectionChange }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      mb: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Back to Projects">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            size="small"
          >
            Back
          </Button>
        </Tooltip>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddSection}
          disabled={!selectedSection}
          size="small"
        >
          Add Section
        </Button>
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedSection}
            onChange={(e) => onSectionChange(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="" disabled>
              {sections.length === 0 ? 'All sections added' : 'Select section type'}
            </MenuItem>
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={onExport}
          size="small"
        >
          Export PDF
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={onSave}
          size="small"
        >
          Save Estimate
        </Button>
      </Box>
    </Box>
  );
};

// Main content component
const EstimateEditorContent = () => {
  const navigate = useNavigate();
  const { 
    project, 
    loading, 
    error, 
    sectionData, 
    metrics,
    addSection,
    getAvailableSections,
    saveEstimate,
    exportToPDF
  } = useEstimate();

  const [selectedSection, setSelectedSection] = React.useState('');
  const availableSections = getAvailableSections();

  const handleAddSection = () => {
    if (selectedSection) {
      addSection(selectedSection);
      setSelectedSection('');
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const handleSave = async () => {
    const success = await saveEstimate();
    if (success) {
      // Stay on the page after successful save
    }
  };

  const handleExport = () => {
    exportToPDF();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2.5,
      paddingTop: 0,
      position: 'relative',
      fontSize: '0.875rem',
    }}>
      {/* Project header */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontSize: '1rem',
          fontWeight: 500,
          mb: 2,
          mt: 0
        }}
      >
        {project.project_name} | {project.client_name} | Producer: {project.producer}
      </Typography>

      {/* Project metrics */}
      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <HeaderMetrics metrics={metrics} />
      </Paper>

      {/* Action toolbar */}
      <ActionToolbar 
        onBack={handleBack}
        onExport={handleExport}
        onSave={handleSave}
        onAddSection={handleAddSection}
        selectedSection={selectedSection}
        sections={availableSections}
        onSectionChange={setSelectedSection}
      />

      {/* Sections container */}
      <Box>
        {Object.keys(sectionData).length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No sections yet. Use the dropdown above to add a section.
            </Typography>
          </Paper>
        ) : (
          <SectionManager />
        )}
      </Box>
    </Box>
  );
};

export default EstimateEditorWrapper;