import { Project, Task, Priority, CalendarEvent } from '../types';
import { addDays, startOfDay, setHours } from 'date-fns';

// Helper function to create dates relative to today
const today = new Date();
const getDate = (dayOffset: number, hours: number = 9) => {
  const date = addDays(today, dayOffset);
  return setHours(startOfDay(date), hours);
};

// Sample projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    priority: Priority.HIGH,
    color: '#3f51b5',
    tasks: [],
    createdAt: getDate(-10),
    updatedAt: getDate(-10)
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Develop a new mobile app for iOS and Android platforms',
    priority: Priority.URGENT,
    color: '#f44336',
    tasks: [],
    createdAt: getDate(-7),
    updatedAt: getDate(-7)
  },
  {
    id: 'project-3',
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    priority: Priority.MEDIUM,
    color: '#4caf50',
    tasks: [],
    createdAt: getDate(-5),
    updatedAt: getDate(-5)
  },
  {
    id: 'project-4',
    title: 'Research Project',
    description: 'Conduct market research for new product line',
    priority: Priority.LOW,
    color: '#ff9800',
    tasks: [],
    createdAt: getDate(-3),
    updatedAt: getDate(-3)
  }
];

// Sample tasks
export const mockTasks: Task[] = [
  // Website Redesign Tasks
  {
    id: 'task-1',
    title: 'Create wireframes',
    description: 'Design wireframes for all main pages',
    priority: Priority.HIGH,
    projectId: 'project-1',
    estimatedHours: 4,
    completed: true,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(2),
    scheduledStart: getDate(-5, 10),
    scheduledEnd: getDate(-5, 14),
    createdAt: getDate(-10),
    updatedAt: getDate(-10)
  },
  {
    id: 'task-2',
    title: 'Design mockups',
    description: 'Create high-fidelity mockups based on wireframes',
    priority: Priority.HIGH,
    projectId: 'project-1',
    estimatedHours: 6,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(5),
    scheduledStart: getDate(1, 9),
    scheduledEnd: getDate(1, 15),
    createdAt: getDate(-9),
    updatedAt: getDate(-9)
  },
  {
    id: 'task-3',
    title: 'Frontend implementation',
    description: 'Implement the frontend using React',
    priority: Priority.MEDIUM,
    projectId: 'project-1',
    estimatedHours: 8,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(10),
    createdAt: getDate(-8),
    updatedAt: getDate(-8)
  },
  
  // Mobile App Development Tasks
  {
    id: 'task-4',
    title: 'App architecture design',
    description: 'Design the architecture for the mobile app',
    priority: Priority.URGENT,
    projectId: 'project-2',
    estimatedHours: 3,
    completed: true,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(-1),
    scheduledStart: getDate(-3, 13),
    scheduledEnd: getDate(-3, 16),
    createdAt: getDate(-7),
    updatedAt: getDate(-7)
  },
  {
    id: 'task-5',
    title: 'UI/UX design',
    description: 'Design the user interface and experience',
    priority: Priority.HIGH,
    projectId: 'project-2',
    estimatedHours: 5,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(3),
    scheduledStart: getDate(0, 10),
    scheduledEnd: getDate(0, 15),
    createdAt: getDate(-6),
    updatedAt: getDate(-6)
  },
  {
    id: 'task-6',
    title: 'iOS development',
    description: 'Develop the iOS version of the app',
    priority: Priority.MEDIUM,
    projectId: 'project-2',
    estimatedHours: 10,
    completed: false,
    autoSchedule: false,
    locked: false,
    dueDate: getDate(15),
    createdAt: getDate(-5),
    updatedAt: getDate(-5)
  },
  {
    id: 'task-7',
    title: 'Android development',
    description: 'Develop the Android version of the app',
    priority: Priority.MEDIUM,
    projectId: 'project-2',
    estimatedHours: 10,
    completed: false,
    autoSchedule: false,
    locked: false,
    dueDate: getDate(15),
    createdAt: getDate(-5),
    updatedAt: getDate(-5)
  },
  
  // Marketing Campaign Tasks
  {
    id: 'task-8',
    title: 'Campaign strategy',
    description: 'Develop the overall marketing campaign strategy',
    priority: Priority.HIGH,
    projectId: 'project-3',
    estimatedHours: 4,
    completed: true,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(-2),
    scheduledStart: getDate(-4, 9),
    scheduledEnd: getDate(-4, 13),
    createdAt: getDate(-5),
    updatedAt: getDate(-5)
  },
  {
    id: 'task-9',
    title: 'Content creation',
    description: 'Create content for social media, email, and website',
    priority: Priority.MEDIUM,
    projectId: 'project-3',
    estimatedHours: 6,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(4),
    createdAt: getDate(-4),
    updatedAt: getDate(-4)
  },
  {
    id: 'task-10',
    title: 'Campaign launch',
    description: 'Launch the marketing campaign across all channels',
    priority: Priority.URGENT,
    projectId: 'project-3',
    estimatedHours: 2,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(7),
    createdAt: getDate(-3),
    updatedAt: getDate(-3)
  },
  
  // Research Project Tasks
  {
    id: 'task-11',
    title: 'Survey design',
    description: 'Design customer survey questions',
    priority: Priority.MEDIUM,
    projectId: 'project-4',
    estimatedHours: 3,
    completed: true,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(-1),
    scheduledStart: getDate(-2, 14),
    scheduledEnd: getDate(-2, 17),
    createdAt: getDate(-3),
    updatedAt: getDate(-3)
  },
  {
    id: 'task-12',
    title: 'Data collection',
    description: 'Collect survey responses and market data',
    priority: Priority.MEDIUM,
    projectId: 'project-4',
    estimatedHours: 5,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(6),
    scheduledStart: getDate(2, 9),
    scheduledEnd: getDate(2, 14),
    createdAt: getDate(-2),
    updatedAt: getDate(-2)
  },
  {
    id: 'task-13',
    title: 'Data analysis',
    description: 'Analyze collected data and prepare insights',
    priority: Priority.HIGH,
    projectId: 'project-4',
    estimatedHours: 4,
    completed: false,
    autoSchedule: true,
    locked: false,
    dueDate: getDate(10),
    createdAt: getDate(-1),
    updatedAt: getDate(-1)
  },
  {
    id: 'task-14',
    title: 'Final report',
    description: 'Prepare and present final research report',
    priority: Priority.HIGH,
    projectId: 'project-4',
    estimatedHours: 6,
    completed: false,
    autoSchedule: false,
    locked: false,
    dueDate: getDate(14),
    createdAt: getDate(-1),
    updatedAt: getDate(-1)
  }
];

