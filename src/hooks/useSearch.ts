import { useState, useCallback } from 'react';
import { fuzzyMatch, highlightChunks } from '../utils/search';
import type { Task } from '../types';

type UseSearchReturn = {
  query: string;
  setQuery: (q: string) => void;
  filterTasks: (tasks: Task[]) => Task[];
  getHighlightChunks: (text: string) => { type: 'match' | 'text'; value: string }[];
  hasActiveSearch: boolean;
};

export const useSearch = (fuzzy = true): UseSearchReturn => {
  const [query, setQuery] = useState('');

  const filterTasks = useCallback(
    (tasks: Task[]): Task[] => {
      if (!query.trim()) return tasks;
      const getSearchableText = (t: Task): string =>
        [t.text, t.description ?? '', (t.labels ?? []).join(' ')].filter(Boolean).join(' ');
      const matchTask = (task: Task): boolean => {
        const text = getSearchableText(task);
        if (fuzzy) return fuzzyMatch(text, query);
        return text.toLowerCase().includes(query.toLowerCase());
      };
      return tasks.filter(matchTask);
    },
    [query, fuzzy]
  );

  const getHighlightChunks = useCallback(
    (text: string) => highlightChunks(text, query),
    [query]
  );

  return {
    query,
    setQuery,
    filterTasks,
    getHighlightChunks,
    hasActiveSearch: query.trim().length > 0,
  };
};
