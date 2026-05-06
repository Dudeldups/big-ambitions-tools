import { render, waitFor } from "@testing-library/react";
import { StoreHydration } from "./store-hydration";
import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";

describe("StoreHydration", () => {
  it("rehydrates both persisted stores on mount", async () => {
    const appRehydrate = vi.spyOn(useAppStore.persist, "rehydrate");
    const playthroughRehydrate = vi.spyOn(
      usePlaythroughStore.persist,
      "rehydrate",
    );

    render(<StoreHydration />);

    await waitFor(() => {
      expect(appRehydrate).toHaveBeenCalledTimes(1);
      expect(playthroughRehydrate).toHaveBeenCalledTimes(1);
    });
  });
});