// Generate calendar events from scheduled tasks
export const mockEvents: CalendarEvent[] = mockTasks
  .filter(task => task.scheduledStart && task.scheduledEnd)
  .map(task => {
    const project = mockProjects.find(p => p.id === task.projectId);
    return {
      id: `event-${task.id}`,
      title: task.title,
      start: task.scheduledStart!,
      end: task.scheduledEnd!,
      color: project?.color,
      taskId: task.id,
      projectId: task.projectId
    };
  }); 

// Debug logging
console.log('Mock data initialized:', {
  projects: mockProjects.length,
  tasks: mockTasks.length,
  events: mockEvents.length
});

// Function to clear localStorage and reset to mock data
export const resetToMockData = () => {
  // Safely clear localStorage
  try {
    // Clear all localStorage
    localStorage.clear();
    
    // Log the action
    console.log('Local storage cleared. Mock data will be loaded on next app start.');
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
  
  // Force reload the page to reinitialize with mock data
  window.location.reload();
};

// Function to update mock data with current state
export const updateMockData = (projects: Project[], tasks: Task[], events: CalendarEvent[]) => {
  // Update the mock data arrays
  mockProjects.length = 0;
  mockTasks.length = 0;
  mockEvents.length = 0;
  
  // Add current data to mock arrays
  mockProjects.push(...projects);
  mockTasks.push(...tasks);
  mockEvents.push(...events);
  
  console.log('Mock data updated:', {
    projects: mockProjects.length,
    tasks: mockTasks.length,
    events: mockEvents.length
  });
  
  // Safely save to localStorage
  try {
    // Save to localStorage to persist changes
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('events', JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}; 