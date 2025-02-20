import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';


// Import our custom data provider
import dataProvider from './services/dataProvider';

// Import custom layout & theme
import AppLayout from './layouts/AppLayout';
import theme from './themes/theme';

// Import components
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import ProjectCreate from './components/projects/ProjectCreate';
import ProjectEdit from './components/projects/ProjectEdit';
import ProjectShow from './components/projects/ProjectShow';
import EstimateEditor from './components/estimates/EstimateEditor';

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Admin
          dataProvider={dataProvider}
          layout={AppLayout}
          dashboard={Dashboard}
          title="Production Cost Management"
          theme={theme} // Explicitly pass theme to Admin component
          disableTelemetry
        >
          <Resource
            name="projects"
            list={ProjectList}
            create={ProjectCreate}
            edit={ProjectEdit}
            show={ProjectShow}
            icon={BusinessCenterIcon}
            options={{ label: 'Projects' }}
          />
          
          {/* Custom routes */}
          <CustomRoutes>
            {/* Estimate editor route */}
            <Route
              path="/estimates/:id"
              element={<EstimateEditor />}
            />
          </CustomRoutes>
        </Admin>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;