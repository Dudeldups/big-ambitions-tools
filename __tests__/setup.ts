import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";
import { resetIndexedDbMock } from "./mocks/idb-keyval";

vi.mock("idb-keyval", () => import("./mocks/idb-keyval"));

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
  useAppStore.setState(initialAppState as AppState & AppActions, true);
  useAppStore.persist.clearStorage();
  resetIndexedDbMock();
  usePlaythroughStore.setState(
    {
      ...initialPlaythroughState,
      ...usePlaythroughStore.getInitialState(),
    } as PlaythroughState & PlaythroughActions,
    true,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});
