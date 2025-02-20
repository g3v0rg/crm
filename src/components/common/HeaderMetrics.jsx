import React from 'react';
import { Card, Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/formatters';
import { getProfitabilityColor } from '../../utils/formatters';

const MetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const MetricValue = styled(Typography)(({ theme, ispositive, color }) => ({
  fontWeight: 'bold',
  color: color || (ispositive ? theme.palette.success.main : theme.palette.error.main)
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

/**
 * HeaderMetrics component displays key project metrics in a grid
 */
const HeaderMetrics = ({ metrics }) => {
  if (!metrics) return null;
  
  const { totalProjectCost, totalExpenses, netProfit, profitability, finalProfit } = metrics;
  
  // Determine if values are positive or negative
  const isNetProfitPositive = netProfit >= 0;
  const isFinalProfitPositive = finalProfit >= 0;
  
  // Get profitability color
  const profitabilityColor = getProfitabilityColor(profitability);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard elevation={2}>
            <MetricLabel variant="body2">Total Project Cost (Est)</MetricLabel>
            <MetricValue variant="h6" color="text.primary">
              {formatNumber(totalProjectCost)}
            </MetricValue>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard elevation={2}>
            <MetricLabel variant="body2">Total Expenses (Act)</MetricLabel>
            <MetricValue variant="h6" color="text.primary">
              {formatNumber(totalExpenses)}
            </MetricValue>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard elevation={2}>
            <MetricLabel variant="body2">Net Profit</MetricLabel>
            <MetricValue variant="h6" ispositive={isNetProfitPositive}>
              {formatNumber(netProfit)}
            </MetricValue>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard elevation={2}>
            <MetricLabel variant="body2">Profitability %</MetricLabel>
            <MetricValue variant="h6" color={profitabilityColor}>
              {profitability}%
            </MetricValue>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard elevation={2}>
            <MetricLabel variant="body2">Final Profit</MetricLabel>
            <MetricValue variant="h6" ispositive={isFinalProfitPositive}>
              {formatNumber(finalProfit)}
            </MetricValue>
          </MetricCard>
        </Grid>
      </Grid>
    </Box>
  );
};

HeaderMetrics.propTypes = {
  metrics: PropTypes.shape({
    totalProjectCost: PropTypes.number.isRequired,
    totalExpenses: PropTypes.number.isRequired,
    netProfit: PropTypes.number.isRequired,
    profitability: PropTypes.number.isRequired,
    finalProfit: PropTypes.number.isRequired
  }).isRequired
};

export default HeaderMetrics;