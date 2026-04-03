import { create } from 'zustand';
import type { AppMode, SoilState, SpacingRatio } from '../lib/types';

interface AppState {
  activeTab: number;
  mode: AppMode;
  selectedScenarioIds: string[];
  selectedSoilState: SoilState;
  selectedSpacing: SpacingRatio;
  showGeogrid: boolean;
  currentLoadStep: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  comparisonIds: string[];

  setActiveTab: (tab: number) => void;
  setMode: (mode: AppMode) => void;
  setSelectedSoilState: (s: SoilState) => void;
  setSelectedSpacing: (s: SpacingRatio) => void;
  setShowGeogrid: (v: boolean) => void;
  setCurrentLoadStep: (s: number) => void;
  setIsPlaying: (v: boolean) => void;
  toggleFullscreen: () => void;
  addComparison: (id: string) => void;
  removeComparison: (id: string) => void;
  setComparisonIds: (ids: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 0,
  mode: 'defense',
  selectedScenarioIds: [],
  selectedSoilState: 'IL_078',
  selectedSpacing: 'sD_25',
  showGeogrid: true,
  currentLoadStep: 0,
  isPlaying: false,
  isFullscreen: false,
  comparisonIds: ['group_25', 'group_30', 'group_35'],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setMode: (mode) => set({ mode }),
  setSelectedSoilState: (s) => set({ selectedSoilState: s }),
  setSelectedSpacing: (s) => set({ selectedSpacing: s }),
  setShowGeogrid: (v) => set({ showGeogrid: v }),
  setCurrentLoadStep: (s) => set({ currentLoadStep: s }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  addComparison: (id) => set((s) => ({ comparisonIds: [...s.comparisonIds.filter(x => x !== id), id].slice(0, 4) })),
  removeComparison: (id) => set((s) => ({ comparisonIds: s.comparisonIds.filter(x => x !== id) })),
  setComparisonIds: (ids) => set({ comparisonIds: ids }),
}));
