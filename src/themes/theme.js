import { createTheme } from '@mui/material/styles';

/**
 * Black and white theme 
 */
const theme = createTheme({
  typography: {
    fontSize: 14, // Balanced base font size
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#333333',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDFDFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    divider: '#EEEEEE',
    error: {
      main: '#b71c1c',
    },
    success: {
      main: '#2e7d32',
    },
    // Status colors
    status: {
      new: '#455a64',
      inProgress: '#d84315',
      cancelled: '#b71c1c',
      complete: '#2e7d32',
    },
    // Profitability colors
    profitability: {
      negative: '#b71c1c', // Red for negative
      positive: '#2e7d32', // Green for positive
    },
    // Chart colors
    chart: {
      palette: [
        '#000000',
        '#333333',
        '#555555',
        '#777777',
        '#999999',
        '#BBBBBB',
        '#DDDDDD',
      ]
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: 14, // Root font size adjusted
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          height: 64,
          position: 'fixed',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        sizeSmall: {
          fontSize: '0.8125rem',
          padding: '4px 8px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            padding: '8px 12px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '8px 12px',
          lineHeight: 1.5,
        },
        head: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
        },
        sizeSmall: {
          padding: '6px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            '& .MuiCheckbox-root': {
              color: '#000000',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 4,
          '&.Mui-checked': {
            color: '#000000',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          minHeight: 'auto',
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          '& .column-headerCell': {
            backgroundColor: '#000000',
            color: '#FFFFFF',
          },
          '& .Mui-selected .MuiCheckbox-root': {
            color: '#000000',
          },
        },
      },
    },
    RaListToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
        },
      },
    },
  },
});

export default theme;