import { create } from "zustand";

type uiStore = {
  isOptimalWorkerChecked: boolean;
  setIsOptimalWorkerChecked: (value: boolean) => void;
  toggleOptimalWorker: () => void;
};

export const useUiStore = create<uiStore>((set) => ({
  isOptimalWorkerChecked: true,

  setIsOptimalWorkerChecked: (value) => set({ isOptimalWorkerChecked: value }),

  toggleOptimalWorker: () =>
    set((state) => ({
      isOptimalWorkerChecked: !state.isOptimalWorkerChecked,
    })),
}));
