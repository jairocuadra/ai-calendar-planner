import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Close as CloseIcon,
  AccessTime as TimeIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { usePlanner } from '../contexts/PlannerContext';
import { Project, Task, Priority } from '../types';
import { format } from 'date-fns';
import { resetToMockData } from '../utils/mockData';

const priorityColors = {
  [Priority.LOW]: '#8bc34a',
  [Priority.MEDIUM]: '#ffc107',
  [Priority.HIGH]: '#ff9800',
  [Priority.URGENT]: '#f44336'
};

const priorityLabels = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
  [Priority.URGENT]: 'Urgent'
};

const ProjectsPage: React.FC = () => {
  const { 
    projects, 
    tasks, 
    addProject, 
    updateProject, 
    deleteProject, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask,
    toggleTaskAutoSchedule
  } = usePlanner();

  // Debug logging
  console.log('Projects in ProjectsPage:', projects);
  console.log('Tasks in ProjectsPage:', tasks);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Project dialog state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectFormMode, setProjectFormMode] = useState<'add' | 'edit'>('add');
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    color: '#3f51b5'
  });
  
  // Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'add' | 'edit'>('add');
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    projectId: '',
    estimatedHours: 1,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: undefined,
    scheduledStart: undefined,
    scheduledEnd: undefined
  });

  // Project detail dialog state
  const [projectDetailDialogOpen, setProjectDetailDialogOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  // Handle project form submission
  const handleProjectSubmit = () => {
    if (projectFormMode === 'add') {
      addProject(projectForm);
    } else {
      if (selectedProject) {
        updateProject({
          ...selectedProject,
          ...projectForm
        });
      }
    }
    setProjectDialogOpen(false);
  };

  // Handle task form submission
  const handleTaskSubmit = () => {
    if (taskFormMode === 'add') {
      addTask(taskForm);
    } else {
      if (taskForm.id) {
        const taskToUpdate = tasks.find(t => t.id === taskForm.id);
        if (taskToUpdate) {
          updateTask({
            ...taskToUpdate,
            ...taskForm
          });
        }
      }
    }
    setTaskDialogOpen(false);
  };

  // Open add project dialog
  const openAddProjectDialog = () => {
    setProjectForm({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      color: '#3f51b5'
    });
    setProjectFormMode('add');
    setProjectDialogOpen(true);
  };

  // Open edit project dialog
  const openEditProjectDialog = (project: Project) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      priority: project.priority,
      color: project.color
    });
    setProjectFormMode('edit');
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  // Open add task dialog
  const openAddTaskDialog = (projectId: string) => {
    setTaskForm({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      projectId,
      estimatedHours: 1,
      completed: false,
      autoSchedule: true,
      locked: false,
      dueDate: undefined,
      scheduledStart: undefined,
      scheduledEnd: undefined
    });
    setTaskFormMode('add');
    setTaskDialogOpen(true);
  };

  // Open edit task dialog
  const openEditTaskDialog = (task: Task) => {
    setTaskForm({
      ...task,
      id: task.id
    });
    setTaskFormMode('edit');
    setTaskDialogOpen(true);
  };

  // Get tasks for a specific project
  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  // Open project detail dialog
  const openProjectDetailDialog = (project: Project) => {
    setSelectedProjectForDetail(project);
    setProjectDetailDialogOpen(true);
  };

  // Force reload mock data
  const forceReloadMockData = () => {
    resetToMockData();
  };

  // Reset task form
  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      projectId: '',
      estimatedHours: 1,
      completed: false,
      autoSchedule: true,
      locked: false,
      dueDate: undefined,
      scheduledStart: undefined,
      scheduledEnd: undefined
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
          Projects
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="error"
            onClick={forceReloadMockData}
            sx={{ mr: 1 }}
            size="small"
          >
            Reset Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon fontSize="small" />}
            onClick={openAddProjectDialog}
            size="small"
          >
            Add Project
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {projects.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="body1" color="text.secondary">
                No projects yet. Create your first project to get started.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          projects.map(project => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: `3px solid ${project.color}`,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                      {project.title}
                    </Typography>
                    <Chip 
                      label={priorityLabels[project.priority]} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${priorityColors[project.priority]}20`, 
                        color: priorityColors[project.priority],
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: '20px'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 1.5, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '2.5em'
                  }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {getProjectTasks(project.id).length} tasks
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ pt: 0, px: 2, pb: 1.5 }}>
                  <Button 
                    size="small" 
                    onClick={() => openProjectDetailDialog(project)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon fontSize="small" />} 
                    onClick={() => openAddTaskDialog(project.id)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Add Task
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton 
                    size="small" 
                    onClick={() => openEditProjectDialog(project)}
                    sx={{ p: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => deleteProject(project.id)}
                    sx={{ p: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
          {projectFormMode === 'add' ? 'Add New Project' : 'Edit Project'}
          <IconButton
            aria-label="close"
            onClick={() => setProjectDialogOpen(false)}
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
            value={projectForm.title}
            onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
            sx={{ mb: 1.5, mt: 0.5 }}
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
            value={projectForm.description}
            onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
            sx={{ mb: 1.5 }}
            size="small"
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <FlagIcon sx={{ mr: 1, color: priorityColors[projectForm.priority] }} />
                <FormControl fullWidth size="small">
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    value={projectForm.priority}
                    label="Priority"
                    onChange={(e) => setProjectForm({...projectForm, priority: e.target.value as Priority})}
                    size="small"
                  >
                    <MenuItem value={Priority.LOW}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.LOW] }} />
                        <span>Low</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.MEDIUM}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.MEDIUM] }} />
                        <span>Medium</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.HIGH}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.HIGH] }} />
                        <span>High</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.URGENT}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.URGENT] }} />
                        <span>Urgent</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: projectForm.color,
                  mr: 1,
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
                <TextField
                  margin="dense"
                  id="color"
                  label="Color"
                  type="color"
                  fullWidth
                  variant="outlined"
                  value={projectForm.color}
                  onChange={(e) => setProjectForm({...projectForm, color: e.target.value})}
                  size="small"
                  sx={{ m: 0 }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button onClick={() => setProjectDialogOpen(false)} size="small">Cancel</Button>
          <Button onClick={handleProjectSubmit} variant="contained" size="small">
            {projectFormMode === 'add' ? 'Add Project' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
          {taskFormMode === 'add' ? 'Add New Task' : 'Edit Task'}
          <IconButton
            aria-label="close"
            onClick={() => setTaskDialogOpen(false)}
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
            id="task-title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={taskForm.title}
            onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
            sx={{ mb: 1.5, mt: 0.5 }}
            size="small"
          />
          <TextField
            margin="dense"
            id="task-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={taskForm.description}
            onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
            sx={{ mb: 1.5 }}
            size="small"
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <FlagIcon sx={{ mr: 1, color: priorityColors[taskForm.priority] }} />
                <FormControl fullWidth size="small">
                  <InputLabel id="task-priority-label">Priority</InputLabel>
                  <Select
                    labelId="task-priority-label"
                    id="task-priority"
                    value={taskForm.priority}
                    label="Priority"
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as Priority})}
                    size="small"
                  >
                    <MenuItem value={Priority.LOW}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.LOW] }} />
                        <span>Low</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.MEDIUM}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.MEDIUM] }} />
                        <span>Medium</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.HIGH}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.HIGH] }} />
                        <span>High</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={Priority.URGENT}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon fontSize="small" sx={{ mr: 1, color: priorityColors[Priority.URGENT] }} />
                        <span>Urgent</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <TimeIcon sx={{ mr: 1 }} />
                <TextField
                  margin="dense"
                  id="estimated-hours"
                  label="Hours"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({...taskForm, estimatedHours: Number(e.target.value)})}
                  inputProps={{ min: 0.5, step: 0.5 }}
                  size="small"
                  sx={{ m: 0 }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <CalendarIcon sx={{ mr: 1 }} />
            <TextField
              margin="dense"
              id="due-date"
              label="Due Date (Optional)"
              type="date"
              fullWidth
              variant="outlined"
              value={taskForm.dueDate ? format(taskForm.dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setTaskForm({
                ...taskForm, 
                dueDate: e.target.value ? new Date(e.target.value) : undefined
              })}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ m: 0 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={taskForm.autoSchedule}
                  onChange={(e) => setTaskForm({...taskForm, autoSchedule: e.target.checked})}
                  size="small"
                />
              }
              label={<Typography variant="body2">Auto-schedule</Typography>}
            />
            
            {taskFormMode === 'edit' && taskForm.scheduledStart && taskForm.scheduledEnd && (
              <FormControlLabel
                control={
                  <Switch
                    checked={taskForm.locked}
                    onChange={(e) => setTaskForm({...taskForm, locked: e.target.checked})}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Lock schedule</Typography>}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button onClick={() => setTaskDialogOpen(false)} size="small">Cancel</Button>
          <Button onClick={handleTaskSubmit} variant="contained" size="small">
            {taskFormMode === 'add' ? 'Add Task' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog 
        open={projectDetailDialogOpen} 
        onClose={() => setProjectDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProjectForDetail && (
          <>
            <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      bgcolor: selectedProjectForDetail.color,
                      mr: 1,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    {selectedProjectForDetail.title}
                  </Typography>
                  <Chip 
                    label={priorityLabels[selectedProjectForDetail.priority]} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: `${priorityColors[selectedProjectForDetail.priority]}20`, 
                      color: priorityColors[selectedProjectForDetail.priority],
                      height: '20px',
                      fontSize: '0.7rem'
                    }} 
                  />
                </Box>
                <Box>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setProjectDetailDialogOpen(false);
                      openEditProjectDialog(selectedProjectForDetail);
                    }}
                    size="small"
                    sx={{ mr: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="close"
                    onClick={() => setProjectDetailDialogOpen(false)}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  {selectedProjectForDetail.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: '0.75rem' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Created: {format(new Date(selectedProjectForDetail.createdAt), 'MMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2, fontSize: '0.75rem' }}>
                    Last updated: {format(new Date(selectedProjectForDetail.updatedAt), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Tasks
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={() => {
                    setProjectDetailDialogOpen(false);
                    openAddTaskDialog(selectedProjectForDetail.id);
                  }}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Add Task
                </Button>
              </Box>
              
              {getProjectTasks(selectedProjectForDetail.id).length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No tasks yet. Add your first task to get started.
                </Typography>
              ) : (
                <List sx={{ 
                  p: 0, 
                  border: '1px solid rgba(0,0,0,0.08)', 
                  borderRadius: 1,
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {getProjectTasks(selectedProjectForDetail.id).map(task => (
                    <ListItem 
                      key={task.id}
                      sx={{ 
                        py: 0.75,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => {
                            setProjectDetailDialogOpen(false);
                            openEditTaskDialog(task);
                          }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FlagIcon sx={{ color: priorityColors[task.priority], fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                              {task.title}
                            </Typography>
                            {task.completed && (
                              <Chip 
                                label="Completed" 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1, height: '18px', fontSize: '0.7rem' }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.75rem' }} />
                            <Typography variant="body2" component="span" sx={{ fontSize: '0.75rem' }}>
                              {task.estimatedHours}h
                            </Typography>
                            {task.dueDate && (
                              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.75rem' }} />
                                <Typography variant="body2" component="span" sx={{ fontSize: '0.75rem' }}>
                                  Due: {format(new Date(task.dueDate), 'MMM d')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 2, py: 1 }}>
              <Button onClick={() => setProjectDetailDialogOpen(false)} size="small">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectsPage; 