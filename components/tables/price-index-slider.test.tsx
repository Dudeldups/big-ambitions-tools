import { fireEvent } from "@testing-library/react";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { BASE_PRODUCT_PRICE_INDEX } from "@/lib/constants";
import { useAppStore } from "@/lib/stores/appStore";
import PriceIndexSlider from "./price-index-slider";

describe("PriceIndexSlider", () => {
  it("shows a loading state while the table price index is unavailable", () => {
    useAppStore.setState({
      _hasHydrated: true,
      tablePriceIndex: null as never,
    });

    renderWithIntl(<PriceIndexSlider />);

    expect(screen.getByLabelText(/price index:/i)).toBeDisabled();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("updates the table price index in the app store when the slider changes", () => {
    useAppStore.setState({
      _hasHydrated: true,
      tablePriceIndex: BASE_PRODUCT_PRICE_INDEX,
    });

    renderWithIntl(<PriceIndexSlider />);

    const slider = screen.getByLabelText(/price index:/i);
    expect(slider).toHaveValue(String(BASE_PRODUCT_PRICE_INDEX));

    fireEvent.change(slider, { target: { value: "1.2" } });

    expect(useAppStore.getState().tablePriceIndex).toBe(1.2);
    expect(screen.getByText("1.2")).toBeInTheDocument();
  });
});
