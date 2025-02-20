/**
 * Utility functions for formatting and parsing data
 */

/**
 * Formats a number with thousand separators, handling negative values
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const formatted = Number(absNum).toLocaleString('en-US', {
      maximumFractionDigits: 0,
      useGrouping: true
    });
    return isNegative ? `-${formatted}` : formatted;
  };
  
  /**
   * Parses a number from a formatted string, preserving negative values
   * @param {string} str - The string to parse
   * @returns {number} Parsed number
   */
  export const parseNumber = (str) => {
    if (!str && str !== 0) return 0;
    
    const trimmed = str.toString().trim();
    const isNegative = trimmed.startsWith('-');
    // Remove all non-digit characters except the negative sign
    const numericStr = isNegative ? 
      trimmed.substring(1).replace(/\D/g, '') : 
      trimmed.replace(/\D/g, '');
    
    const value = parseInt(numericStr) || 0;
    return isNegative ? -value : value;
  };
  
  /**
   * Formats a date for display as "14 Feb 2025, 09:42"
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const day = dateObj.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };
  
  /**
   * Gets the appropriate color for profitability percentage
   * @param {number} profitability - Profitability percentage
   * @returns {string} Color code
   */
  export const getProfitabilityColor = (profitability) => {
    return profitability >= 0 ? '#2e7d32' : '#b71c1c'; // Green for positive, red for negative
  };
  
  /**
   * Gets status color
   * @param {string} status - The status value
   * @returns {string} Color code
   */
  export const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#455a64';
      case 'In Progress': return '#d84315';
      case 'Cancelled': return '#b71c1c';
      case 'Complete': return '#2e7d32';
      default: return '#455a64';
    }
  };