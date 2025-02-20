/**
 * Utility functions for financial calculations
 */
import { parseNumber } from './formatters';

/**
 * Calculates row estimated total
 * @param {Object} row - Row data object
 * @returns {number} Calculated total
 */
export const calculateEstimatedTotal = (row) => {
  const qty = parseNumber(row.qty);
  const priceEst = parseNumber(row.priceEst);
  return qty * priceEst;
};

/**
 * Calculates row actual total
 * @param {Object} row - Row data object
 * @returns {number} Calculated total
 */
export const calculateActualTotal = (row) => {
  const qty = parseNumber(row.qty);
  const discount = parseNumber(row.discount) || 1;
  const factor = parseNumber(row.factor) || 1;
  const cr = parseNumber(row.cr) || 1;
  const priceAct = parseNumber(row.priceAct);
  
  return qty * discount * factor * cr * priceAct;
};

/**
 * Calculates profitability percentage
 * @param {number} estTotal - Estimated total (revenue)
 * @param {number} actTotal - Actual total (cost)
 * @returns {number} Profitability percentage
 */
export const calculateProfitability = (estTotal, actTotal) => {
  if (estTotal > 0) {
    // Calculate profit
    const profit = estTotal - actTotal;
    // Calculate profitability percentage
    return Math.round((profit / estTotal) * 100);
  } else if (actTotal > 0) {
    // If no revenue but has costs, profitability is -100%
    return -100;
  }
  return 0;
};

/**
 * Calculates section totals
 * @param {Array} rows - Array of row objects for a section
 * @returns {Object} Object containing estimated and actual totals
 */
export const calculateSectionTotals = (rows) => {
  let estTotal = 0;
  let actTotal = 0;
  
  rows.forEach(row => {
    estTotal += parseNumber(row.totalEst);
    actTotal += parseNumber(row.totalAct);
  });
  
  return { estTotal, actTotal };
};

/**
 * Calculates project totals from all sections
 * @param {Object} sections - Object containing section data
 * @returns {Object} Object with project metrics
 */
export const calculateProjectTotals = (sections) => {
  let totalProjectCost = 0;
  let totalExpenses = 0;
  
  // Sum up all section totals
  Object.values(sections).forEach(section => {
    section.rows.forEach(row => {
      totalProjectCost += parseNumber(row.totalEst);
      totalExpenses += parseNumber(row.totalAct);
    });
  });
  
  // Calculate remaining metrics
  const netProfit = totalProjectCost - totalExpenses;
  
  let profitability = 0;
  if (totalProjectCost > 0) {
    profitability = Math.round((netProfit / totalProjectCost) * 100);
  } else if (totalExpenses > 0) {
    profitability = -100;
  }
  
  // Final profit equals net profit for now
  const finalProfit = netProfit;
  
  return {
    totalProjectCost,
    totalExpenses,
    netProfit,
    profitability,
    finalProfit
  };
};

/**
 * Validates providers for a row
 * @param {Array} providers - Array of provider objects
 * @returns {boolean} True if valid, false otherwise
 */
export const validateProviders = (providers) => {
  if (!providers || providers.length === 0) return true;
  
  const totalPercentage = providers.reduce((sum, provider) => {
    return sum + (parseInt(provider.percentage) || 0);
  }, 0);
  
  return totalPercentage === 100;
};