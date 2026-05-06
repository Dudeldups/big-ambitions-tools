import userEvent from "@testing-library/user-event";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import PlaythroughInfoCard from "./playthrough-info-card";

vi.mock("@/i18n/navigation", () => import("@/__tests__/mocks/i18n-navigation"));
vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

describe("PlaythroughInfoCard", () => {
  it("renders the playthrough details and link target", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
    });

    renderWithIntl(
      <PlaythroughInfoCard
        pt={playthrough}
        editingPlaythroughId={null}
        cancelEditing={vi.fn()}
        startEditing={vi.fn()}
      />,
    );

    expect(screen.getByText("Jordan")).toBeInTheDocument();
    expect(screen.getByText(/Difficulty: Hard/i)).toBeInTheDocument();
    expect(screen.getByText(/Factories: 0/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Jordan/i })).toHaveAttribute(
      "href",
      `/tools/${playthrough.id}`,
    );
  });

  it("starts editing when no playthrough is currently being edited", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "normal",
    });
    const startEditing = vi.fn();

    renderWithIntl(
      <PlaythroughInfoCard
        pt={playthrough}
        editingPlaythroughId={null}
        cancelEditing={vi.fn()}
        startEditing={startEditing}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(startEditing).toHaveBeenCalledWith(playthrough);
  });

  it("cancels editing when another playthrough is already being edited", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "easy",
    });
    const cancelEditing = vi.fn();

    renderWithIntl(
      <PlaythroughInfoCard
        pt={playthrough}
        editingPlaythroughId="currently-editing"
        cancelEditing={cancelEditing}
        startEditing={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(cancelEditing).toHaveBeenCalledTimes(1);
  });

  it("deletes the playthrough after confirmation and shows a success toast", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Morgan",
      difficulty: "hard",
    });

    renderWithIntl(
      <PlaythroughInfoCard
        pt={playthrough}
        editingPlaythroughId={null}
        cancelEditing={vi.fn()}
        startEditing={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("Delete playthrough")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(usePlaythroughStore.getState().getPlaythroughById(playthrough.id)).toBe(
      undefined,
    );
    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      'Playthrough "Morgan" deleted!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
  });
});
