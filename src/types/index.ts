export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  projectId: string;
  estimatedHours: number;
  completed: boolean;
  autoSchedule: boolean;
  locked: boolean;
  dueDate?: Date;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tasks: Task[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  taskId?: string;
  projectId?: string;
} 