# Production Cost Management

A professional application for managing production costs, estimates, and project profitability tracking with a sleek black and white interface.

## Overview

This application helps production companies manage project costs, create detailed estimates, track expenses, and calculate profitability metrics. Built with React, Material UI, and PostgreSQL, it provides a comprehensive solution for production cost management.

## Features

### Dashboard
- Visual overview of all projects
- Key metrics display (revenue, expenses, profitability)
- Project status distribution
- Profitability analysis

### Projects Management
- List view with sorting and filtering
- Create, edit, and delete projects
- Status tracking (New, In Progress, Cancelled, Complete)
- Financial metrics calculation

### Estimate Editor
- Section-based cost structure
- Add/remove custom sections
- Detailed line item management
- Provider allocation
- Real-time calculations for:
  - Total project cost
  - Total expenses
  - Net profit
  - Profitability percentage
  - Final profit

### Financial Calculations
- Automatic cost calculations
- Profitability analysis
- Discount and factor adjustments
- Currency formatting

## Technology Stack

### Frontend
- React
- React Admin
- Material UI
- Recharts for data visualization
- Context API for state management

### Backend
- Node.js
- Express
- PostgreSQL database
- RESTful API architecture

## Installation

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL (v13 or later)
- npm or yarn

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/yourusername/production-cost-management.git
   cd production-cost-management
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Configure database
   ```
   # Create a PostgreSQL database
   createdb setup

   # Import schema
   psql setup < schema.sql
   ```

4. Configure environment variables
   ```
   # Edit .env file in the root directory
   DB_USER=yourusername
   DB_PASSWORD=yourpassword
   DB_NAME=setup
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3001
   ```

5. Start the server
   ```
   npm start
   ```

### Frontend Setup
1. Install frontend dependencies
   ```
   # From the project root
   npm install
   ```

2. Configure environment variables
   ```
   # Edit .env file if needed
   REACT_APP_API_URL=http://localhost:3001
   ```

3. Start the development server
   ```
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Project Structure

```
production-cost-management/
├── .env                     # Environment variables
├── .env.production          # Production environment variables
├── .gitignore               # Git ignore file
├── README.md                # This documentation
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Lock file for dependencies
├── node_modules/            # Node.js dependencies
├── public/                  # Static files
│   ├── images/              # Images including logo
│   │   └── logo.png         # Application logo
│   ├── index.html           # Main HTML file
│   └── manifest.json        # Web app manifest
├── server/                  # Backend code
│   ├── node_modules/        # Server dependencies
│   ├── package.json         # Server dependencies
│   ├── package-lock.json    # Server lock file
│   ├── schema.sql           # Database schema
│   └── server.js            # Express server
└── src/                     # Frontend code
    ├── App.jsx              # Main application component
    ├── index.js             # Application entry point
    ├── logo.svg             # SVG logo
    ├── components/          # React components
    │   ├── common/          # Shared components
    │   │   ├── HeaderMetrics.jsx    # Header metrics component
    │   │   ├── ProfitabilityField.jsx # Profitability display component
    │   │   └── StatusField.jsx      # Status display component  
    │   ├── dashboard/       # Dashboard components
    │   │   ├── Dashboard.jsx        # Main dashboard component
    │   │   └── Dashboard.css        # Dashboard styles
    │   ├── estimates/       # Estimate editor components
    │   │   ├── EstimateEditor.jsx   # Estimate editor
    │   │   ├── SectionManager.jsx   # Section management
    │   │   └── TableManager.jsx     # Table management
    │   ├── projects/        # Project management components
    │   │   ├── ProjectCreate.jsx    # Project creation form
    │   │   ├── ProjectEdit.jsx      # Project edit form 
    │   │   ├── ProjectList.jsx      # Projects list view
    │   │   └── ProjectShow.jsx      # Project details view
    │   └── providers/       # Provider management components
    │       └── ProviderModal.jsx    # Provider modal
    ├── config/              # Configuration files
    │   └── sections.js      # Section configuration
    ├── contexts/            # React contexts
    │   └── EstimateContext.js # Estimate state management
    ├── layouts/             # Layout components
    │   └── AppLayout.jsx    # Main app layout
    ├── services/            # API services
    │   ├── authProvider.js  # Authentication service
    │   └── dataProvider.js  # Data service
    ├── themes/              # UI themes
    │   └── theme.js         # Application theme
    └── utils/               # Utility functions
        ├── calculations.js  # Financial calculations
        └── formatters.js    # Data formatting utilities
```

## Usage

### Creating a New Project
1. Click "Create New Project" on the Projects page
2. Enter project name, client name, and producer
3. Save to create the project

### Editing an Estimate
1. Navigate to Projects
2. Click "Edit Estimate" on the project you want to modify
3. Add sections as needed (Pre-Production, Production, etc.)
4. Add line items within each section
5. Set quantities, prices, and other parameters
6. Apply discounts or factors if necessary
7. Add service providers when applicable
8. Click "Save Estimate" to save changes

### Tracking Profitability
The system automatically calculates:
- Individual line item profitability
- Section totals
- Overall project profitability
- Net profit metrics

### Managing Project Status
- Click on the status indicator to change project status
- Available statuses: New, In Progress, Cancelled, Complete
- Status changes are visually indicated with color coding

## Customization

### Adding New Section Types
Edit the `sections.js` file in the config directory:
```javascript
export const sections = {
  order: [
    "your-new-section",
    // existing sections...
  ],
  
  data: {
    "your-new-section": {
      id: "your-new-section",
      title: "Your New Section",
      headers: null // Will use commonHeaders
    },
    // existing section data...
  }
};
```

### Theme Customization
The application uses a black and white theme for professional appearance. You can customize the theme in `themes/theme.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  // Customize primary color
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#333333',  // Customize secondary color
      contrastText: '#FFFFFF',
    },
    // Additional customization...
  },
  // ...
});
```

## Development

### Environmental Variables
- `.env` - Development environment variables
- `.env.production` - Production environment variables

### React Admin
The project uses React Admin for the administrative interface. Customizations include:
- Custom layout with collapsible sidebar
- Custom theme with black and white styling
- Custom field components for status and profitability

### API Integration
API calls are managed through the custom data provider in `services/dataProvider.js`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.