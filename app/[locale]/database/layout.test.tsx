import { renderWithIntl, screen } from "@/__tests__/test-utils";
import DatabaseLayout from "./layout";

describe("DatabaseLayout", () => {
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
});
