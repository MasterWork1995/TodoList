import { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import type { Column as ColumnType, Task, TaskCreatePayload } from '../types';

const Column = lazy(() =>
  import('./Column').then((m) => ({ default: m.Column }))
);

type BoardProps = {
  columns: ColumnType[];
  columnTasksList: (columnId: string) => Task[];
  getHighlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: string, payload: TaskCreatePayload | string) => void;
  onReorderTasks: (columnId: string, start: number, end: number) => void;
  onSelectAllInColumn: (tasks: Task[]) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onRequestDeleteColumn: (id: string, title: string) => void;
  existingLabels: string[];
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;
  onColumnReorder: (start: number, end: number) => void;
  draggingColumnIndex: number | null;
  setColumnDragging: (index: number) => (v: boolean) => void;
  onAddColumn: () => void;
};

function BoardInner({
  columns,
  columnTasksList,
  getHighlightChunks,
  isSelected,
  onToggleSelect,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onReorderTasks,
  onSelectAllInColumn,
  onUpdateColumnTitle,
  onRequestDeleteColumn,
  existingLabels,
  draggingTaskId,
  setDraggingTaskId,
  onColumnReorder,
  draggingColumnIndex,
  setColumnDragging,
  onAddColumn,
}: BoardProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col container mx-auto w-full max-w-none px-2 py-3 sm:px-4 sm:py-6 md:px-6">
      <motion.div
        className="flex flex-1 min-h-0 items-stretch gap-3 overflow-x-auto overflow-y-hidden pb-4 pt-1 sm:gap-5 sm:pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Suspense
          fallback={
            <div className="h-[320px] min-w-[280px] shrink-0 animate-pulse rounded-2xl bg-surface-200/60" />
          }
        >
          {columns.map((column, idx) => (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasksList(column.id)}
              getHighlightChunks={getHighlightChunks}
              isSelected={isSelected}
              onToggleSelect={onToggleSelect}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAddTask={onAddTask}
              onReorderTasks={onReorderTasks}
              onSelectAllInColumn={onSelectAllInColumn}
              onUpdateColumnTitle={onUpdateColumnTitle}
              onDeleteColumn={onRequestDeleteColumn}
              existingLabels={existingLabels}
              draggingTaskId={draggingTaskId}
              setDraggingTaskId={setDraggingTaskId}
              columnIndex={idx}
              onColumnReorder={onColumnReorder}
              isColumnDragging={draggingColumnIndex === idx}
              setColumnDragging={setColumnDragging(idx)}
            />
          ))}
        </Suspense>
        <Button
          variant="ghost"
          onClick={onAddColumn}
          className="flex h-fit min-h-[120px] shrink-0 cursor-pointer items-center gap-2 self-stretch rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50/50 px-3 py-4 text-surface-500 hover:border-accent hover:bg-accent/5 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent sm:min-h-0 sm:self-start sm:px-6 sm:py-5 disabled:cursor-not-allowed"
          aria-label="Add column"
        >
          <i className="fa-solid fa-plus text-lg" aria-hidden />
          <span className="font-medium">Add column</span>
        </Button>
      </motion.div>
    </main>
  );
}

export const Board = memo(BoardInner);
