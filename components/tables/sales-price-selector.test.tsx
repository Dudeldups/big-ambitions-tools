import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { DISPLAY_PRICE_OPTIONS } from "@/lib/constants";
import { useAppStore } from "@/lib/stores/appStore";
import SalesPriceSelector from "./sales-price-selector";

describe("SalesPriceSelector", () => {
  it("updates the price source while preserving the current target", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      _hasHydrated: true,
      displayPrices: {
        source: DISPLAY_PRICE_OPTIONS.SOURCE.MANUFACTURE,
        target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
      },
    });

    renderWithIntl(<SalesPriceSelector />);

    await user.click(screen.getByLabelText(/import/i));

    expect(useAppStore.getState().displayPrices).toEqual({
      source: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
      target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
    });
  });

  it("updates the price target while preserving the current source", async () => {
    const user = userEvent.setup();
    useAppStore.setState({
      _hasHydrated: true,
      displayPrices: {
        source: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
        target: DISPLAY_PRICE_OPTIONS.TARGET.EXPORT,
      },
    });

    renderWithIntl(<SalesPriceSelector />);

    await user.click(screen.getByLabelText(/retail/i));

    expect(useAppStore.getState().displayPrices).toEqual({
      source: DISPLAY_PRICE_OPTIONS.SOURCE.IMPORT,
      target: DISPLAY_PRICE_OPTIONS.TARGET.RETAIL,
    });
  });
});
