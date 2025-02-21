import React, { useState, useEffect } from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// Import components
import Login from './components/auth/Login';
import AppLayout from './layouts/AppLayout';
import theme from './themes/theme';
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import ProjectCreate from './components/projects/ProjectCreate';
import ProjectEdit from './components/projects/ProjectEdit';
import ProjectShow from './components/projects/ProjectShow';
import EstimateEditor from './components/estimates/EstimateEditor';
import dataProvider from './services/dataProvider';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Admin
          dataProvider={dataProvider}
          layout={AppLayout}
          dashboard={Dashboard}
          title="Production Cost Management"
          theme={theme}
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
          
          <CustomRoutes>
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