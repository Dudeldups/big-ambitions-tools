import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import EditGroupForm from "./edit-group-form";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

describe("EditGroupForm", () => {
  it("prefills the current group values and saves edits", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Morgan",
      difficulty: "normal",
    });
    const group = usePlaythroughStore.getState().createFactoryGroup(
      playthrough.id,
      {
        name: "Supplies",
        color: "#ffffff",
      },
    );
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<EditGroupForm groupId={group.id} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toHaveValue("Supplies");

    await user.clear(nameInput);
    await user.type(nameInput, "Warehouse");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(
        usePlaythroughStore.getState().getGroupById(playthrough.id, group.id)
          ?.name,
      ).toBe("Warehouse");
    });

    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      'Group "Warehouse" updated!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
  });

  it("shows an error toast when the group can no longer be edited", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Riley",
      difficulty: "hard",
    });
    const group = usePlaythroughStore.getState().createFactoryGroup(
      playthrough.id,
      {
        name: "Logistics",
        color: "#abcdef",
      },
    );
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<EditGroupForm groupId={group.id} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    act(() => {
      usePlaythroughStore.getState().deleteFactoryGroup(playthrough.id, group.id);
    });

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Ghost Group");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(sonnerToastMock.error).toHaveBeenCalledWith(
      "An error occurred. Please check your inputs and try again. If the problem persists, please try refreshing the page.",
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
  });

  it("restores the persisted group values when editing is canceled", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Taylor",
      difficulty: "easy",
    });
    const group = usePlaythroughStore.getState().createFactoryGroup(
      playthrough.id,
      {
        name: "North Hub",
        color: "#ffffff",
      },
    );
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<EditGroupForm groupId={group.id} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Unsaved");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText("Name")).toHaveValue("North Hub");
  });
});
