import { memo } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '../ui';
import type { Task } from '../types';

type TaskItemProps = {
  task: Task;
  isSelected: boolean;
  onCardClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  highlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  cardRef: (el: HTMLElement | null) => void;
  isDragging?: boolean;
};

function TaskItemInner({
  task,
  isSelected,
  onCardClick,
  onEdit,
  onDelete,
  highlightChunks,
  cardRef,
  isDragging = false,
}: TaskItemProps) {
  const chunks = highlightChunks(task.text);
  const descriptionTrimmed = task.description?.trim();
  const showDescription = Boolean(descriptionTrimmed);
  const hasLabels = Array.isArray(task.labels) && task.labels.length > 0;
  const isCompact = !showDescription && !hasLabels;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{
        opacity: isDragging ? 0.6 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`group relative select-none rounded-2xl border bg-white shadow-sm transition-all cursor-grab active:cursor-grabbing touch-none ${
        isSelected
          ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
          : 'border-surface-200/80 hover:border-surface-300 hover:shadow-md'
      }`}
      data-task-id={task.id}
    >
      <div className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onCardClick();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCardClick();
            }
          }}
          className="min-w-0 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:rounded-xl cursor-pointer rounded-xl"
          aria-label={isSelected ? 'Deselect task' : 'Select task'}
        >
          <h3 className="text-base font-semibold leading-snug text-surface-900">
            {chunks.map((chunk, i) =>
              chunk.type === 'match' ? (
                <mark
                  key={i}
                  className="rounded bg-accent/20 px-0.5 font-semibold text-accent"
                >
                  {chunk.value}
                </mark>
              ) : (
                <span key={i}>{chunk.value}</span>
              )
            )}
          </h3>

          {showDescription && (
            <p
              className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-surface-500"
              title={descriptionTrimmed}
            >
              {descriptionTrimmed}
            </p>
          )}

          {hasLabels && (
            <div className="mt-3 flex flex-wrap gap-2">
              {task.labels.slice(0, 6).map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {label}
                </span>
              ))}
              {task.labels.length > 6 && (
                <span className="text-xs text-surface-400 self-center">
                  +{task.labels.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className={`absolute right-2 top-2 flex opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${
            isCompact ? 'flex-row gap-0.5' : 'flex-col gap-1 top-3 right-3'
          }`}
        >
          <Tooltip content="Edit task" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label="Edit task"
              className="rounded-md p-1.5 text-surface-500 transition hover:bg-surface-100 hover:text-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <i className="fa-solid fa-pen text-xs" aria-hidden />
            </button>
          </Tooltip>
          <Tooltip content="Delete task" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete task"
              className="rounded-md p-1.5 text-surface-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <i className="fa-solid fa-trash-can text-xs" aria-hidden />
            </button>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}

export const TaskItem = memo(TaskItemInner);
