import "@testing-library/jest-dom";
import { beforeEach } from "vitest";
import {
  AppActions,
  AppState,
  initialState,
  useAppStore,
} from "@/lib/stores/appStore";

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState(initialState as AppState & AppActions, true);
  useAppStore.persist.clearStorage();
});
