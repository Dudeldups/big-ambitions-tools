import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";
import { resetIndexedDbMock } from "./mocks/idb-keyval";
import { resetNextNavigationMocks } from "./mocks/next-navigation";

vi.mock("idb-keyval", () => import("./mocks/idb-keyval"));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

import {
  AppActions,
  AppState,
  initialAppState,
  useAppStore,
} from "@/lib/stores/appStore";
import {
  initialPlaythroughState,
  PlaythroughActions,
  PlaythroughState,
  usePlaythroughStore,
} from "@/lib/stores/playthroughStore";

beforeEach(async () => {
  localStorage.clear();
  resetIndexedDbMock();
  resetNextNavigationMocks();
  await useAppStore.persist.clearStorage();
  await usePlaythroughStore.persist.clearStorage();
  useAppStore.setState(
    {
      ...initialAppState,
      ...useAppStore.getInitialState(),
    } as AppState & AppActions,
    true,
  );
  usePlaythroughStore.setState(
    {
      ...initialPlaythroughState,
      ...usePlaythroughStore.getInitialState(),
    } as PlaythroughState & PlaythroughActions,
    true,
  );
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
