import { useCallback } from 'react';
import type { TaskCreatePayload } from '../types';
import type { useTodoBoard } from './useTodoBoard';
import type { useToast } from '../context/ToastContext';

type Board = ReturnType<typeof useTodoBoard>;
type Toast = ReturnType<typeof useToast>;

export const useBoardActions = (board: Board, toast: Toast) => {
  const deleteTask = useCallback(
    (id: string) => {
      board.deleteTask(id);
      toast.toast('Task removed', 'success');
    },
    [board, toast]
  );

  const addTask = useCallback(
    (columnId: string, payload: TaskCreatePayload | string) => {
      board.addTask(columnId, payload);
      toast.toast('Task added', 'success');
    },
    [board, toast]
  );

  const reorderTasks = useCallback(
    (columnId: string, start: number, end: number) => {
      board.reorderTasks(columnId, { startIndex: start, endIndex: end });
    },
    [board]
  );

  const reorderColumns = useCallback(
    (start: number, end: number) => {
      board.reorderColumns({ startIndex: start, endIndex: end });
    },
    [board]
  );

  const addColumn = useCallback(() => {
    board.addColumn();
    toast.toast('Column added', 'success');
  }, [board, toast]);

  return {
    deleteTask,
    addTask,
    reorderTasks,
    reorderColumns,
    addColumn,
  };
};
