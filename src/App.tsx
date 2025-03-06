import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CssBaseline, Box, Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, FormControl, InputLabel, IconButton, AppBar } from '@mui/material';
import { Dashboard as DashboardIcon, CalendarToday as CalendarIcon, Add as AddIcon, Close as CloseIcon, Menu as MenuIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { PlannerProvider, usePlanner } from './contexts/PlannerContext';
import { Priority } from './types';
import ProjectsPage from './pages/ProjectsPage';
import CalendarPage from './pages/CalendarPage';
import { resetToMockData } from './utils/mockData';
import theme from './utils/theme';

// Main App wrapper that provides the PlannerContext
function App() {
  return (
    <ThemeProvider theme={theme}>
      <PlannerProvider>
        <AppContent />
      </PlannerProvider>
    </ThemeProvider>
  );
}

// App content that uses the PlannerContext
function AppContent() {
  const { addProject } = usePlanner();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    color: '#3498db'
  });

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      addProject(newProject);
      setNewProject({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
        color: '#3498db'
      });
    }
    setAddProjectDialogOpen(false);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: 'white',
            color: 'text.primary'
          }}
        >
          <Toolbar variant="dense" sx={{ minHeight: '56px' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
              AI Calendar Planner
            </Typography>
            <IconButton 
              color="inherit" 
              size="small"
              onClick={resetToMockData}
              sx={{ mr: 1 }}
              title="Reset Data"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <Button 
              variant="outlined"
              size="small"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setAddProjectDialogOpen(true)}
              sx={{ ml: 1 }}
            >
              New Project
            </Button>
          </Toolbar>
        </AppBar>
        
        {/* Drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: 220,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 220,
              boxSizing: 'border-box',
              top: '56px',
              height: 'auto',
              bottom: 0,
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: 'none',
            },
          }}
        >
          <Box sx={{ overflow: 'auto', mt: '56px' }}>
            <List>
              <ListItem 
                component={Link} 
                to="/" 
                onClick={toggleDrawer} 
                sx={{ 
                  cursor: 'pointer',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Projects" 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }} 
                />
              </ListItem>
              <ListItem 
                component={Link} 
                to="/calendar" 
                onClick={toggleDrawer} 
                sx={{ 
                  cursor: 'pointer',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Calendar" 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }} 
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            width: '100%',
            ml: 0,
            mt: '56px',
            backgroundColor: 'background.default',
            height: 'calc(100vh - 56px)',
            overflow: 'auto'
          }}
        >
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
      
      {/* Add Project Dialog */}
      <Dialog 
        open={addProjectDialogOpen} 
        onClose={() => setAddProjectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
          Add New Project
          <IconButton
            aria-label="close"
            onClick={() => setAddProjectDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary'
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Project Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newProject.title}
            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
            sx={{ mb: 2, mt: 0.5 }}
            size="small"
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            sx={{ mb: 2 }}
            size="small"
          />
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={newProject.priority}
              label="Priority"
              onChange={(e) => setNewProject({...newProject, priority: e.target.value as Priority})}
            >
              <MenuItem value={Priority.LOW}>Low</MenuItem>
              <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={Priority.HIGH}>High</MenuItem>
              <MenuItem value={Priority.URGENT}>Urgent</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="color"
            label="Color"
            type="color"
            fullWidth
            variant="outlined"
            value={newProject.color}
            onChange={(e) => setNewProject({...newProject, color: e.target.value})}
            sx={{ mb: 1 }}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setAddProjectDialogOpen(false)} size="small">Cancel</Button>
          <Button onClick={handleAddProject} variant="contained" size="small">Add Project</Button>
        </DialogActions>
      </Dialog>
    </Router>
  );
}

export default App;
