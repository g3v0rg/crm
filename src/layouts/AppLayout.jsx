import React from 'react';
import { 
  Layout, 
  useSidebarState,
  Title,
  UserMenu, 
  Logout
} from 'react-admin';
import { 
  AppBar as MuiAppBar,
  Box, 
  Toolbar,
  useTheme
} from '@mui/material';
import { Menu } from 'react-admin';
import ProjectIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PropTypes from 'prop-types';

// Constants
const SIDEBAR_FULL_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const APP_BAR_HEIGHT = 64;

// Custom App Bar component
const CustomAppBar = (props) => {
  const theme = useTheme();
  const [open, setOpen] = useSidebarState();
  
  const handleToggleMenu = () => {
    setOpen(!open);
  };
  
  return (
    <MuiAppBar
      {...props}
      position="fixed"
      elevation={0}
      sx={{
        zIndex: 1300,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        height: APP_BAR_HEIGHT,
        width: '100%',
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          minHeight: APP_BAR_HEIGHT, 
          height: APP_BAR_HEIGHT,
          px: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Logo that acts as menu toggle */}
        <Box 
          component="img" 
          src="/images/logo.png" 
          alt="Company Logo" 
          height="36px"
          onClick={handleToggleMenu}
          sx={{ 
            marginRight: theme.spacing(2),
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0)',
          }}
        />
        
        <Title defaultTitle="Production Cost Management" />
        
        <Box flex="1" />
        <UserMenu>
          <Logout />
        </UserMenu>
      </Toolbar>
    </MuiAppBar>
  );
};

// Menu component with collapsible view
const CustomMenu = (props) => {
  const [open] = useSidebarState();
  
  return (
    <Menu 
      {...props} 
      sx={{ 
        marginTop: `${APP_BAR_HEIGHT}px`,
        backgroundColor: '#000000 !important',
        color: '#FFFFFF !important',
        height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
        zIndex: 1200,
        transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        width: open ? `${SIDEBAR_FULL_WIDTH}px` : `${SIDEBAR_COLLAPSED_WIDTH}px`,
        overflow: 'hidden',
        '& .MuiPaper-root': {
          position: 'fixed',
          top: `${APP_BAR_HEIGHT}px !important`,
          bottom: 0,
          height: `calc(100% - ${APP_BAR_HEIGHT}px) !important`,
          backgroundColor: '#000000 !important',
          color: '#FFFFFF !important',
          borderRight: '1px solid #333333',
          width: open ? `${SIDEBAR_FULL_WIDTH}px` : `${SIDEBAR_COLLAPSED_WIDTH}px`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          overflowX: 'hidden',
        },
        '& .RaMenuItemLink-root': {
          color: '#FFFFFF !important',
          padding: '12px 16px',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
        '& .RaMenuItemLink-active': {
          backgroundColor: '#333333 !important',
        },
        '& .MuiListItemIcon-root': {
          color: '#FFFFFF !important',
          minWidth: '40px !important',
          marginRight: open ? '16px' : 0,
          justifyContent: open ? 'flex-start' : 'center',
        },
        '& .MuiListItemText-root': {
          opacity: open ? 1 : 0,
          transition: 'opacity 100ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          width: open ? 'auto' : 0,
          color: '#FFFFFF !important',
          '& .MuiTypography-root': {
            fontSize: '0.875rem',
          }
        },
        '& .MuiSvgIcon-root': {
          color: '#FFFFFF !important',
          fontSize: '1.25rem',
        },
        '& .MuiTypography-root': {
          color: '#FFFFFF !important',
        },
        '& .MuiListItem-root:hover': {
          backgroundColor: '#333333 !important',
        }
      }}
    >
      <Menu.DashboardItem 
        primaryText="Dashboard" 
        leftIcon={<DashboardIcon style={{color: '#FFFFFF'}} />} 
      />
      <Menu.ResourceItem 
        name="projects" 
        primaryText="Projects" 
        leftIcon={<ProjectIcon style={{color: '#FFFFFF'}} />} 
      />
    </Menu>
  );
};

// Custom Layout component with fixed sidebar and appbar
const CustomLayout = (props) => {
  const [sidebarOpen] = useSidebarState();
  const sidebarWidth = sidebarOpen ? SIDEBAR_FULL_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Layout
      {...props}
      appBar={CustomAppBar}
      menu={CustomMenu}
      sx={{
        '& .RaLayout-root': {
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          minHeight: '100vh',
          backgroundColor: '#FDFDFD',
          position: 'relative',
        },
        '& .RaLayout-appFrame': {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          marginTop: `${APP_BAR_HEIGHT}px !important`,
          marginLeft: 0,
        },
        '& .RaLayout-contentWithSidebar': {
          display: 'flex',
          flexGrow: 1,
        },
        '& .RaLayout-content': {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexBasis: 0,
          padding: '20px',
          paddingTop: '20px',
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          backgroundColor: '#FDFDFD',
          fontSize: '0.875rem',
          boxSizing: 'border-box',
          minWidth: 0, // Important for flexbox overflow
        },
        '& .RaSidebar-docked': {
          backgroundColor: '#000000 !important',
          borderRight: '1px solid #333333 !important',
          zIndex: 1100,
          width: `${sidebarWidth}px !important`,
          position: 'fixed',
          top: `${APP_BAR_HEIGHT}px`,
          bottom: 0,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
        '& .RaSidebar-fixed': {
          position: 'fixed',
          top: `${APP_BAR_HEIGHT}px`,
          bottom: 0,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          width: `${sidebarWidth}px !important`,
          zIndex: 1100,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
        '& .RaSidebar-paper': {
          width: `${sidebarWidth}px !important`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
        '& .RaSidebar-root': {
          backgroundColor: '#000000 !important',
          color: '#FFFFFF !important',
          width: `${sidebarWidth}px !important`,
          position: 'fixed',
          top: `${APP_BAR_HEIGHT}px`,
          bottom: 0,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          overflowX: 'hidden',
        },
        '& .MuiDrawer-root': {
          position: 'fixed',
          width: `${sidebarWidth}px !important`,
          top: `${APP_BAR_HEIGHT}px`,
          bottom: 0,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
        '& .MuiDrawer-paper': {
          position: 'fixed !important',
          backgroundColor: '#000000 !important',
          color: '#FFFFFF !important',
          width: `${sidebarWidth}px !important`,
          transition: 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          overflowX: 'hidden',
        },
        // Direct style for menu items
        '& [class*="RaMenuItemLink"]': {
          color: '#FFFFFF !important',
          '&:hover': {
            backgroundColor: '#333333 !important',
          },
          '&.RaMenuItemLink-active': {
            backgroundColor: '#333333 !important',
          }
        },
        // Force icons to be white
        '& .RaSidebar-root .MuiSvgIcon-root': {
          color: '#FFFFFF !important',
        },
        // Set overall font size
        fontSize: '0.875rem',
      }}
    />
  );
};

CustomLayout.propTypes = {
  children: PropTypes.node
};

export default CustomLayout;