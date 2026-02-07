import { useState, useCallback } from 'react';
import type { Task, TaskCreatePayload } from '../types';
import type { useTodoBoard } from './useTodoBoard';
import type { useSelection } from './useSelection';
import type { useToast } from '../context/ToastContext';

type Board = ReturnType<typeof useTodoBoard>;
type Selection = ReturnType<typeof useSelection>;
type Toast = ReturnType<typeof useToast>;

export function useAppModals(
  board: Board,
  toast: Toast,
  selection: Selection
) {
  const [columnToDelete, setColumnToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [pendingBulkDeleteIds, setPendingBulkDeleteIds] = useState<string[] | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const requestDeleteColumn = useCallback((id: string, title: string) => {
    setColumnToDelete({ id, title });
  }, []);

  const cancelColumnDelete = useCallback(() => {
    setColumnToDelete(null);
  }, []);

  const confirmColumnDelete = useCallback(() => {
    if (columnToDelete) {
      board.deleteColumn(columnToDelete.id);
      toast.toast(`Column "${columnToDelete.title}" deleted`, 'success');
      setColumnToDelete(null);
    }
  }, [columnToDelete, board, toast]);

  const requestBulkDelete = useCallback((ids: string[]) => {
    setPendingBulkDeleteIds(ids);
  }, []);

  const cancelBulkDelete = useCallback(() => {
    setPendingBulkDeleteIds(null);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    if (pendingBulkDeleteIds && pendingBulkDeleteIds.length > 0) {
      board.deleteTasks(pendingBulkDeleteIds);
      selection.clearSelection();
      toast.toast(
        pendingBulkDeleteIds.length === 1
          ? 'Task removed'
          : `${pendingBulkDeleteIds.length} tasks removed`,
        'success'
      );
    }
    setPendingBulkDeleteIds(null);
  }, [pendingBulkDeleteIds, board, selection, toast]);

  const openEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const closeEditTask = useCallback(() => {
    setEditingTask(null);
  }, []);

  const updateTaskFromModal = useCallback(
    (taskId: string, payload: TaskCreatePayload) => {
      board.updateTask(taskId, {
        text: payload.text,
        description: payload.description ?? '',
        labels: payload.labels ?? [],
      });
      toast.toast('Task updated', 'success');
      setEditingTask(null);
    },
    [board, toast]
  );

  return {
    columnToDelete,
    requestDeleteColumn,
    cancelColumnDelete,
    confirmColumnDelete,
    pendingBulkDeleteIds,
    requestBulkDelete,
    cancelBulkDelete,
    confirmBulkDelete,
    editingTask,
    openEditTask,
    closeEditTask,
    updateTaskFromModal,
  };
}
