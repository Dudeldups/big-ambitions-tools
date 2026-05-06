import { vi } from "vitest";

export const useParams = vi.fn(() => ({}));
export const useSearchParams = vi.fn(() => new URLSearchParams());

export function setMockParams(params: Record<string, string>) {
  useParams.mockReturnValue(params);
}

export function resetNextNavigationMocks() {
  useParams.mockReturnValue({});
  useSearchParams.mockReturnValue(new URLSearchParams());
}
