import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { ViewLayout } from '../store/useAppStore';

function getLayoutFromWidth(width: number): ViewLayout {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Auto-detects screen size and syncs viewLayout in the store.
 * If user has set a manual override (viewLayoutOverride), that takes precedence.
 */
export function useResponsiveLayout() {
  const { setViewLayout, viewLayoutOverride } = useAppStore();

  useEffect(() => {
    // If user has manually overridden, don't auto-sync
    if (viewLayoutOverride !== null) return;

    const sync = () => {
      setViewLayout(getLayoutFromWidth(window.innerWidth));
    };

    // Set immediately
    sync();

    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [viewLayoutOverride, setViewLayout]);
}

export { getLayoutFromWidth };
export type { ViewLayout };
