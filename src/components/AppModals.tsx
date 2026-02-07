import { memo } from 'react';
import { ConfirmDialog } from '../ui';
import { TaskFormModal } from './modals/TaskFormModal';
import type { Task, TaskCreatePayload, Column } from '../types';

type AppModalsProps = {
  columnToDelete: { id: string; title: string } | null;
  onConfirmColumnDelete: () => void;
  onCancelColumnDelete: () => void;
  openBulkDelete: boolean;
  bulkDeleteCount: number;
  onConfirmBulkDelete: () => void;
  onCancelBulkDelete: () => void;
  editingTask: Task | null;
  columns: Column[];
  onCloseEditTask: () => void;
  onUpdateTask: (taskId: string, payload: TaskCreatePayload) => void;
  existingLabels: string[];
};

function AppModalsInner({
  columnToDelete,
  onConfirmColumnDelete,
  onCancelColumnDelete,
  openBulkDelete,
  bulkDeleteCount,
  onConfirmBulkDelete,
  onCancelBulkDelete,
  editingTask,
  columns,
  onCloseEditTask,
  onUpdateTask,
  existingLabels,
}: AppModalsProps) {
  return (
    <>
      <ConfirmDialog
        open={columnToDelete !== null}
        title="Delete column?"
        description={
          columnToDelete
            ? `"${columnToDelete.title}" and all its tasks will be removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={onConfirmColumnDelete}
        onCancel={onCancelColumnDelete}
      />

      <ConfirmDialog
        open={openBulkDelete}
        title="Delete selected tasks?"
        description={`${bulkDeleteCount} task(s) will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={onConfirmBulkDelete}
        onCancel={onCancelBulkDelete}
      />

      <TaskFormModal
        open={editingTask !== null}
        columnTitle={
          editingTask
            ? columns.find((c) => c.id === editingTask.columnId)?.title ?? 'Task'
            : ''
        }
        onClose={onCloseEditTask}
        onSubmit={() => {}}
        taskToEdit={editingTask}
        onUpdate={onUpdateTask}
        existingLabels={existingLabels}
      />
    </>
  );
}

export const AppModals = memo(AppModalsInner);
