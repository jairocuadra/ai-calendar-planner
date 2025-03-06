import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, Task, Priority, CalendarEvent } from '../types';
import { mockProjects, mockTasks, mockEvents } from '../utils/mockData';

interface PlannerContextType {
  projects: Project[];
  tasks: Task[];
  events: CalendarEvent[];
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  scheduleTask: (taskId: string, start: Date, end: Date, skipAutoSchedule?: boolean) => void;
  completeTask: (taskId: string) => void;
  autoScheduleTasks: () => void;
  toggleTaskAutoSchedule: (taskId: string) => void;
  toggleTaskLock: (taskId: string) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};

interface PlannerProviderProps {
  children: ReactNode;
}

export const PlannerProvider: React.FC<PlannerProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load mock data on initial render
  useEffect(() => {
    console.log('Loading mock data:', { 
      mockProjects: mockProjects.length, 
      mockTasks: mockTasks.length, 
      mockEvents: mockEvents.length 
    });
    
    // Create a test project to ensure functionality works
    const testProject: Project = {
      id: 'test-project',
      title: 'Test Project',
      description: 'This is a test project to ensure functionality works',
      priority: Priority.HIGH,
      color: '#9c27b0',
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Always use mock data
    setProjects([testProject, ...mockProjects]);
    setTasks(mockTasks);
    setEvents(mockEvents);
  }, []);

  // Disable localStorage saving
  useEffect(() => {}, [projects]);
  useEffect(() => {}, [tasks]);
  useEffect(() => {}, [events]);

  const addProject = (projectData: Omit<Project, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      tasks: [],
      createdAt: now,
      updatedAt: now
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    return newProject;
  };

  const updateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date() } 
        : project
    );
    setProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    // Delete all tasks associated with this project
    const updatedTasks = tasks.filter(task => task.projectId !== projectId);
    setTasks(updatedTasks);
    
    // Delete all events associated with this project
    const updatedEvents = events.filter(event => event.projectId !== projectId);
    setEvents(updatedEvents);
    
    // Delete the project
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      autoSchedule: taskData.autoSchedule !== undefined ? taskData.autoSchedule : true,
      locked: taskData.locked !== undefined ? taskData.locked : false,
      createdAt: now,
      updatedAt: now
    };
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    
    // Auto-schedule the new task if autoSchedule is enabled and not locked
    if (newTask.autoSchedule && !newTask.locked && !newTask.scheduledStart && !newTask.scheduledEnd) {
      // Schedule this specific task
      const scheduledTask = scheduleTaskManually(newTask);
      
      return scheduledTask;
    }
    
    return newTask;
  };

  // Helper function to schedule a task manually
  const scheduleTaskManually = (task: Task): Task => {
    // Start scheduling from tomorrow at 9 AM
    let startTime = new Date();
    startTime.setDate(startTime.getDate() + 1);
    startTime.setHours(9, 0, 0, 0);
    
    // Find the latest end time of all scheduled tasks
    const scheduledTasks = tasks.filter(t => 
      !t.completed && 
      t.scheduledEnd && 
      t.scheduledStart
    );
    
    if (scheduledTasks.length > 0) {
      const latestEndTime = new Date(Math.max(
        ...scheduledTasks.map(t => t.scheduledEnd ? t.scheduledEnd.getTime() : 0)
      ));
      
      // Add 30 minutes buffer
      startTime = new Date(latestEndTime.getTime() + 30 * 60 * 1000);
      
      // If it's after 5 PM, move to the next day at 9 AM
      if (startTime.getHours() >= 17) {
        startTime.setDate(startTime.getDate() + 1);
        startTime.setHours(9, 0, 0, 0);
      }
    }
    
    // Calculate end time
    const endTime = new Date(startTime.getTime() + task.estimatedHours * 60 * 60 * 1000);
    
    // Update the task with the schedule
    const updatedTask: Task = {
      ...task,
      scheduledStart: startTime,
      scheduledEnd: endTime,
      updatedAt: new Date()
    };
    
    // Update the task in the tasks array
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    let updatedTasks = [...tasks];
    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
    } else {
      // If the task is not in the array yet (new task), add it
      updatedTasks = [...tasks, updatedTask];
      setTasks(updatedTasks);
    }
    
    // Create an event for the task
    const project = projects.find(p => p.id === task.projectId);
    const newEvent: CalendarEvent = {
      id: uuidv4(),
      title: task.title,
      start: startTime,
      end: endTime,
      color: project?.color,
      taskId: task.id,
      projectId: task.projectId
    };
    
    // Add the event
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    return updatedTask;
  };

  const updateTask = (updatedTask: Task) => {
    const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex === -1) return;
    
    const oldTask = tasks[taskIndex];
    const scheduleChanged = 
      (oldTask.scheduledStart?.getTime() !== updatedTask.scheduledStart?.getTime()) ||
      (oldTask.scheduledEnd?.getTime() !== updatedTask.scheduledEnd?.getTime());
    
    // If the schedule was manually changed, lock the task
    if (scheduleChanged && updatedTask.scheduledStart && updatedTask.scheduledEnd) {
      updatedTask.locked = true;
    }
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTask,
      updatedAt: new Date()
    };
    
    setTasks(updatedTasks);
    
    // Update or create event if task is scheduled
    if (updatedTask.scheduledStart && updatedTask.scheduledEnd) {
      const eventIndex = events.findIndex(event => event.taskId === updatedTask.id);
      const project = projects.find(p => p.id === updatedTask.projectId);
      
      if (eventIndex !== -1) {
        // Update existing event
        const updatedEvents = [...events];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          title: updatedTask.title,
          start: updatedTask.scheduledStart,
          end: updatedTask.scheduledEnd,
          color: project?.color || '#3788d8'
        };
        setEvents(updatedEvents);
      } else {
        // Create new event
        const newEvent = {
          id: uuidv4(),
          title: updatedTask.title,
          start: updatedTask.scheduledStart,
          end: updatedTask.scheduledEnd,
          allDay: false,
          taskId: updatedTask.id,
          projectId: updatedTask.projectId,
          color: project?.color || '#3788d8'
        };
        setEvents([...events, newEvent]);
      }
    }
    
    // If schedule changed and we're not locked, trigger auto-scheduling for other tasks
    if (scheduleChanged && !updatedTask.locked) {
      // Find unscheduled tasks that need to be auto-scheduled
      const tasksToSchedule = tasks.filter(task => 
        task.id !== updatedTask.id && // Don't include the task we just updated
        !task.completed && 
        task.autoSchedule && 
        !task.locked &&
        (!task.scheduledStart || !task.scheduledEnd)
      );
      
      if (tasksToSchedule.length > 0) {
        scheduleTasksAutomatically(tasksToSchedule);
      }
    }
  };

  // Toggle auto-schedule for a task
  const toggleTaskAutoSchedule = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            autoSchedule: !task.autoSchedule,
            updatedAt: new Date() 
          } 
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    // Delete all events associated with this task
    const updatedEvents = events.filter(event => event.taskId !== taskId);
    setEvents(updatedEvents);
    
    // Delete the task
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Schedule a specific task
  const scheduleTask = (taskId: string, start: Date, end: Date, skipAutoSchedule?: boolean) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const project = projects.find(p => p.id === task.projectId);
    
    // Update the task with the new schedule and lock it
    const updatedTask = {
      ...task,
      scheduledStart: start,
      scheduledEnd: end,
      locked: true, // Lock the task when manually scheduled
      updatedAt: new Date()
    };
    
    // Update tasks
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    
    // Create or update the corresponding event
    const existingEventIndex = events.findIndex(e => e.taskId === taskId);
    const newEvent: CalendarEvent = {
      id: existingEventIndex !== -1 ? events[existingEventIndex].id : uuidv4(),
      title: task.title,
      start,
      end,
      color: project?.color,
      taskId,
      projectId: task.projectId
    };
    
    let updatedEvents = [...events];
    if (existingEventIndex !== -1) {
      updatedEvents[existingEventIndex] = newEvent;
    } else {
      updatedEvents = [...updatedEvents, newEvent];
    }
    setEvents(updatedEvents);
    
    // Only trigger auto-scheduling if not called from scheduleTasksAutomatically
    if (!skipAutoSchedule) {
      // Find unscheduled tasks that need to be auto-scheduled
      const tasksToSchedule = tasks.filter(t => 
        t.id !== taskId && // Don't include the task we just scheduled
        !t.completed && 
        t.autoSchedule && 
        !t.locked &&
        (!t.scheduledStart || !t.scheduledEnd)
      );
      
      if (tasksToSchedule.length > 0) {
        scheduleTasksAutomatically(tasksToSchedule);
      }
    }
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, updatedAt: new Date() } 
        : task
    );
    setTasks(updatedTasks);
  };

  // Check if a time slot is available (doesn't overlap with existing events)
  const isTimeSlotAvailable = (start: Date, end: Date): boolean => {
    // Check if the time slot overlaps with any existing events
    for (const event of events) {
      // Check for overlap
      if (
        (start >= event.start && start < event.end) || // Start time is within an existing event
        (end > event.start && end <= event.end) || // End time is within an existing event
        (start <= event.start && end >= event.end) // Time slot completely contains an existing event
      ) {
        return false;
      }
    }
    
    // No overlaps found, the time slot is available
    return true;
  };

  // Toggle task lock status
  const toggleTaskLock = (taskId: string) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const updatedTasks = [...tasks];
    const isLocked = updatedTasks[taskIndex].locked;
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      locked: !isLocked,
      updatedAt: new Date()
    };
    
    setTasks(updatedTasks);
    
    // If we're unlocking a task, trigger auto-scheduling
    if (isLocked) {
      // Find unscheduled tasks that need to be auto-scheduled, including this one if it's unscheduled
      const tasksToSchedule = tasks.filter(task => 
        (task.id === taskId || !task.locked) && // Include the unlocked task and other unlocked tasks
        !task.completed && 
        task.autoSchedule &&
        (!task.scheduledStart || !task.scheduledEnd)
      );
      
      if (tasksToSchedule.length > 0) {
        // Use a separate array to avoid including tasks that might be scheduled during the process
        const tasksToScheduleArray = [...tasksToSchedule];
        scheduleTasksAutomatically(tasksToScheduleArray);
      }
    }
  };

  // Auto-schedule all unscheduled tasks
  const autoScheduleTasks = () => {
    // Get all tasks that should be auto-scheduled (not completed, autoSchedule enabled, and not locked)
    const tasksToSchedule = tasks.filter(task => 
      !task.completed && 
      task.autoSchedule && 
      !task.locked &&
      (!task.scheduledStart || !task.scheduledEnd)
    );
    
    if (tasksToSchedule.length === 0) return;
    
    // Schedule tasks - create a copy of the array to avoid issues with state updates
    const tasksToScheduleArray = [...tasksToSchedule];
    scheduleTasksAutomatically(tasksToScheduleArray);
  };

  // Schedule tasks automatically
  const scheduleTasksAutomatically = (tasksToSchedule: Task[]) => {
    if (tasksToSchedule.length === 0) return;
    
    console.log('Scheduling tasks automatically:', tasksToSchedule.length);
    
    // Sort tasks by priority (highest first) and then by due date (earliest first)
    const sortedTasks = [...tasksToSchedule].sort((a, b) => {
      // First sort by priority (highest first)
      if (a.priority !== b.priority) {
        // Convert priority enum to numeric values for comparison
        const priorityValues = {
          [Priority.URGENT]: 3,
          [Priority.HIGH]: 2,
          [Priority.MEDIUM]: 1,
          [Priority.LOW]: 0
        };
        return priorityValues[b.priority] - priorityValues[a.priority];
      }
      
      // Then sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      return 0;
    });
    
    // Start scheduling from tomorrow at 9 AM if no tasks are scheduled yet
    let lastEndTime = new Date();
    lastEndTime.setHours(9, 0, 0, 0);
    
    // If it's past 9 AM today, start scheduling from tomorrow
    if (lastEndTime < new Date()) {
      lastEndTime.setDate(lastEndTime.getDate() + 1);
    }
    
    // Find the latest end time of all scheduled tasks that are not locked
    const scheduledTasks = tasks.filter(task => 
      !task.completed && 
      task.scheduledEnd && 
      task.scheduledStart
    );
    
    if (scheduledTasks.length > 0) {
      const latestEndTime = new Date(Math.max(
        ...scheduledTasks.map(task => task.scheduledEnd ? task.scheduledEnd.getTime() : 0)
      ));
      
      if (latestEndTime > lastEndTime) {
        lastEndTime = latestEndTime;
      }
    }
    
    // Schedule each task sequentially with a 30-minute gap
    for (const task of sortedTasks) {
      // Add a 30-minute gap between tasks (30 minutes * 60 seconds * 1000 milliseconds)
      const thirtyMinutesInMs = 30 * 60 * 1000;
      lastEndTime = new Date(lastEndTime.getTime() + thirtyMinutesInMs);
      
      // Calculate start and end times
      const startTime = new Date(lastEndTime);
      const estimatedTimeInMs = task.estimatedHours * 60 * 60 * 1000;
      const endTime = new Date(startTime.getTime() + estimatedTimeInMs);
      
      // Ensure we're scheduling during working hours (9 AM - 5 PM)
      const startHour = startTime.getHours();
      if (startHour < 9 || startHour >= 17) {
        // Move to the next day at 9 AM
        startTime.setDate(startTime.getDate() + 1);
        startTime.setHours(9, 0, 0, 0);
        endTime.setTime(startTime.getTime() + estimatedTimeInMs);
      }
      
      // Schedule the task with skipAutoSchedule=true to prevent infinite recursion
      scheduleTask(task.id, startTime, endTime, true);
      
      // Update the last end time
      lastEndTime = endTime;
    }
  };

  const value = {
    projects,
    tasks,
    events,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    completeTask,
    autoScheduleTasks,
    toggleTaskAutoSchedule,
    toggleTaskLock
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}; 