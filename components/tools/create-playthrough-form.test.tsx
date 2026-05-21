import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import CreatePlaythroughForm from "./create-playthrough-form";

vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

describe("CreatePlaythroughForm", () => {
  it("shows a loading spinner until the app store has hydrated", async () => {
    const user = userEvent.setup();

    renderWithIntl(<CreatePlaythroughForm />);

    await user.click(screen.getByRole("button", { name: /new playthrough/i }));

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Easy")).not.toBeInTheDocument();
  });

  it("validates required fields before creating a playthrough", async () => {
    const user = userEvent.setup();

    useAppStore.setState({ _hasHydrated: true, difficulty: "normal" });

    renderWithIntl(<CreatePlaythroughForm />);

    await user.click(screen.getByRole("button", { name: /new playthrough/i }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(
      await screen.findByText("Your character should have a name."),
    ).toBeInTheDocument();
    expect(usePlaythroughStore.getState().playthroughs).toHaveLength(0);
    expect(sonnerToastMock.success).not.toHaveBeenCalled();
  });

  it("creates a playthrough with the hydrated app difficulty and closes the dialog", async () => {
    const user = userEvent.setup();

    useAppStore.setState({ _hasHydrated: true, difficulty: "hard" });

    renderWithIntl(<CreatePlaythroughForm />);

    await user.click(screen.getByRole("button", { name: /new playthrough/i }));

    expect(screen.getByLabelText("Hard")).toBeChecked();

    await user.type(screen.getByLabelText("Character name"), "Jordan");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(usePlaythroughStore.getState().playthroughs).toHaveLength(1);
    });

    expect(usePlaythroughStore.getState().playthroughs[0]).toMatchObject({
      characterName: "Jordan",
      difficulty: "hard",
      gameVersion: "0.10",
      isActive: true,
    });
    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      'Playthrough "Jordan" created!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
    expect(
      screen.queryByText("Create a new playthrough"),
    ).not.toBeInTheDocument();
  });
});
