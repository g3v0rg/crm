import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  SaveButton,
  Toolbar,
  useRedirect,
  useNotify
} from 'react-admin';
import { Typography, Box } from '@mui/material';

// Custom toolbar that redirects to list after successful creation
const CreateToolbar = () => {
  const redirect = useRedirect();
  const notify = useNotify();

  const handleSaveSuccess = () => {
    notify('Project created successfully', { type: 'success' });
    redirect('list', 'projects');
  };

  return (
    <Toolbar>
      <SaveButton onSuccess={handleSaveSuccess} />
    </Toolbar>
  );
};

/**
 * ProjectCreate component renders the create project form
 */
const ProjectCreate = (props) => {
  return (
    <Create {...props} title="Create New Project">
      <SimpleForm toolbar={<CreateToolbar />}>
        <Typography variant="h6" sx={{ mb: 2 }}>Project Information</Typography>
        
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
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Note: The project will be created with "New" status by default.
          You can edit the estimate after creation.
        </Typography>
      </SimpleForm>
    </Create>
  );
};

export default ProjectCreate;