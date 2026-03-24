import { create } from "zustand";
import { Factory, Playthrough } from "./playthroughStore";

export type SessionState = {
  activePlaythrough: Playthrough | null;
  activeFactory: Factory | null;
};

export type SessionActions = {
  setActivePlaythrough: (playthrough: Playthrough | null) => void;
  setActiveFactory: (factory: Factory | null) => void;
};

export const useSessionStore = create<SessionState & SessionActions>()(
  (set) => ({
    activePlaythrough: null,
    activeFactory: null,

    setActivePlaythrough: (playthrough) =>
      set({ activePlaythrough: playthrough }),
    setActiveFactory: (factory) => set({ activeFactory: factory }),
  }),
);
