import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import { routerMock } from "@/__tests__/mocks/i18n-navigation";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { _testFactoryFormValues } from "@/__tests__/test-values";
import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import FactoryInfoCard from "./factory-info-card";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("@/i18n/navigation", () => import("@/__tests__/mocks/i18n-navigation"));
vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

describe("FactoryInfoCard", () => {
  it("renders factory details and link targets", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "hard",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Bakery",
      description: "Bread and pastries",
    });
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(
      <FactoryInfoCard
        factoryId={factory.id}
        setDraggedFactoryId={vi.fn()}
      />,
    );

    expect(screen.getByText("Bakery")).toBeInTheDocument();
    expect(screen.getByText("Bread and pastries")).toBeInTheDocument();
    expect(screen.getByText(/12h/i)).toBeInTheDocument();
    expect(screen.getByText(/3x Clothing Workstation/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Bakery" }),
    ).toHaveAttribute("href", `/tools/${playthrough.id}/factories/${factory.id}`);
    expect(
      screen.getAllByRole("link").some((link) =>
        link.getAttribute("href") ===
        `/tools/${playthrough.id}/factories/${factory.id}/edit`,
      ),
    ).toBe(true);
  });

  it("stores the factory as a template and navigates to create on copy", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Alex",
      difficulty: "normal",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Copy Me",
    });
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(
      <FactoryInfoCard
        factoryId={factory.id}
        setDraggedFactoryId={vi.fn()}
      />,
    );

    const card = screen.getByText("Copy Me").closest('[draggable="true"]')!;
    const buttons = within(card).getAllByRole("button");

    await user.click(buttons[0]);

    expect(usePlaythroughStore.getState().templateFactory).toMatchObject({
      id: factory.id,
      name: "Copy Me",
    });
    expect(routerMock.push).toHaveBeenCalledWith(
      `/tools/${playthrough.id}/factories/create`,
    );
  });

  it("deletes the factory after confirmation and redirects back to the factory overview", async () => {
    const user = userEvent.setup();
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Casey",
      difficulty: "easy",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Disposable Factory",
    });
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });

    renderWithIntl(
      <FactoryInfoCard
        factoryId={factory.id}
        setDraggedFactoryId={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("Delete factory")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(usePlaythroughStore.getState().getFactoryById(factory.id)).toBe(
      undefined,
    );
    expect(sonnerToastMock.success).toHaveBeenCalledWith(
      '"Disposable Factory" deleted!',
      expect.objectContaining({
        position: "bottom-right",
      }),
    );
    expect(routerMock.push).toHaveBeenCalledWith(
      `/tools/${playthrough.id}/factories`,
    );
  });

  it("reports drag start and end through the provided setter", () => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Taylor",
      difficulty: "hard",
    });
    const factory = usePlaythroughStore.getState().createFactory({
      ..._testFactoryFormValues,
      name: "Draggable",
    });
    usePlaythroughStore
      .getState()
      .addFactoryToPlaythrough(playthrough.id, factory.id);
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });
    const setDraggedFactoryId = vi.fn();

    const { container } = renderWithIntl(
      <FactoryInfoCard
        factoryId={factory.id}
        setDraggedFactoryId={setDraggedFactoryId}
      />,
    );

    const card = container.querySelector('[draggable="true"]');
    card?.dispatchEvent(new Event("dragstart", { bubbles: true }));
    card?.dispatchEvent(new Event("dragend", { bubbles: true }));

    expect(setDraggedFactoryId).toHaveBeenNthCalledWith(1, factory.id);
    expect(setDraggedFactoryId).toHaveBeenNthCalledWith(2, null);
  });
});
