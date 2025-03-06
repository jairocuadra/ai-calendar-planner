import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { usePlanner } from '../../contexts/PlannerContext';

interface HeaderProps {
  title: string;
  onDrawerToggle: () => void;
  onAddProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onDrawerToggle, onAddProject }) => {
  const { autoScheduleTasks } = usePlanner();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            startIcon={<CalendarTodayIcon />}
            onClick={() => window.location.href = '/calendar'}
          >
            Calendar
          </Button>
          <Button 
            color="inherit" 
            startIcon={<AutoAwesomeIcon />}
            onClick={() => autoScheduleTasks()}
          >
            Auto Schedule
          </Button>
          <Button 
            color="inherit" 
            startIcon={<AddIcon />}
            onClick={onAddProject}
          >
            New Project
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 