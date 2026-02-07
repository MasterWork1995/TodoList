import { useRef, useState, useCallback, useMemo } from 'react';
import { useTodoBoard } from './hooks/useTodoBoard';
import { useSearch } from './hooks/useSearch';
import { useSelection } from './hooks/useSelection';
import { useToast } from './context/ToastContext';
import { useAppModals } from './hooks/useAppModals';
import { useBoardActions } from './hooks/useBoardActions';
import { useBoardDragDrop } from './hooks/useBoardDragDrop';
import { AppHeader } from './components/AppHeader';
import { Board } from './components/Board';
import { AppModals } from './components/AppModals';
import type { Task } from './types';

function App() {
  const board = useTodoBoard();
  const { state } = board;
  const toast = useToast();
  const { query, setQuery, filterTasks: filterBySearch, getHighlightChunks } = useSearch(true);
  const selection = useSelection();
  const boardActions = useBoardActions(board, toast);

  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingColumnIndex, setDraggingColumnIndex] = useState<number | null>(null);

  const modals = useAppModals(board, toast, selection);

  const columns = useMemo(
    () => [...state.columns].sort((a, b) => a.order - b.order),
    [state.columns]
  );

  const existingLabels = useMemo((): string[] => {
    const labels = state.tasks.flatMap((t: Task) => t.labels ?? []) as string[];
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
  }, [state.tasks]);

  useBoardDragDrop(board, state.tasks, filterBySearch, columns, toast);

  const byCol = useMemo(() => {
    const map = new Map<string, { task: Task; index: number }[]>();
    state.tasks
      .sort((a: Task, b: Task) => a.order - b.order)
      .forEach((task: Task) => {
        const list = map.get(task.columnId) ?? [];
        list.push({ task, index: list.length });
        map.set(task.columnId, list);
      });
    return map;
  }, [state.tasks]);

  const columnTasksList = useCallback(
    (columnId: string) => {
      const list = byCol.get(columnId) ?? [];
      return filterBySearch(list.map((x) => x.task));
    },
    [byCol, filterBySearch]
  );

  const selectedIdsRef = useRef<string[]>([]);
  selectedIdsRef.current = Array.from(selection.selectedIds);

  const handleMoveToColumn = useCallback(
    (columnId: string) => {
      const ids = selectedIdsRef.current;
      const col = columns.find((c) => c.id === columnId);
      board.moveTasksToColumn(ids, columnId);
      toast.toast(col ? `Moved to ${col.title}` : 'Tasks moved', 'success');
    },
    [board, toast, columns]
  );

  const handleRequestBulkDelete = useCallback(() => {
    modals.requestBulkDelete(selectedIdsRef.current);
  }, [modals]);

  const setColumnDraggingByIndex = useCallback((index: number) => {
    return (v: boolean) => setDraggingColumnIndex(v ? index : null);
  }, []);

  return (
    <div className="min-h-screen w-full bg-surface-100 scrollbar-thin">
      <AppHeader
        query={query}
        setQuery={setQuery}
        selectedCount={selection.selectedIds.size}
        columns={columns}
        onRequestDeleteSelected={handleRequestBulkDelete}
        onMoveToColumn={handleMoveToColumn}
        onClearSelection={selection.clearSelection}
      />

      <Board
        columns={columns}
        columnTasksList={columnTasksList}
        getHighlightChunks={getHighlightChunks}
        isSelected={selection.isSelected}
        onToggleSelect={selection.toggle}
        onEditTask={modals.openEditTask}
        onDeleteTask={boardActions.deleteTask}
        onAddTask={boardActions.addTask}
        onReorderTasks={boardActions.reorderTasks}
        onSelectAllInColumn={selection.toggleAll}
        onUpdateColumnTitle={board.updateColumnTitle}
        onRequestDeleteColumn={modals.requestDeleteColumn}
        existingLabels={existingLabels}
        draggingTaskId={draggingTaskId}
        setDraggingTaskId={setDraggingTaskId}
        onColumnReorder={boardActions.reorderColumns}
        draggingColumnIndex={draggingColumnIndex}
        setColumnDragging={setColumnDraggingByIndex}
        onAddColumn={boardActions.addColumn}
      />

      <AppModals
        columnToDelete={modals.columnToDelete}
        onConfirmColumnDelete={modals.confirmColumnDelete}
        onCancelColumnDelete={modals.cancelColumnDelete}
        openBulkDelete={modals.pendingBulkDeleteIds !== null}
        bulkDeleteCount={modals.pendingBulkDeleteIds?.length ?? 0}
        onConfirmBulkDelete={modals.confirmBulkDelete}
        onCancelBulkDelete={modals.cancelBulkDelete}
        editingTask={modals.editingTask}
        columns={columns}
        onCloseEditTask={modals.closeEditTask}
        onUpdateTask={modals.updateTaskFromModal}
        existingLabels={existingLabels}
      />
    </div>
  );
}

export default App;
