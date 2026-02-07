import { useState, useCallback, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import type { AppState } from '../types';

export const useTodoBoardState = (): [AppState, (state: AppState) => void] => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const persist = useCallback((next: AppState) => {
    setState(next);
  }, []);

  return [state, persist];
};
