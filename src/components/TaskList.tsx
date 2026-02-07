import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TaskItem } from './TaskItem';
import type { Task } from '../types';

type TaskListProps = {
  columnId: string;
  tasks: Task[];
  getHighlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  isSelected: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDelete: (id: string) => void;
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;
};

export const TaskList = ({
  columnId,
  tasks,
  getHighlightChunks,
  isSelected,
  onToggleSelect,
  onEditTask,
  onDelete,
  draggingTaskId,
  setDraggingTaskId,
}: TaskListProps) => {
  return (
    <motion.div
      layout
      className="flex min-h-0 flex-col gap-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            index={index}
            columnId={columnId}
            getHighlightChunks={getHighlightChunks}
            isSelected={isSelected(task.id)}
            onToggleSelect={() => onToggleSelect(task.id)}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDelete(task.id)}
            isDragging={draggingTaskId === task.id}
            setDraggingTaskId={setDraggingTaskId}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

type TaskListItemProps = {
  task: Task;
  index: number;
  columnId: string;
  getHighlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging: boolean;
  setDraggingTaskId: (id: string | null) => void;
};

const TaskListItem = ({
  task,
  index,
  columnId,
  getHighlightChunks,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  isDragging,
  setDraggingTaskId,
}: TaskListItemProps) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const justDraggedRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    return draggable({
      element: card,
      getInitialData: () => ({
        type: 'task',
        taskId: task.id,
        columnId,
        index,
      }),
      onDragStart: () => {
        justDraggedRef.current = true;
        setDraggingTaskId(task.id);
      },
      onDrop: () => {
        setDraggingTaskId(null);
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 0);
      },
    });
  }, [task.id, columnId, index, setDraggingTaskId]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    return dropTargetForElements({
      element: card,
      getData: () => ({ type: 'task', columnId, index }),
      canDrop: ({ source }) => {
        if (source.data.type !== 'task') return false;
        const d = source.data as { type: string; columnId: string; index: number };
        return d.columnId === columnId && d.index !== index;
      },
    });
  }, [columnId, index]);

  const handleCardClick = () => {
    if (!justDraggedRef.current) onToggleSelect();
  };

  return (
    <TaskItem
      task={task}
      isSelected={isSelected}
      onCardClick={handleCardClick}
      onEdit={onEdit}
      onDelete={onDelete}
      highlightChunks={getHighlightChunks}
      cardRef={(el) => {
        (cardRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      isDragging={isDragging}
    />
  );
};
