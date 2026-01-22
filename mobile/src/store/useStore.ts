import { useState, useEffect } from 'react';
import { dashboardStore } from './dashboardStore';
import { DashboardState } from '../types';

export function useStore(): DashboardState {
  const [state, setState] = useState<DashboardState>(dashboardStore.getState());

  useEffect(() => {
    dashboardStore.init();
    const unsubscribe = dashboardStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}

export { dashboardStore };
