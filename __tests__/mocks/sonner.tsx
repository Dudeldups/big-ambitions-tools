import { vi } from "vitest";

export const sonnerToastMock = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  dismiss: vi.fn(),
};

export function resetSonnerMock() {
  Object.values(sonnerToastMock).forEach((mock) => mock.mockReset());
}

export const toast = sonnerToastMock;

export function Toaster() {
  return null;
}
