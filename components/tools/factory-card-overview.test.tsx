import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import {
  renderWithIntl,
  screen,
  waitFor,
  within,
} from "@/__tests__/test-utils";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import FactoryCardOverview from "./factory-card-overview";

vi.mock("./factory-info-card", () => ({
  default: ({
    factoryId,
    setDraggedFactoryId,
  }: {
    factoryId: string;
    setDraggedFactoryId: (value: string | null) => void;
  }) => (
    <div data-testid={`factory-card-${factoryId}`}>
      <span>{factoryId}</span>
      <button type="button" onClick={() => setDraggedFactoryId(factoryId)}>
        {`drag-${factoryId}`}
      </button>
      <button type="button" onClick={() => setDraggedFactoryId(null)}>
        {`clear-${factoryId}`}
      </button>
    </div>
  ),
}));

vi.mock("./create-group-form", () => ({
  default: () => <div data-testid="create-group-form" />,
}));

vi.mock("./group-shopping-list-dialog", () => ({
  default: ({ factoryIds }: { factoryIds: string[] }) => (
    <div data-testid={`shopping-${factoryIds.join("-")}`} />
  ),
}));

vi.mock("./group-deliveries-dialog", () => ({
  default: ({ factoryIds }: { factoryIds: string[] }) => (
    <div data-testid={`deliveries-${factoryIds.join("-")}`} />
  ),
}));

vi.mock("./edit-group-form", () => ({
  default: ({ groupId }: { groupId: string }) => (
    <div data-testid={`edit-group-${groupId}`} />
  ),
}));

vi.mock("../delete-dialog", () => ({
  default: ({ onDelete }: { onDelete: () => void }) => (
    <button type="button" onClick={onDelete}>
      delete-group
    </button>
  ),
}));

describe("FactoryCardOverview", () => {
  function setupPlaythrough() {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
      gameVersion: "0.10",
    });
    const factoryA = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Factory A",
    });
    const factoryB = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Factory B",
    });

    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factoryA.id);
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factoryB.id);

    const group = usePlaythroughStore
      .getState()
      .createFactoryGroup(playthrough.id, {
        name: "Grouped",
        color: "#ffffff",
      });
    usePlaythroughStore
      .getState()
      .addFactoryToGroup(playthrough.id, factoryA.id, group.id);

    return { playthroughId: playthrough.id, factoryA, factoryB, group };
  }

  it("renders grouped and ungrouped factories", () => {
    const { playthroughId, factoryA, factoryB, group } = setupPlaythrough();
    const playthrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthroughId)!;

    renderWithIntl(<FactoryCardOverview playthrough={playthrough} />);

    expect(screen.getByText("Factory groups")).toBeInTheDocument();
    expect(screen.getByTestId("create-group-form")).toBeInTheDocument();
    expect(screen.getByText(group.name)).toBeInTheDocument();
    expect(screen.getByText("Ungrouped factories")).toBeInTheDocument();
    expect(
      screen.getByTestId(`factory-card-${factoryA.id}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`factory-card-${factoryB.id}`),
    ).toBeInTheDocument();
  });

  it("moves an ungrouped factory into a group on drop", async () => {
    const user = userEvent.setup();
    const { playthroughId, factoryB, group } = setupPlaythrough();
    const playthrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthroughId)!;

    renderWithIntl(<FactoryCardOverview playthrough={playthrough} />);

    await user.click(
      screen.getByRole("button", { name: `drag-${factoryB.id}` }),
    );

    const groupContainer = screen.getByText(group.name).parentElement
      ?.parentElement;
    fireEvent.drop(groupContainer!);

    await waitFor(() => {
      expect(
        usePlaythroughStore.getState().getGroupById(playthroughId, group.id)
          ?.factoryIds,
      ).toContain(factoryB.id);
    });
  });

  it("moves a grouped factory back into the ungrouped area on drop", async () => {
    const user = userEvent.setup();
    const { playthroughId, factoryA, group } = setupPlaythrough();
    const playthrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthroughId)!;

    renderWithIntl(<FactoryCardOverview playthrough={playthrough} />);

    await user.click(
      screen.getByRole("button", { name: `drag-${factoryA.id}` }),
    );

    const ungroupedContainer = screen.getByText(
      "Ungrouped factories",
    ).parentElement;
    fireEvent.drop(ungroupedContainer!);

    await waitFor(() => {
      expect(
        usePlaythroughStore.getState().getGroupById(playthroughId, group.id)
          ?.factoryIds,
      ).not.toContain(factoryA.id);
    });
  });

  it("deletes a group through its delete action", async () => {
    const user = userEvent.setup();
    const { playthroughId, group } = setupPlaythrough();
    const playthrough = usePlaythroughStore
      .getState()
      .getPlaythroughById(playthroughId)!;

    renderWithIntl(<FactoryCardOverview playthrough={playthrough} />);

    const groupSection = screen
      .getByText(group.name)
      .closest("div")?.parentElement!;
    await user.click(
      within(groupSection).getByRole("button", { name: "delete-group" }),
    );

    expect(
      usePlaythroughStore.getState().getGroupById(playthroughId, group.id),
    ).toBeUndefined();
  });
});
