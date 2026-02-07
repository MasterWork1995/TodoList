import { useState, useCallback } from 'react';
import type { Task } from '../types';

type UseSelectionReturn = {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  toggleAll: (tasks: Task[]) => void;
  selectAll: (tasks: Task[]) => void;
  clearSelection: () => void;
  setSelectedIds: (ids: Set<string>) => void;
};

export const useSelection = (): UseSelectionReturn => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((tasks: Task[]) => {
    setSelectedIds((prev) => {
      const taskIds = new Set(tasks.map((t) => t.id));
      const allSelected = tasks.length > 0 && tasks.every((t) => prev.has(t.id));
      if (allSelected) return new Set<string>();
      return taskIds;
    });
  }, []);

  const selectAll = (tasks: Task[]) => {
    setSelectedIds(new Set(tasks.map((t) => t.id)));
  };

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds,
    isSelected,
    toggle,
    toggleAll,
    selectAll,
    clearSelection,
    setSelectedIds,
  };
};
