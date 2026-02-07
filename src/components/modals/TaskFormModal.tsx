import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CreatableSelect from 'react-select/creatable';
import { Input, Button } from '../../ui';
import { DropdownIndicator, ClearIndicator, MultiValueRemove } from '../../ui/reactSelectFaComponents';
import type { Task, TaskCreatePayload } from '../../types';

type Option = { value: string; label: string };

type TaskFormModalProps = {
  open: boolean;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (payload: TaskCreatePayload) => void;
  taskToEdit?: Task | null;
  onUpdate?: (taskId: string, payload: TaskCreatePayload) => void;
  existingLabels?: string[];
};

const labelSelectStyles = {
  control: (base: object) => ({
    ...base,
    minHeight: 40,
    borderRadius: '0.75rem',
    borderColor: 'var(--color-surface-200, #e2e8f0)',
    '&:hover': { borderColor: 'var(--color-surface-300, #cbd5e1)' },
  }),
  menu: (base: object) => ({
    ...base,
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }),
  menuPortal: (base: object) => ({
    ...base,
    zIndex: 9999,
  }),
};

export function TaskFormModal({
  open,
  columnTitle,
  onClose,
  onSubmit,
  taskToEdit = null,
  onUpdate,
  existingLabels = [],
}: TaskFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(taskToEdit);

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setName(taskToEdit.text);
        setDescription(taskToEdit.description ?? '');
        setLabels(Array.isArray(taskToEdit.labels) ? [...taskToEdit.labels] : []);
      } else {
        setName('');
        setDescription('');
        setLabels([]);
      }
      requestAnimationFrame(() => nameInputRef.current?.focus());
    }
  }, [open, taskToEdit]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const labelOptions: Option[] = [...new Set([...existingLabels, ...labels])]
    .sort((a, b) => a.localeCompare(b))
    .map((l) => ({ value: l, label: l }));

  const labelValue: Option[] = labels.map((l) => ({ value: l, label: l }));

  const handleLabelsChange = (selected: readonly Option[] | null) => {
    setLabels(selected ? selected.map((o) => o.value) : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const payload: TaskCreatePayload = {
      text: trimmed,
      description: description.trim() || undefined,
      labels: labels.length > 0 ? labels : undefined,
    };
    if (isEditMode && taskToEdit && onUpdate) {
      onUpdate(taskToEdit.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] grid grid-cols-1 grid-rows-1 items-center justify-items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <button
          type="button"
          className="col-start-1 row-start-1 min-h-full min-w-full cursor-pointer bg-surface-900/50 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="col-start-1 row-start-1 z-10 w-full max-w-md rounded-2xl border-2 border-accent bg-white shadow-xl ring-2 ring-accent/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 rounded-t-2xl border-b border-accent/30 bg-accent/10 px-6 py-4">
            <div className="min-w-0">
              <h2
                id="task-form-title"
                className="text-lg font-semibold text-surface-900"
              >
                {isEditMode ? 'Edit task' : 'New task'}
              </h2>
              <p className="mt-0.5 text-sm text-surface-600">
                {isEditMode ? columnTitle : `Add to ${columnTitle}`}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex shrink-0 rounded-lg p-2 text-surface-600 transition hover:bg-accent/20 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg" aria-hidden />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mt-4 space-y-4">
              <Input
                ref={nameInputRef}
                label="Title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task name"
                required
                className="cursor-text"
                aria-label="Task title"
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-800 outline-none transition placeholder:text-surface-400 focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-text disabled:cursor-not-allowed"
                  aria-label="Task description"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Labels
                </label>
                <CreatableSelect
                  isMulti
                  options={labelOptions}
                  value={labelValue}
                  onChange={handleLabelsChange}
                  onCreateOption={(inputValue) => {
                    const v = inputValue.trim();
                    if (v && !labels.includes(v)) setLabels((prev) => [...prev, v]);
                  }}
                  placeholder="Select or create labels..."
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                  menuPosition="fixed"
                  styles={labelSelectStyles}
                  classNamePrefix="react-select"
                  aria-label="Labels"
                  components={{
                    DropdownIndicator,
                    ClearIndicator,
                    MultiValueRemove,
                  } as unknown as Record<string, React.ComponentType>}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                {isEditMode ? 'Save' : 'Add task'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
