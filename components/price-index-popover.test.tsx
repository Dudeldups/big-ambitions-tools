import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { BASE_PRODUCT_PRICE_INDEX } from "@/lib/constants";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import PriceIndexPopover from "./price-index-popover";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));

describe("PriceIndexPopover", () => {
  it("renders nothing when no active playthrough is available", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: "missing-id" });

    renderWithIntl(
      <PriceIndexPopover
        selectedProduct="classicCheapMaleClothing"
        factoryWorkerSalary={25}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /set price index/i }),
    ).not.toBeInTheDocument();
  });

  it("updates the selected product price index when the slider changes", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Chris",
      difficulty: "hard",
      gameVersion: "0.10",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(
      <PriceIndexPopover
        selectedProduct="classicCheapMaleClothing"
        factoryWorkerSalary={25}
      />,
    );

    await user.click(screen.getByRole("button", { name: /set price index/i }));

    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue(String(BASE_PRODUCT_PRICE_INDEX));

    fireEvent.change(slider, { target: { value: "1.2" } });

    expect(
      usePlaythroughStore.getState().getPriceIndices(playthrough.id)
        .classicCheapMaleClothing,
    ).toBe(1.2);
  });

  it("ignores invalid slider values", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Riley",
      difficulty: "easy",
      gameVersion: "0.10",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(
      <PriceIndexPopover
        selectedProduct="classicCheapMaleClothing"
        factoryWorkerSalary={25}
      />,
    );

    await user.click(screen.getByRole("button", { name: /set price index/i }));

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "not-a-number" },
    });

    expect(
      usePlaythroughStore.getState().getPriceIndices(playthrough.id)
        .classicCheapMaleClothing,
    ).toBe(BASE_PRODUCT_PRICE_INDEX);
  });
});
