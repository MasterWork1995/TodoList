import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useTodoBoardState } from './useTodoBoardState';
import { reorder as reorderList } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import type { AppState, Column, Task, TaskCreatePayload } from '../types';

type ReorderResult = { startIndex: number; endIndex: number };

const generateId = () => nanoid();

export const useTodoBoard = () => {
  const [state, setState] = useTodoBoardState();

  const updateState = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState(updater(state));
    },
    [state, setState]
  );

  const addColumn = useCallback(() => {
    const maxOrder = state.columns.length
      ? Math.max(...state.columns.map((c) => c.order), -1) + 1
      : 0;
    const col: Column = {
      id: `col-${generateId()}`,
      title: `Column ${state.columns.length + 1}`,
      order: maxOrder,
    };
    updateState((prev) => ({
      ...prev,
      columns: [...prev.columns, col].sort((a, b) => a.order - b.order),
    }));
  }, [state.columns.length, updateState]);

  const deleteColumn = useCallback(
    (columnId: string) => {
      updateState((prev) => ({
        ...prev,
        columns: prev.columns.filter((c) => c.id !== columnId),
        tasks: prev.tasks.filter((t) => t.columnId !== columnId),
      }));
    },
    [updateState]
  );

  const updateColumnTitle = useCallback(
    (columnId: string, title: string) => {
      updateState((prev) => ({
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, title } : c
        ),
      }));
    },
    [updateState]
  );

  const reorderColumns = useCallback(
    (result: ReorderResult) => {
      const reordered = reorderList({
        list: state.columns,
        startIndex: result.startIndex,
        finishIndex: result.endIndex,
      }).map((c, i) => ({ ...c, order: i }));
      updateState((prev) => ({ ...prev, columns: reordered }));
    },
    [state.columns, updateState]
  );

  const addTask = useCallback(
    (columnId: string, payload: TaskCreatePayload | string) => {
      const text = typeof payload === 'string' ? payload : payload.text;
      if (!text?.trim()) return;
      const columnTasks = state.tasks.filter((t) => t.columnId === columnId);
      const maxOrder =
        columnTasks.length > 0
          ? Math.max(...columnTasks.map((t) => t.order), -1) + 1
          : 0;
      const data = typeof payload === 'string' ? { text: payload.trim(), description: '', labels: [] as string[] } : {
        text: payload.text.trim(),
        description: payload.description?.trim() ?? '',
        labels: Array.isArray(payload.labels) ? payload.labels : [],
      };
      const task: Task = {
        id: `task-${generateId()}`,
        columnId,
        text: data.text,
        description: data.description,
        labels: data.labels,
        completed: false,
        order: maxOrder,
      };
      updateState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, task],
      }));
    },
    [state.tasks, updateState]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      }));
    },
    [updateState]
  );

  const deleteTasks = useCallback(
    (taskIds: string[]) => {
      const set = new Set(taskIds);
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => !set.has(t.id)),
      }));
    },
    [updateState]
  );

  const updateTask = useCallback(
    (taskId: string, patch: Partial<Pick<Task, 'text' | 'description' | 'labels' | 'completed'>>) => {
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, ...patch } : t
        ),
      }));
    },
    [updateState]
  );

  const setTasksCompleted = useCallback(
    (taskIds: string[], completed: boolean) => {
      const set = new Set(taskIds);
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          set.has(t.id) ? { ...t, completed } : t
        ),
      }));
    },
    [updateState]
  );

  const moveTasksToColumn = useCallback(
    (taskIds: string[], targetColumnId: string) => {
      const set = new Set(taskIds);
      const targetTasks = state.tasks.filter(
        (t) => t.columnId === targetColumnId && !set.has(t.id)
      );
      const maxOrder =
        targetTasks.length > 0
          ? Math.max(...targetTasks.map((t) => t.order), -1) + 1
          : 0;
      let order = maxOrder;
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => {
          if (!set.has(t.id)) return t;
          return {
            ...t,
            columnId: targetColumnId,
            order: order++,
          };
        }),
      }));
    },
    [state.tasks, updateState]
  );

  const reorderTasks = useCallback(
    (columnId: string, result: ReorderResult) => {
      const columnTasks = state.tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order);
      const reordered = reorderList({
        list: columnTasks,
        startIndex: result.startIndex,
        finishIndex: result.endIndex,
      }).map((t, i) => ({ ...t, order: i }));
      const byId = new Map(reordered.map((t) => [t.id, t]));
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.columnId === columnId && byId.has(t.id)
            ? byId.get(t.id)!
            : t
        ),
      }));
    },
    [state.tasks, updateState]
  );

  const moveTaskToColumn = useCallback(
    (taskId: string, targetColumnId: string) => {
      moveTasksToColumn([taskId], targetColumnId);
    },
    [moveTasksToColumn]
  );

  return {
    state,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    reorderColumns,
    addTask,
    deleteTask,
    deleteTasks,
    updateTask,
    setTasksCompleted,
    moveTasksToColumn,
    moveTaskToColumn,
    reorderTasks,
  };
};
