import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { useAppStore } from "@/lib/stores/appStore";
import DifficultyButtonGroup from "./difficulty-button-group";

describe("DifficultyButtonGroup", () => {
  it("reflects the current difficulty and updates the app store on selection", async () => {
    const user = userEvent.setup();
    useAppStore.setState({ _hasHydrated: true, difficulty: "easy" });

    renderWithIntl(<DifficultyButtonGroup />);

    expect(screen.getByLabelText("Easy")).toBeChecked();
    expect(screen.getByLabelText("Normal")).not.toBeChecked();

    await user.click(screen.getByLabelText("Hard"));

    expect(useAppStore.getState().difficulty).toBe("hard");
    expect(screen.getByLabelText("Hard")).toBeChecked();
  });
});
