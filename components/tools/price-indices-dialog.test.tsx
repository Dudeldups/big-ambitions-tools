import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { BASE_PRODUCT_PRICE_INDEX } from "@/lib/constants";
import { assertPriceIndex } from "@/lib/utils/assertPriceIndex";
import { safeLog } from "@/lib/utils/safeLog";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import PriceIndicesDialog from "./price-indices-dialog";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));
vi.mock("@/lib/utils/assertPriceIndex", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/utils/assertPriceIndex")
  >("@/lib/utils/assertPriceIndex");

  return {
    ...actual,
    assertPriceIndex: vi.fn(actual.assertPriceIndex),
  };
});
vi.mock("@/lib/utils/safeLog", () => ({
  safeLog: vi.fn(),
}));

describe("PriceIndicesDialog", () => {
  it("renders nothing when no active playthrough is available", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    renderWithIntl(<PriceIndicesDialog />);

    expect(
      screen.queryByRole("button", { name: /price indices/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the current price indices for active products", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Chris",
      difficulty: "hard",
      gameVersion: "0.10",
    });

    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<PriceIndicesDialog />);

    await user.click(screen.getByRole("button", { name: /price indices/i }));

    expect(
      screen.getByRole("heading", { name: /price indices/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/clothing \(classic cheap male\):/i),
    ).toHaveValue(String(BASE_PRODUCT_PRICE_INDEX));
  });

  it("updates the selected product price index when a slider changes", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Riley",
      difficulty: "easy",
      gameVersion: "0.10",
    });

    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<PriceIndicesDialog />);

    await user.click(screen.getByRole("button", { name: /price indices/i }));

    fireEvent.change(screen.getByLabelText(/burger:/i), {
      target: { value: "1.2", name: "burger" },
    });

    expect(
      usePlaythroughStore.getState().getPriceIndices(playthrough.id).burger,
    ).toBe(1.2);
  });

  it("shows an error toast for invalid price index values", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "normal",
      gameVersion: "0.10",
    });

    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<PriceIndicesDialog />);

    await user.click(screen.getByRole("button", { name: /price indices/i }));

    vi.mocked(assertPriceIndex).mockImplementationOnce(() => {
      throw new Error("errors.invalidPriceIndex");
    });

    fireEvent.change(screen.getByLabelText(/burger:/i), {
      target: { value: "1.2", name: "burger" },
    });

    expect(sonnerToastMock.error).toHaveBeenCalledTimes(1);
    expect(
      usePlaythroughStore.getState().getPriceIndices(playthrough.id).burger,
    ).toBe(BASE_PRODUCT_PRICE_INDEX);
    expect(safeLog).toHaveBeenCalledTimes(1);
  });
});
