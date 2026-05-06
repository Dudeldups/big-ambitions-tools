import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import CreateGroupForm from "./create-group-form";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

describe("CreateGroupForm", () => {
  it("validates that the group name is required", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "normal",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<CreateGroupForm />);

    await user.click(screen.getByRole("button", { name: /create group/i }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(await screen.findByText("Group name is required.")).toBeInTheDocument();
    expect(
      usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
        ?.factoryGroups,
    ).toEqual([]);
  });

  it("creates a new group, shows a success toast and resets the form", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jamie",
      difficulty: "hard",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<CreateGroupForm />);

    await user.click(screen.getByRole("button", { name: /create group/i }));

    const nameInput = screen.getByLabelText("Name");
    const colorInput = document.querySelector(
      'input[type="color"]',
    ) as HTMLInputElement;

    await user.type(nameInput, "Warehouse");
    fireEvent.change(colorInput, { target: { value: "#123456" } });
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(
        usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
          ?.factoryGroups,
      ).toHaveLength(1);
    });

    expect(
      usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
        ?.factoryGroups[0],
    ).toMatchObject({
      name: "Warehouse",
      color: "#123456",
    });
    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      'Group "Warehouse" created!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
    expect(screen.queryByText("Create a new factory group")).not.toBeInTheDocument();
  });

  it("resets edited values when the dialog is canceled", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "easy",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(<CreateGroupForm />);

    await user.click(screen.getByRole("button", { name: /create group/i }));

    const nameInput = screen.getByLabelText("Name");
    await user.type(nameInput, "Temp Group");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await user.click(screen.getByRole("button", { name: /create group/i }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
  });
});
