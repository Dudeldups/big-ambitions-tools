import userEvent from "@testing-library/user-event";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { renderWithIntl, screen, waitFor } from "@/__tests__/test-utils";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import PlaythroughOverview from "./playthrough-overview";

vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

vi.mock("./playthrough-info-card", () => ({
  default: ({
    pt,
    editingPlaythroughId,
    cancelEditing,
    startEditing,
  }: {
    pt: { id: string; characterName: string };
    editingPlaythroughId: string | null;
    cancelEditing: () => void;
    startEditing: (playthrough: { id: string; characterName: string }) => void;
  }) => (
    <div data-testid={`playthrough-card-${pt.id}`}>
      <span>{pt.characterName}</span>
      <span>{editingPlaythroughId ?? "not-editing"}</span>
      <button type="button" onClick={() => startEditing(pt)}>
        {`edit-${pt.id}`}
      </button>
      <button type="button" onClick={cancelEditing}>
        {`cancel-${pt.id}`}
      </button>
    </div>
  ),
}));

vi.mock("./edit-playthrough-form", async () => {
  const reactHookForm = await import("react-hook-form");

  return {
    default: ({
      onSubmit,
      cancelEditing,
    }: {
      onSubmit: (values: {
        characterName: string;
        difficulty: string;
        gameVersion: string;
      }) => void;
      cancelEditing: () => void;
    }) => {
      const { setValue } = reactHookForm.useFormContext<{
        characterName: string;
        difficulty: string;
        gameVersion: string;
      }>();

      return (
        <div data-testid="edit-playthrough-form">
          <button
            type="button"
            onClick={() => {
              setValue("characterName", "Updated Name", {
                shouldDirty: true,
              });
              setValue("difficulty", "hard", {
                shouldDirty: true,
              });
              setValue("gameVersion", DEFAULT_GAME_VERSION, {
                shouldDirty: true,
              });
            }}
          >
            make-dirty
          </button>
          <button
            type="button"
            onClick={() =>
              onSubmit({
                characterName: "Updated Name",
                difficulty: "hard",
                gameVersion: DEFAULT_GAME_VERSION,
              })
            }
          >
            submit-edit
          </button>
          <button type="button" onClick={cancelEditing}>
            cancel-edit
          </button>
        </div>
      );
    },
  };
});

describe("PlaythroughOverview", () => {
  it("renders a loading spinner before the playthrough store has hydrated", () => {
    renderWithIntl(<PlaythroughOverview />);

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
  });

  it("renders the empty state when no playthroughs exist", () => {
    usePlaythroughStore.setState({ _hasHydrated: true });

    renderWithIntl(<PlaythroughOverview />);

    expect(
      screen.getByText("No playthroughs yet. Create one to get started!"),
    ).toBeInTheDocument();
  });

  it("switches a playthrough into edit mode and saves dirty changes", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "easy",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });

    renderWithIntl(<PlaythroughOverview />);

    await user.click(
      screen.getByRole("button", { name: `edit-${playthrough.id}` }),
    );

    expect(screen.getByTestId("edit-playthrough-form")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "make-dirty" }));
    await user.click(screen.getByRole("button", { name: "submit-edit" }));

    await waitFor(() => {
      expect(
        usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
          ?.characterName,
      ).toBe("Updated Name");
    });

    expect(
      usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
        ?.difficulty,
    ).toBe("hard");
    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      'Playthrough "Updated Name" updated!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
    expect(
      screen.queryByTestId("edit-playthrough-form"),
    ).not.toBeInTheDocument();
  });

  it("leaves edit mode when cancelEditing is triggered", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "normal",
      gameVersion: DEFAULT_GAME_VERSION,
    });
    usePlaythroughStore.setState({ _hasHydrated: true });

    renderWithIntl(<PlaythroughOverview />);

    await user.click(
      screen.getByRole("button", { name: `edit-${playthrough.id}` }),
    );
    expect(screen.getByTestId("edit-playthrough-form")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "cancel-edit" }));

    expect(
      screen.queryByTestId("edit-playthrough-form"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(`playthrough-card-${playthrough.id}`),
    ).toBeInTheDocument();
  });
});
