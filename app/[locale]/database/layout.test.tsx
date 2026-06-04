import { renderWithIntl, screen } from "@/__tests__/test-utils";
import { DEFAULT_GAME_VERSION } from "@/lib/game/versions";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";
import DatabaseLayout from "./layout";

describe("DatabaseLayout", () => {
  beforeEach(() => {
    useAppStore.setState({
      ...initialAppState,
      _hasHydrated: true,
      gameVersion: DEFAULT_GAME_VERSION,
    });
  });

  it("renders the title and description", () => {
    renderWithIntl(
      <DatabaseLayout>
        <div />
      </DatabaseLayout>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders children", () => {
    renderWithIntl(
      <DatabaseLayout>
        <div data-testid="child-content">child</div>
      </DatabaseLayout>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  vi.mock("@/components/tables/table-switcher", () => ({
    default: () => <div data-testid="table-switcher" />,
  }));

  it("renders the table switcher", () => {
    renderWithIntl(
      <DatabaseLayout>
        <div />
      </DatabaseLayout>,
    );
    expect(screen.getByTestId("table-switcher")).toBeInTheDocument();
  });

  it("renders the game version selector", () => {
    renderWithIntl(
      <DatabaseLayout>
        <div />
      </DatabaseLayout>,
    );

    expect(screen.getByText("Game version")).toBeInTheDocument();
  });
});
