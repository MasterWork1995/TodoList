import { motion } from 'framer-motion';

export function ColumnEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50/50 py-10 text-center"
    >
      <i
        className="fa-regular fa-clipboard text-3xl text-surface-300"
        aria-hidden
      />
      <p className="mt-3 text-sm font-medium text-surface-500">
        No tasks yet
      </p>
      <p className="mt-1 text-xs text-surface-400">
        Click &quot;Add task&quot; to create one
      </p>
    </motion.div>
  );
}
