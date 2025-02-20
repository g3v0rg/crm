// At the top of src/components/dashboard/Dashboard.jsx
import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import { useDataProvider, useTranslate, Title } from 'react-admin';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatNumber } from '../../utils/formatters';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MoneyIcon from '@mui/icons-material/Money';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard component displaying project statistics and charts
 */
const Dashboard = () => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    projects: [],
    summary: {
      totalProjects: 0,
      totalRevenue: 0,
      totalProfit: 0,
      averageProfitability: 0,
      statusBreakdown: [],
      profitabilityRanges: []
    }
  });
  
  // Status color mapping for charts
  const statusColors = {
    'New': '#455a64',
    'In Progress': '#d84315',
    'Cancelled': '#b71c1c',
    'Complete': '#2e7d32'
  };
  
  // Profitability color mapping for charts
  const profitabilityColors = [
    { range: 'Negative (<0%)', color: '#b71c1c' },
    { range: 'Low (0-25%)', color: '#e53935' },
    { range: 'Medium-Low (25-50%)', color: '#fb8c00' },
    { range: 'Medium (50-75%)', color: '#fdd835' },
    { range: 'Medium-High (75-100%)', color: '#7cb342' },
    { range: 'High (>100%)', color: '#388e3c' }
  ];
  
  // Fetch data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: projects } = await dataProvider.getList('projects', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'creation_date', order: 'DESC' },
          filter: {}
        });
        
        // Calculate summary statistics
        const totalProjects = projects.length;
        const totalRevenue = projects.reduce((sum, p) => sum + (p.total_project_cost || 0), 0);
        const totalProfit = projects.reduce((sum, p) => sum + (p.final_profit || 0), 0);
        const totalProfitability = projects.reduce((sum, p) => {
          // Only include projects with revenue
          if (p.total_project_cost > 0) {
            return sum + (p.profitability || 0);
          }
          return sum;
        }, 0);
        const avgProfitability = totalProjects > 0 ? 
          Math.round(totalProfitability / projects.filter(p => p.total_project_cost > 0).length) : 0;
        
        // Calculate status breakdown
        const statusCount = {};
        projects.forEach(p => {
          const status = p.status || 'New';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        const statusBreakdown = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          value: Math.round((count / totalProjects) * 100)
        }));
        
        // Calculate profitability ranges
        const profitabilityCount = {
          'Negative (<0%)': 0,
          'Low (0-25%)': 0,
          'Medium-Low (25-50%)': 0,
          'Medium (50-75%)': 0,
          'Medium-High (75-100%)': 0,
          'High (>100%)': 0
        };
        
        projects.forEach(p => {
          const profitability = p.profitability || 0;
          if (profitability < 0) {
            profitabilityCount['Negative (<0%)']++;
          } else if (profitability < 25) {
            profitabilityCount['Low (0-25%)']++;
          } else if (profitability < 50) {
            profitabilityCount['Medium-Low (25-50%)']++;
          } else if (profitability < 75) {
            profitabilityCount['Medium (50-75%)']++;
          } else if (profitability < 100) {
            profitabilityCount['Medium-High (75-100%)']++;
          } else {
            profitabilityCount['High (>100%)']++;
          }
        });
        
        const profitabilityRanges = Object.entries(profitabilityCount).map(([range, count]) => ({
          range,
          count,
          value: Math.round((count / totalProjects) * 100)
        }));
        
        setData({
          projects,
          summary: {
            totalProjects,
            totalRevenue,
            totalProfit,
            averageProfitability: avgProfitability,
            statusBreakdown,
            profitabilityRanges
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dataProvider]);
  
  const handleCreateProject = () => {
    navigate('/projects/create');
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
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  const { summary } = data;
  
  return (
    <>
      <Title title={translate('dashboard.title', { smart_count: 1 })} />
      
      <Box mb={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </Box>
      
      {/* Summary cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f8f8f8',
              borderTop: '4px solid black'
            }}
            elevation={2}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <BusinessCenterIcon sx={{ mr: 1, color: '#333' }} />
              <Typography variant="h6" color="textSecondary">
                Total Projects
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mt: 'auto' }}>
              {summary.totalProjects}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f8f8f8',
              borderTop: '4px solid #2196f3'
            }}
            elevation={2}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <MoneyIcon sx={{ mr: 1, color: '#2196f3' }} />
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mt: 'auto' }}>
              {formatNumber(summary.totalRevenue)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f8f8f8',
              borderTop: `4px solid ${summary.totalProfit >= 0 ? '#388e3c' : '#b71c1c'}`
            }}
            elevation={2}
          >
            <Box display="flex" alignItems="center" mb={1}>
              {summary.totalProfit >= 0 ? (
                <TrendingUpIcon sx={{ mr: 1, color: '#388e3c' }} />
              ) : (
                <TrendingDownIcon sx={{ mr: 1, color: '#b71c1c' }} />
              )}
              <Typography variant="h6" color="textSecondary">
                Total Profit
              </Typography>
            </Box>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                mt: 'auto',
                color: summary.totalProfit >= 0 ? '#388e3c' : '#b71c1c'
              }}
            >
              {formatNumber(summary.totalProfit)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f8f8f8',
              borderTop: `4px solid ${
                summary.averageProfitability < 0 ? '#b71c1c' :
                summary.averageProfitability < 25 ? '#e53935' :
                summary.averageProfitability < 50 ? '#fb8c00' :
                summary.averageProfitability < 75 ? '#fdd835' :
                summary.averageProfitability < 100 ? '#7cb342' : '#388e3c'
              }`
            }}
            elevation={2}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUpIcon sx={{ mr: 1, color: '#333' }} />
              <Typography variant="h6" color="textSecondary">
                Average Profitability
              </Typography>
            </Box>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                mt: 'auto',
                color: 
                  summary.averageProfitability < 0 ? '#b71c1c' :
                  summary.averageProfitability < 25 ? '#e53935' :
                  summary.averageProfitability < 50 ? '#fb8c00' :
                  summary.averageProfitability < 75 ? '#fdd835' :
                  summary.averageProfitability < 100 ? '#7cb342' : '#388e3c'
              }}
            >
              {summary.averageProfitability}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        {/* Project Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Project Status Breakdown
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box height={300} display="flex" justifyContent="center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={summary.statusBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        label={({ status, value }) => `${status}: ${value}%`}
                        >
                        {summary.statusBreakdown.map((entry, index) => (
                            <Cell 
                            key={`cell-${index}`} 
                            fill={['#000000', '#333333', '#555555', '#777777'][index % 4]} 
                            />
                        ))}
                    </Pie>

                  <Tooltip
                    formatter={(value, name, props) => {
                      return [`${value} projects (${props.payload.value}%)`, 'Count'];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Profitability Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Profitability Distribution
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box height={300} display="flex" justifyContent="center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summary.profitabilityRanges}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fontSize: 10 }}
                    tickMargin={10}
                    angle={-15}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      return name === 'count' ? `${value} projects` : `${value}%`;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Number of Projects">
                    {summary.profitabilityRanges.map((entry, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'][index]} 
                        />
                    ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Projects */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Recent Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {data.projects.slice(0, 4).map((project) => (
                <Grid item xs={12} sm={6} md={3} key={project.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {project.project_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Client: {project.client_name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Cost
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatNumber(project.total_project_cost || 0)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Profit
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={(project.net_profit || 0) >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatNumber(project.net_profit || 0)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box 
                        display="flex" 
                        justifyContent="center" 
                        mt={2} 
                        pt={1}
                        borderTop="1px solid #eee"
                      >
                        <Button 
                          size="small"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;