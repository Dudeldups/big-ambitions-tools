import { vi } from "vitest";

const storage = new Map<string, string>();

export const get = vi.fn(async (key: string) => storage.get(key));
export const set = vi.fn(async (key: string, value: string) => {
  storage.set(key, value);
});
export const del = vi.fn(async (key: string) => {
  storage.delete(key);
});

export function resetIndexedDbMock() {
  storage.clear();
}
