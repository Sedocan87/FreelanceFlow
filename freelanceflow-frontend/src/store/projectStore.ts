import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useClientStore from './clientStore';

export interface Task {
  id: string;
  description: string;
  hours: number;
  completed: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  tasks: Task[];
  expenses: Expense[]; // New property
  teamMembers?: string[]; // Array of team member IDs
  createdBy: string; // User ID of project creator
  lastModifiedBy: string; // User ID of last person to modify the project
  createdAt: Date;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addExpense: (projectId: string, expense: Omit<Expense, 'id'>) => void;
  updateExpense: (projectId: string, expense: Expense) => void;
  deleteExpense: (projectId: string, expenseId: string) => void;
}

// Get the initial clients from the clientStore
const initialClients = useClientStore.getState().clients;

const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    // Some initial dummy data linked to actual clients
    {
      id: uuidv4(),
      name: 'Website Redesign',
      description: 'A complete overhaul of the main website.',
      clientId: initialClients.length > 0 ? initialClients[0].id : '',
      tasks: [
        { id: uuidv4(), description: 'Design mockups', hours: 20, completed: true },
        { id: uuidv4(), description: 'Develop homepage', hours: 35, completed: false },
      ],
      expenses: [],
      teamMembers: [],
      createdBy: 'system',
      lastModifiedBy: 'system',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Mobile App Development',
      description: 'A new mobile app for iOS and Android.',
      clientId: initialClients.length > 1 ? initialClients[1].id : '',
      tasks: [],
      expenses: [],
      teamMembers: [],
      createdBy: 'system',
      lastModifiedBy: 'system',
      createdAt: new Date()
    },
  ],
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, { ...project, id: uuidv4(), tasks: [] }],
    })),
  updateProject: (updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === updatedProject.id ? { ...project, ...updatedProject } : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  addTask: (projectId, task) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, { ...task, id: uuidv4() }] }
          : project
      ),
    })),
  updateTask: (projectId, updatedTask) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: project.tasks.map(task => task.id === updatedTask.id ? updatedTask : task) }
          : project
      ),
    })),
  deleteTask: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) }
          : project
      ),
    })),
  addExpense: (projectId, expense) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, expenses: [...project.expenses, { ...expense, id: uuidv4() }] }
          : project
      ),
    })),
  updateExpense: (projectId, updatedExpense) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, expenses: project.expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp) }
          : project
      ),
    })),
  deleteExpense: (projectId, expenseId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, expenses: project.expenses.filter((exp) => exp.id !== expenseId) }
          : project
      ),
    })),
}));

export default useProjectStore;
