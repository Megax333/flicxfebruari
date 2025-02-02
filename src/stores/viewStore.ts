import { create } from 'zustand';

interface ViewState {
  selectedTribe: string | null;
  setSelectedTribe: (tribe: string | null) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  selectedTribe: null,
  setSelectedTribe: (tribe) => set({ selectedTribe: tribe }),
}));