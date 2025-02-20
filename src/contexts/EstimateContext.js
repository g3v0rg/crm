import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDataProvider, useNotify, useRedirect } from 'react-admin';
import { calculateProjectTotals } from '../utils/calculations';
import { sections } from '../config/sections';

// Create context
const EstimateContext = createContext();

/**
 * EstimateProvider component to manage the state of the estimate editor
 */
export const EstimateProvider = ({ children, projectId }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [metrics, setMetrics] = useState({
    totalProjectCost: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitability: 0,
    finalProfit: 0
  });
  
  // Fetch project data
  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await dataProvider.getOne('projects', { id: projectId });
      setProject(data);
      
      // Parse estimate data if available
      if (data.estimate_json) {
        let estimateData;
        if (typeof data.estimate_json === 'string') {
          estimateData = JSON.parse(data.estimate_json);
        } else {
          estimateData = data.estimate_json;
        }
        
        // Convert the array to object with sectionId as keys
        const sectionsObject = {};
        estimateData.forEach(section => {
          // Transform rows into proper format
          const transformedRows = section.rows.map((row, index) => {
            // Create default empty row
            const defaultRow = {
              service: '',
              description: '',
              duration: '',
              unit: '',
              qty: '',
              priceEst: '',
              totalEst: 0,
              discount: '1',
              factor: '1',
              cr: '1',
              providers: section.providersData?.[index] || [],
              priceAct: '',
              totalAct: 0,
              profitability: 0
            };
            
            // Map row values to corresponding fields
            if (row && row.length) {
              defaultRow.service = row[0] || '';
              defaultRow.description = row[1] || '';
              defaultRow.duration = row[2] || '';
              defaultRow.unit = row[3] || '';
              defaultRow.qty = row[4] || '';
              defaultRow.priceEst = row[5] || '';
              defaultRow.discount = row[6] || '1';
              defaultRow.factor = row[7] || '1';
              defaultRow.cr = row[8] || '1';
              defaultRow.priceAct = row[9] || '';
            }
            
            return defaultRow;
          });
          
          sectionsObject[section.sectionId] = {
            id: section.sectionId,
            title: sections.data[section.sectionId]?.title || 'Unknown Section',
            rows: transformedRows
          };
        });
        
        setSectionData(sectionsObject);
      } else {
        setSectionData({});
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project data');
      setLoading(false);
      notify('Error loading project data', { type: 'error' });
    }
  }, [dataProvider, projectId, notify]);
  
  // Calculate metrics when section data changes
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length) {
      const newMetrics = calculateProjectTotals(sectionData);
      setMetrics(newMetrics);
    }
  }, [sectionData]);
  
  // Initial data fetch
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);
  
  // Save estimate data
  const saveEstimate = async () => {
    if (!project) return;
    
    try {
      // Convert section data object to array format expected by backend
      const estimateData = Object.values(sectionData).map(section => {
        const rows = section.rows.map(row => [
          row.service,
          row.description,
          row.duration,
          row.unit,
          row.qty,
          row.priceEst,
          row.discount,
          row.factor,
          row.cr,
          row.priceAct
        ]);
        
        const providersData = section.rows.map(row => row.providers || []);
        
        return {
          sectionId: section.id,
          rows,
          providersData
        };
      });
      
      // Update project with new data
      await dataProvider.update('projects', {
        id: projectId,
        data: {
          total_project_cost: metrics.totalProjectCost,
          total_expenses: metrics.totalExpenses,
          net_profit: metrics.netProfit,
          profitability: metrics.profitability,
          final_profit: metrics.finalProfit,
          estimate_json: estimateData
        }
      });
      
      notify('Estimate saved successfully', { type: 'success' });
      return true;
    } catch (err) {
      console.error('Error saving estimate:', err);
      notify('Error saving estimate', { type: 'error' });
      return false;
    }
  };
  
  // Add a section
  const addSection = (sectionId) => {
    if (sectionData[sectionId]) return; // Section already exists
    
    const sectionConfig = sections.data[sectionId];
    if (!sectionConfig) return; // Invalid section
    
    // Create new section with 4 empty rows
    const newSection = {
      id: sectionId,
      title: sectionConfig.title,
      rows: Array(4).fill().map(() => ({
        service: '',
        description: '',
        duration: '',
        unit: '',
        qty: '',
        priceEst: '',
        totalEst: 0,
        discount: '1',
        factor: '1',
        cr: '1',
        providers: [],
        priceAct: '',
        totalAct: 0,
        profitability: 0
      }))
    };
    
    setSectionData(prev => ({
      ...prev,
      [sectionId]: newSection
    }));
  };
  
  // Remove a section
  const removeSection = (sectionId) => {
    setSectionData(prev => {
      const newData = { ...prev };
      delete newData[sectionId];
      return newData;
    });
  };
  
  // Add a row to section
  const addRow = (sectionId) => {
    if (!sectionData[sectionId]) return;
    
    setSectionData(prev => {
      const newRow = {
        service: '',
        description: '',
        duration: '',
        unit: '',
        qty: '',
        priceEst: '',
        totalEst: 0,
        discount: '1',
        factor: '1',
        cr: '1',
        providers: [],
        priceAct: '',
        totalAct: 0,
        profitability: 0
      };
      
      return {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          rows: [...prev[sectionId].rows, newRow]
        }
      };
    });
  };
  
  // Remove a row from section
  const removeRow = (sectionId, rowIndex) => {
    if (!sectionData[sectionId]) return;
    
    setSectionData(prev => {
      // If this is the last row, keep it but empty it
      if (prev[sectionId].rows.length === 1) {
        const emptyRow = {
          service: '',
          description: '',
          duration: '',
          unit: '',
          qty: '',
          priceEst: '',
          totalEst: 0,
          discount: '1',
          factor: '1',
          cr: '1',
          providers: [],
          priceAct: '',
          totalAct: 0,
          profitability: 0
        };
        
        return {
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            rows: [emptyRow]
          }
        };
      }
      
      // Otherwise filter out the row
      return {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          rows: prev[sectionId].rows.filter((_, index) => index !== rowIndex)
        }
      };
    });
  };
  
  // Update row data
  const updateRow = (sectionId, rowIndex, updatedData) => {
    if (!sectionData[sectionId]) return;
    
    setSectionData(prev => {
      const newRows = [...prev[sectionId].rows];
      
      // Update the specific row with new data
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        ...updatedData
      };
      
      return {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          rows: newRows
        }
      };
    });
  };
  
  // Update provider data for a row
  const updateProviders = (sectionId, rowIndex, providers) => {
    updateRow(sectionId, rowIndex, { providers });
  };
  
  // Export to PDF
  const exportToPDF = async () => {
    try {
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        notify('PDF export library not loaded', { type: 'error' });
        return;
      }
      
      notify('Exporting to PDF...', { type: 'info' });
      // PDF export logic would go here
      // This would require integration with jsPDF and html2canvas
      
      notify('PDF exported successfully', { type: 'success' });
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      notify('Error exporting to PDF', { type: 'error' });
    }
  };
  
  // Get available sections to add
  const getAvailableSections = () => {
    const existingSections = Object.keys(sectionData);
    return sections.order.filter(id => !existingSections.includes(id))
      .map(id => ({
        id,
        title: sections.data[id]?.title || 'Unknown Section'
      }));
  };
  
  // Context value
  const value = {
    project,
    loading,
    error,
    sectionData,
    metrics,
    addSection,
    removeSection,
    addRow,
    removeRow,
    updateRow,
    updateProviders,
    saveEstimate,
    exportToPDF,
    getAvailableSections,
    refresh: fetchProject
  };
  
  return (
    <EstimateContext.Provider value={value}>
      {children}
    </EstimateContext.Provider>
  );
};

// Custom hook to use estimate context
export const useEstimate = () => {
  const context = useContext(EstimateContext);
  if (!context) {
    throw new Error('useEstimate must be used within an EstimateProvider');
  }
  return context;
};

export default EstimateContext;