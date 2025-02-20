/**
 * Section definitions with order and headers
 */
export const sections = {
    order: [
      "pre-production",
      "production",
      "show-execution",
      "project-teams",
      "extra-expenses",
      "equipment-rental"
    ],
    
    commonHeaders: [
      "Service",
      "Description",
      "Duration",
      "Unit",
      "Qty",
      "Price (est)",
      "Total (est)",
      "Discount",
      "Factor",
      "CR",
      "Providers",
      "Price (act)",
      "Total (act)",
      "Profitability %"
    ],
    
    data: {
      "pre-production": {
        id: "pre-production",
        title: "Pre Production",
        headers: null // Will be set to commonHeaders
      },
      "production": {
        id: "production",
        title: "Production",
        headers: null
      },
      "show-execution": {
        id: "show-execution",
        title: "Show Execution",
        headers: null
      },
      "project-teams": {
        id: "project-teams",
        title: "Project Teams",
        headers: null
      },
      "extra-expenses": {
        id: "extra-expenses",
        title: "Extra Expenses",
        headers: null
      },
      "equipment-rental": {
        id: "equipment-rental",
        title: "Equipment Rental",
        headers: null
      }
    }
  };
  
  // Initialize section headers
  Object.values(sections.data).forEach(section => {
    section.headers = sections.commonHeaders;
  });
  
  export default sections;