import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  TopToolbar,
  EditButton,
  Button,
  useRecordContext,
  useRedirect
} from 'react-admin';
import { Box, Card, Typography, Grid, Divider } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import StatusField from '../common/StatusField';
import ProfitabilityField from '../common/ProfitabilityField';
import HeaderMetrics from '../common/HeaderMetrics';

// Custom actions toolbar for the show view
const ShowActions = () => {
  const record = useRecordContext();
  const redirect = useRedirect();
  
  if (!record) return null;
  
  const handleEditEstimate = () => {
    redirect(`/estimates/${record.id}`);
  };
  
  return (
    <TopToolbar>
      <Button
        onClick={handleEditEstimate}
        label="Edit Estimate"
        startIcon={<AssessmentIcon />}
      />
      <Button
        label="Export PDF"
        startIcon={<PictureAsPdfIcon />}
        disabled={!record.estimate_json}
      />
      <EditButton />
    </TopToolbar>
  );
};

// Project title component
const ProjectTitle = () => {
  const record = useRecordContext();
  return record ? <span>Project: {record.project_name}</span> : null;
};

// Aside component for project metrics
const ProjectAside = () => {
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
    <Box sx={{ width: { xs: '100%', sm: '100%', md: '40%' }, mb: { xs: 2, md: 0 }, ml: { md: 2 } }}>
      <Card>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Project Metrics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <HeaderMetrics metrics={metrics} />
        </Box>
      </Card>
    </Box>
  );
};

/**
 * ProjectShow component displays detailed project information
 */
const ProjectShow = () => {
  return (
    <Show
      title={<ProjectTitle />}
      actions={<ShowActions />}
      aside={<ProjectAside />}
    >
      <SimpleShowLayout>
        <Typography variant="h6" gutterBottom>Project Information</Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField source="project_name" label="Project Name" />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField source="client_name" label="Client Name" />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField source="producer" label="Producer" />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DateField source="creation_date" label="Creation Date" showTime />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StatusField source="status" label="Status" readOnly />
          </Grid>
        </Grid>
        
        {/* Financial details section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Financial Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <NumberField
              source="total_project_cost"
              label="Total Project Cost"
              options={{ style: 'currency', currency: 'USD' }}
              textAlign="right"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <NumberField
              source="total_expenses"
              label="Total Expenses"
              options={{ style: 'currency', currency: 'USD' }}
              textAlign="right"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <NumberField
              source="total_bonuses"
              label="Total Bonuses"
              options={{ style: 'currency', currency: 'USD' }}
              textAlign="right"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <NumberField
              source="net_profit"
              label="Net Profit"
              options={{ style: 'currency', currency: 'USD' }}
              textAlign="right"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ProfitabilityField
              source="profitability"
              label="Profitability %"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <NumberField
              source="final_profit"
              label="Final Profit"
              options={{ style: 'currency', currency: 'USD' }}
              textAlign="right"
            />
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};

export default ProjectShow;