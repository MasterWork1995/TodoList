import type { AppState } from '../types';

const STORAGE_KEY = 'todolist-app-state';

const defaultState: AppState = {
  columns: [
    { id: 'col-1', title: 'To Do', order: 0 },
    { id: 'col-2', title: 'In Progress', order: 1 },
    { id: 'col-3', title: 'Done', order: 2 },
  ],
  tasks: [],
};

function normalizeTask(t: Record<string, unknown>): AppState['tasks'][0] {
  const task = t as Partial<AppState['tasks'][0]> & Record<string, unknown>;
  return {
    id: typeof task.id === 'string' ? task.id : '',
    columnId: typeof task.columnId === 'string' ? task.columnId : '',
    text: typeof task.text === 'string' ? task.text : '',
    description: typeof task.description === 'string' ? task.description : '',
    labels: Array.isArray(task.labels) ? task.labels.filter((l): l is string => typeof l === 'string') : [],
    completed: Boolean(task.completed),
    order: typeof task.order === 'number' ? task.order : 0,
  };
}

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.columns?.length) parsed.columns = defaultState.columns;
    if (!Array.isArray(parsed.tasks)) parsed.tasks = [];
    parsed.tasks = parsed.tasks.map((t) => normalizeTask(t as Record<string, unknown>));
    return parsed;
  } catch {
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    //
  }
};
