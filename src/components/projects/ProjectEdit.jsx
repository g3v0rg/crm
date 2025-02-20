import React, { useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  SaveButton,
  Toolbar,
  useRedirect,
  useNotify,
  useRecordContext,
  TopToolbar,
  DeleteButton,
  ShowButton,
  Button
} from 'react-admin';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';
import HeaderMetrics from '../common/HeaderMetrics';

// Custom actions toolbar for the edit view
const EditActions = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  
  if (!record) return null;
  
  return (
    <TopToolbar>
      <Button
        onClick={() => navigate(`/estimates/${record.id}`)}
        label="Edit Estimate"
        startIcon={<AssessmentIcon />}
      />
      <ShowButton />
      <DeleteButton />
    </TopToolbar>
  );
};

// Custom toolbar for the edit form
const EditToolbar = () => {
  const redirect = useRedirect();
  const notify = useNotify();

  const handleSaveSuccess = () => {
    notify('Project updated successfully', { type: 'success' });
    redirect('list', 'projects');
  };

  return (
    <Toolbar>
      <SaveButton onSuccess={handleSaveSuccess} />
    </Toolbar>
  );
};

/**
 * ProjectEdit component for editing basic project information
 */
const ProjectEdit = (props) => {
  const ProjectTitle = () => {
    const record = useRecordContext();
    return record ? <span>Edit Project: {record.project_name}</span> : null;
  };

  return (
    <Edit 
      {...props} 
      title={<ProjectTitle />}
      actions={<EditActions />}
    >
      <SimpleForm toolbar={<EditToolbar />}>
        <ProjectMetrics />
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Project Information</Typography>
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextInput
            source="project_name"
            label="Project Name"
            validate={[required()]}
            fullWidth
            sx={{ flexBasis: { xs: '100%', sm: '100%', md: '30%' } }}
          />
          
          <TextInput
            source="client_name"
            label="Client Name"
            validate={[required()]}
            fullWidth
            sx={{ flexBasis: { xs: '100%', sm: '100%', md: '30%' } }}
          />
          
          <TextInput
            source="producer"
            label="Producer"
            validate={[required()]}
            fullWidth
            sx={{ flexBasis: { xs: '100%', sm: '100%', md: '30%' } }}
          />
        </Box>
        
        <Box mt={2}>
          <SelectInput
            source="status"
            label="Project Status"
            validate={[required()]}
            choices={[
              { id: 'New', name: 'New' },
              { id: 'In Progress', name: 'In Progress' },
              { id: 'Cancelled', name: 'Cancelled' },
              { id: 'Complete', name: 'Complete' },
            ]}
            sx={{ width: { xs: '100%', sm: '50%', md: '30%' } }}
          />
        </Box>
      </SimpleForm>
    </Edit>
  );
};

// Component to display project metrics
const ProjectMetrics = () => {
  const record = useRecordContext();
  
  if (!record) return null;
  
  const metrics = {
    totalProjectCost: record.total_project_cost || 0,
    totalExpenses: record.total_expenses || 0,
    netProfit: record.net_profit || 0,
    profitability: record.profitability || 0,
    finalProfit: record.final_profit || 0
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <HeaderMetrics metrics={metrics} />
    </Box>
  );
};

export default ProjectEdit;