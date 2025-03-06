import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemIcon, Chip, IconButton, DialogActions, TextField, FormControlLabel, Switch, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { usePlanner } from '../contexts/PlannerContext';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { Task, Priority } from '../types';
import { Flag as FlagIcon, AccessTime as TimeIcon, Close as CloseIcon, Lock as LockIcon, LockOpen as LockOpenIcon, CalendarToday as CalendarIcon, Schedule as ScheduleIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const priorityColors = {
  [Priority.LOW]: '#8bc34a',
  [Priority.MEDIUM]: '#ffc107',
  [Priority.HIGH]: '#ff9800',
  [Priority.URGENT]: '#f44336'
};

const CalendarPage: React.FC = () => {
  const { events, tasks, projects, scheduleTask, autoScheduleTasks, toggleTaskLock, toggleTaskAutoSchedule, updateTask } = usePlanner();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskSelectDialogOpen, setTaskSelectDialogOpen] = useState(false);
  const [taskDetailsDialogOpen, setTaskDetailsDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date; view: any } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  // Convert our events to FullCalendar format
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
    extendedProps: {
      taskId: event.taskId,
      projectId: event.projectId
    }
  }));

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const taskId = clickInfo.event.extendedProps.taskId;
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
        setEditedTask({...task});
        setTaskDetailsDialogOpen(true);
        setEditMode(false);
      }
    }
  };

  // Handle date select for scheduling
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Always open task selection dialog when dragging on calendar
    setTaskSelectDialogOpen(true);
    
    // Store the selected time slot for later use
    setSelectedTimeSlot({
      start: selectInfo.start,
      end: selectInfo.end,
      view: selectInfo.view
    });
  };

  // Get unscheduled tasks
  const getUnscheduledTasks = () => {
    return tasks.filter(task => 
      !task.completed && (!task.scheduledStart || !task.scheduledEnd)
    );
  };

  // Handle task selection for scheduling
  const handleTaskSelect = (task: Task) => {
    if (selectedTimeSlot) {
      // Schedule the task at the selected time slot
      scheduleTask(task.id, selectedTimeSlot.start, selectedTimeSlot.end);
      selectedTimeSlot.view.calendar.unselect();
      setSelectedTimeSlot(null);
    } else {
      // If no time slot is selected, just set the task for later scheduling
      setSelectedTask(task);
    }
    setTaskSelectDialogOpen(false);
  };

  // Handle lock/unlock task
  const handleToggleLock = (taskId: string) => {
    toggleTaskLock(taskId);
    setTaskDetailsDialogOpen(false);
  };

  // Handle auto-scheduling of tasks
  const handleAutoSchedule = () => {
    autoScheduleTasks();
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (editedTask) {
      updateTask(editedTask);
      setSelectedTask(editedTask);
      setEditMode(false);
    }
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
          Calendar
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<ScheduleIcon />}
          onClick={handleAutoSchedule}
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 1
          }}
        >
          Auto-Schedule Tasks
        </Button>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 1.5, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 1
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={calendarEvents}
          eventClick={handleEventClick}
          select={handleDateSelect}
          height="100%"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          expandRows={true}
          stickyHeaderDates={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </Paper>

      {selectedTask && (
        <Paper 
          elevation={0}
          sx={{ 
            mt: 2, 
            p: 1.5, 
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 1
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                Scheduling: {selectedTask.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Select a time slot on the calendar to schedule this task
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedTask(null)}
              size="small"
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      {/* Task Selection Dialog */}
      <Dialog 
        open={taskSelectDialogOpen} 
        onClose={() => setTaskSelectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
          Select a Task to Schedule
          <IconButton
            aria-label="close"
            onClick={() => setTaskSelectDialogOpen(false)}
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
        <DialogContent dividers sx={{ p: 0 }}>
          {getUnscheduledTasks().length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No unscheduled tasks available.
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {getUnscheduledTasks().map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <ListItem 
                    key={task.id} 
                    onClick={() => handleTaskSelect(task)}
                    sx={{ 
                      borderLeft: `3px solid ${project?.color || '#ccc'}`,
                      py: 1,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FlagIcon sx={{ color: priorityColors[task.priority], fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                          <Typography variant="body2" component="span" sx={{ fontSize: '0.75rem' }}>
                            {task.estimatedHours}h
                          </Typography>
                          {project && (
                            <Chip 
                              label={project.title} 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                bgcolor: `${project.color}20`, 
                                color: project.color,
                                height: '18px',
                                fontSize: '0.7rem'
                              }} 
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button onClick={() => setTaskSelectDialogOpen(false)} size="small">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog 
        open={taskDetailsDialogOpen} 
        onClose={() => setTaskDetailsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ px: 2, py: 1.5, fontSize: '1rem' }}>
          {editMode ? 'Edit Task' : 'Task Details'}
          <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex' }}>
            {!editMode && (
              <IconButton
                aria-label="edit"
                onClick={toggleEditMode}
                sx={{ color: 'text.secondary', mr: 0.5 }}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              aria-label="close"
              onClick={() => setTaskDetailsDialogOpen(false)}
              sx={{ color: 'text.secondary' }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
          {selectedTask && editedTask && (
            <Box>
              {editMode ? (
                // Edit Mode
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Task Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    sx={{ mb: 1.5, mt: 0.5 }}
                    size="small"
                  />
                  <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    sx={{ mb: 1.5 }}
                    size="small"
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <FlagIcon sx={{ mr: 1, color: priorityColors[editedTask.priority] }} />
                        <FormControl fullWidth size="small">
                          <InputLabel id="edit-task-priority-label">Priority</InputLabel>
                          <Select
                            labelId="edit-task-priority-label"
                            id="edit-task-priority"
                            value={editedTask.priority}
                            label="Priority"
                            onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as Priority})}
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
                          label="Hours"
                          type="number"
                          fullWidth
                          variant="outlined"
                          value={editedTask.estimatedHours}
                          onChange={(e) => setEditedTask({...editedTask, estimatedHours: Number(e.target.value)})}
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
                      label="Due Date (Optional)"
                      type="date"
                      fullWidth
                      variant="outlined"
                      value={editedTask.dueDate ? format(editedTask.dueDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setEditedTask({
                        ...editedTask, 
                        dueDate: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Box>
                </>
              ) : (
                // View Mode
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    {selectedTask.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedTask.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlagIcon sx={{ color: priorityColors[selectedTask.priority], mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">
                      Priority: {selectedTask.priority}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimeIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">
                      Estimated: {selectedTask.estimatedHours} hours
                    </Typography>
                  </Box>
                  
                  {selectedTask.scheduledStart && selectedTask.scheduledEnd && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2">
                        Scheduled: {format(new Date(selectedTask.scheduledStart), 'MMM d, HH:mm')} - {format(new Date(selectedTask.scheduledEnd), 'HH:mm')}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!editMode ? !selectedTask.autoSchedule : !editedTask.autoSchedule}
                      onChange={() => {
                        if (editMode) {
                          setEditedTask({...editedTask, autoSchedule: !editedTask.autoSchedule});
                        } else {
                          toggleTaskAutoSchedule(selectedTask.id);
                        }
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Manual scheduling
                    </Typography>
                  }
                />
                
                {editMode ? (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon fontSize="small" />}
                    onClick={saveEditedTask}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={selectedTask.locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                    onClick={() => handleToggleLock(selectedTask.id)}
                  >
                    {selectedTask.locked ? 'Unlock' : 'Lock'}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          {editMode ? (
            <Button onClick={() => setEditMode(false)} size="small">Cancel</Button>
          ) : (
            <Button onClick={() => setTaskDetailsDialogOpen(false)} size="small">Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage; 