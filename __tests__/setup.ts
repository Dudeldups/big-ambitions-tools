import "@testing-library/jest-dom";
import { beforeEach } from "vitest";
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

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState(initialAppState as AppState & AppActions, true);
  useAppStore.persist.clearStorage();
  usePlaythroughStore.setState(
    initialPlaythroughState as PlaythroughState & PlaythroughActions,
    true,
  );
  usePlaythroughStore.persist.clearStorage();
});
