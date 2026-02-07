import { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import type { Column } from '../types';

const BulkActionsBar = lazy(() =>
  import('./BulkActionsBar').then((m) => ({ default: m.BulkActionsBar }))
);

type AppHeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  selectedCount: number;
  columns: Column[];
  onRequestDeleteSelected: () => void;
  onMoveToColumn: (columnId: string) => void;
  onClearSelection: () => void;
};

function AppHeaderInner({
  query,
  setQuery,
  selectedCount,
  columns,
  onRequestDeleteSelected,
  onMoveToColumn,
  onClearSelection,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-surface-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex w-full max-w-none flex-col gap-3 px-2 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-6">
        <motion.h1
          className="text-xl font-bold tracking-tight text-surface-900 sm:text-2xl"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Todo List
        </motion.h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 sm:min-w-[200px]">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <Suspense fallback={null}>
            <BulkActionsBar
              selectedCount={selectedCount}
              columns={columns}
              onRequestDeleteSelected={onRequestDeleteSelected}
              onMoveToColumn={onMoveToColumn}
              onClearSelection={onClearSelection}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export const AppHeader = memo(AppHeaderInner);
