import { useState } from 'react';
import Select from 'react-select';
import { Button, Tooltip } from '../ui';
import type { Column } from '../types';

type BulkActionsBarProps = {
  selectedCount: number;
  columns: Column[];
  onRequestDeleteSelected: () => void;
  onMoveToColumn: (columnId: string) => void;
  onClearSelection: () => void;
};

const selectStyles = {
  control: (base: object) => ({
    ...base,
    minHeight: 36,
    borderRadius: '0.5rem',
    borderColor: 'var(--color-surface-200, #e2e8f0)',
    '&:hover': { borderColor: 'var(--color-surface-300, #cbd5e1)' },
  }),
  menu: (base: object) => ({
    ...base,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }),
  menuPortal: (base: object) => ({
    ...base,
    zIndex: 9999,
  }),
};

export const BulkActionsBar = ({
  selectedCount,
  columns,
  onRequestDeleteSelected,
  onMoveToColumn,
  onClearSelection,
}: BulkActionsBarProps) => {
  const [moveValue, setMoveValue] = useState<{ value: string; label: string } | null>(null);

  const hasSelection = selectedCount > 0;
  const options = columns.map((c) => ({ value: c.id, label: c.title }));

  const handleMoveChange = (option: { value: string; label: string } | null) => {
    if (option) {
      onMoveToColumn(option.value);
      setMoveValue(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-200/80 bg-surface-50/50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
      <span className="flex min-w-[7rem] items-center gap-2 text-sm font-medium text-surface-600">
        <i className="fa-solid fa-list-check shrink-0 text-surface-400" aria-hidden />
        <span>{selectedCount} selected</span>
      </span>
      <Tooltip content={hasSelection ? 'Delete selected tasks' : 'Select tasks to delete'} position="bottom">
        <span className="inline-flex">
          <Button
            variant="danger"
            size="sm"
            icon="fa-trash-can"
            onClick={onRequestDeleteSelected}
            disabled={!hasSelection}
            aria-label="Delete selected"
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Delete
          </Button>
        </span>
      </Tooltip>
      <div className="min-w-[140px] sm:min-w-[160px]">
        <Select
          placeholder="Move to..."
          value={moveValue}
          onChange={handleMoveChange}
          options={options}
          styles={selectStyles}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          menuPosition="fixed"
          aria-label="Move to column"
          isClearable={false}
          isDisabled={!hasSelection}
        />
      </div>
      <Tooltip content={hasSelection ? 'Clear selection' : 'No selection'} position="bottom">
        <span className="inline-flex sm:ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={!hasSelection}
            aria-label="Clear selection"
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Clear selection
          </Button>
        </span>
      </Tooltip>
    </div>
  );
};
