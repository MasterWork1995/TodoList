export type Task = {
  id: string;
  columnId: string;
  text: string;
  description: string;
  labels: string[];
  completed: boolean;
  order: number;
};

export type TaskCreatePayload = {
  text: string;
  description?: string;
  labels?: string[];
};

export type Column = {
  id: string;
  title: string;
  order: number;
};

export type TaskFilter = 'all';

export type AppState = {
  columns: Column[];
  tasks: Task[];
};
