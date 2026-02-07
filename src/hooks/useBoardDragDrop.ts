import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Task } from '../types';
import type { useTodoBoard } from './useTodoBoard';
import type { useToast } from '../context/ToastContext';

type Board = ReturnType<typeof useTodoBoard>;
type Toast = ReturnType<typeof useToast>;

type Column = { id: string; title: string; order: number };

export function useBoardDragDrop(
  board: Board,
  stateTasks: Task[],
  filterBySearch: (tasks: Task[]) => Task[],
  columns: Column[],
  toast: Toast
) {
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const dest = location.current.dropTargets[0];
        if (!dest) return;

        const destData = dest.data;
        const srcData = source.data;

        if (srcData.type === 'task') {
          const src = srcData as { taskId: string; columnId: string; index: number };
          if (destData.type === 'task') {
            const d = destData as { columnId: string; index: number };
            if (src.columnId === d.columnId && src.index !== d.index) {
              const fullList = stateTasks
                .filter((t) => t.columnId === src.columnId)
                .sort((a, b) => a.order - b.order);
              const filtered = filterBySearch(fullList);
              const destTaskId = filtered[d.index]?.id;
              if (destTaskId && destTaskId !== src.taskId) {
                const start = fullList.findIndex((t) => t.id === src.taskId);
                const end = fullList.findIndex((t) => t.id === destTaskId);
                if (start !== -1 && end !== -1) {
                  board.reorderTasks(src.columnId, {
                    startIndex: start,
                    endIndex: end,
                  });
                  toast.toast('Task reordered', 'success');
                }
              }
            }
          } else if (destData.type === 'column') {
            const d = destData as { columnId: string };
            if (d.columnId !== src.columnId) {
              const destCol = columns.find((c) => c.id === d.columnId);
              board.moveTaskToColumn(src.taskId, d.columnId);
              toast.toast(destCol ? `Moved to ${destCol.title}` : 'Task moved', 'success');
            }
          }
        } else if (srcData.type === 'column' && destData.type === 'column') {
          const src = srcData as { columnId: string; index: number };
          const d = destData as { columnId: string; index: number };
          if (src.index !== d.index) {
            board.reorderColumns({ startIndex: src.index, endIndex: d.index });
            toast.toast('Column order updated', 'success');
          }
        }
      },
    });
  }, [board, stateTasks, filterBySearch, columns, toast]);
}
