import { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TaskList } from '../TaskList';
import { Button, Tooltip } from '../../ui';
import { ColumnHeader } from './ColumnHeader';
import { ColumnEmptyState } from './ColumnEmptyState';
import { TaskFormModal } from '../modals/TaskFormModal';
import type { Column as ColumnType, Task, TaskCreatePayload } from '../../types';

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
  getHighlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: string, payload: TaskCreatePayload | string) => void;
  onReorderTasks: (columnId: string, startIndex: number, endIndex: number) => void;
  onSelectAllInColumn: (tasks: Task[]) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string, title: string) => void;
  existingLabels: string[];
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;
  columnIndex: number;
  onColumnReorder?: (startIndex: number, endIndex: number) => void;
  isColumnDragging?: boolean;
  setColumnDragging?: (v: boolean) => void;
};

function ColumnInner({
  column,
  tasks,
  getHighlightChunks,
  isSelected,
  onToggleSelect,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onSelectAllInColumn,
  onUpdateColumnTitle,
  onDeleteColumn,
  existingLabels,
  draggingTaskId,
  setDraggingTaskId,
  columnIndex,
  onColumnReorder,
  isColumnDragging = false,
  setColumnDragging,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleValue(column.title);
  }, [column.title]);

  const handleTitleSubmit = () => {
    const t = titleValue.trim();
    if (t) onUpdateColumnTitle(column.id, t);
    else setTitleValue(column.title);
    setIsEditingTitle(false);
  };

  useEffect(() => {
    const el = columnRef.current;
    if (!el || onColumnReorder == null) return;
    return draggable({
      element: el,
      dragHandle: headerRef.current ?? undefined,
      getInitialData: () => ({ type: 'column', columnId: column.id, index: columnIndex }),
      onDragStart: () => setColumnDragging?.(true),
      onDrop: () => setColumnDragging?.(false),
    });
  }, [column.id, columnIndex, onColumnReorder, setColumnDragging]);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    return dropTargetForElements({
      element: el,
      getData: () => ({ type: 'column', columnId: column.id, index: columnIndex }),
      canDrop: ({ source }) => {
        if (source.data.type === 'task') {
          const d = source.data as { columnId: string };
          return d.columnId !== column.id;
        }
        if (source.data.type === 'column') {
          const d = source.data as { index: number };
          return d.index !== columnIndex;
        }
        return false;
      },
    });
  }, [column.id, columnIndex]);

  return (
    <>
      <motion.div
        ref={columnRef}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex h-full min-h-0 min-w-[260px] max-w-[360px] shrink-0 flex-col overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-card transition sm:min-w-[280px] sm:w-80 ${
          isColumnDragging ? 'opacity-60 ring-2 ring-accent/20' : ''
        }`}
        data-column-id={column.id}
      >
        <ColumnHeader
          headerRef={(el) => {
            (headerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          title={column.title}
          isEditing={isEditingTitle}
          titleValue={titleValue}
          onTitleChange={setTitleValue}
          onTitleSubmit={handleTitleSubmit}
          onTitleEditStart={() => setIsEditingTitle(true)}
          onTitleEditCancel={() => {
            setTitleValue(column.title);
            setIsEditingTitle(false);
          }}
          onSelectAll={() => onSelectAllInColumn(tasks)}
          onDeleteColumn={() => onDeleteColumn(column.id, column.title)}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
          <Tooltip content="Create task with title, description and labels" position="bottom">
            <Button
              variant="secondary"
              size="md"
              icon="fa-plus"
              onClick={() => setCreateModalOpen(true)}
              className="w-full shrink-0 cursor-pointer touch-manipulation"
              aria-label="Add task"
            >
              Add task
            </Button>
          </Tooltip>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-2">
            {tasks.length > 0 ? (
              <TaskList
                columnId={column.id}
                tasks={tasks}
                getHighlightChunks={getHighlightChunks}
                isSelected={isSelected}
                onToggleSelect={onToggleSelect}
                onEditTask={onEditTask}
                onDelete={onDeleteTask}
                draggingTaskId={draggingTaskId}
                setDraggingTaskId={setDraggingTaskId}
              />
            ) : (
              <ColumnEmptyState />
            )}
          </div>
        </div>
      </motion.div>

      <TaskFormModal
        open={createModalOpen}
        columnTitle={column.title}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={(payload) => {
          onAddTask(column.id, payload);
          setCreateModalOpen(false);
        }}
        existingLabels={existingLabels}
      />
    </>
  );
}

export const Column = memo(ColumnInner);
