import { Button, Tooltip } from '../../ui';

type ColumnHeaderProps = {
  title: string;
  isEditing: boolean;
  titleValue: string;
  onTitleChange: (v: string) => void;
  onTitleSubmit: () => void;
  onTitleEditStart: () => void;
  onTitleEditCancel: () => void;
  onSelectAll: () => void;
  onDeleteColumn: () => void;
  headerRef: (el: HTMLDivElement | null) => void;
};

export function ColumnHeader({
  title,
  isEditing,
  titleValue,
  onTitleChange,
  onTitleSubmit,
  onTitleEditStart,
  onTitleEditCancel,
  onSelectAll,
  onDeleteColumn,
  headerRef,
}: ColumnHeaderProps) {
  return (
    <div
      ref={headerRef}
      className="flex touch-none cursor-grab items-center gap-3 border-b border-surface-100 bg-surface-50/80 px-4 py-3 active:cursor-grabbing"
      aria-label="Column header, drag to reorder"
    >
      <Tooltip content="Drag to reorder columns" position="bottom">
        <span className="flex shrink-0 text-surface-400" aria-hidden>
          <i className="fa-solid fa-grip-vertical text-sm" />
        </span>
      </Tooltip>
      {isEditing ? (
        <input
          type="text"
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={onTitleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onTitleSubmit();
            if (e.key === 'Escape') onTitleEditCancel();
          }}
          className="min-w-0 flex-1 rounded-lg border border-accent/50 bg-white px-2 py-1.5 text-sm font-semibold text-surface-800 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-text"
          aria-label="Column title"
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={onTitleEditStart}
          className="min-w-0 flex-1 cursor-pointer rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-surface-800 outline-none hover:bg-surface-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          aria-label={`Edit title: ${title}`}
        >
          {title}
        </button>
      )}
      <div className="flex shrink-0 items-center gap-0.5">
        <Tooltip content="Select all in column" position="bottom">
          <Button
            variant="ghost"
            size="sm"
            icon="fa-check-double"
            onClick={onSelectAll}
            className="cursor-pointer !p-2 text-surface-500 hover:!bg-surface-200 hover:!text-surface-700"
            aria-label="Select all in column"
          />
        </Tooltip>
        <Tooltip content="Delete column" position="bottom">
          <Button
            variant="ghost"
            size="sm"
            icon="fa-trash-can"
            onClick={onDeleteColumn}
            className="cursor-pointer !p-2 text-surface-500 hover:!bg-red-50 hover:!text-red-600"
            aria-label="Delete column"
          />
        </Tooltip>
      </div>
    </div>
  );
}
