import userEvent from "@testing-library/user-event";
import { renderWithIntl, screen, within } from "@/__tests__/test-utils";
import { ColumnDef, Row, Table as ReactTable } from "@tanstack/react-table";
import { DataTable } from "./data-table";

vi.mock("@/lib/hooks/useOverflowDetection", () => ({
  useOverflowDetection: () => ({
    overflowRef: { current: null },
    isOverflowing: false,
  }),
}));

vi.mock("@/lib/hooks/useIsSticky", () => ({
  useIsSticky: () => ({
    sentinelRef: { current: null },
    isSticky: false,
  }),
}));

vi.mock("./data-table-options-bar", () => ({
  default: <TData,>({
    table,
  }: {
    table: ReactTable<TData>;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => table.getColumn("itemName")?.setFilterValue("burger")}
      >
        filter-burger
      </button>
      <button
        type="button"
        onClick={() => table.getColumn("itemName")?.setFilterValue("zzz")}
      >
        filter-miss
      </button>
      <button
        type="button"
        onClick={() => table.getColumn("itemName")?.setFilterValue("")}
      >
        clear-filter
      </button>
    </div>
  ),
}));

type TestRow = {
  itemName: string;
  amount: number;
};

const columns: ColumnDef<TestRow>[] = [
  {
    id: "itemName",
    accessorKey: "itemName",
    header: "Item",
    cell: ({ getValue }) => getValue<string>(),
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => getValue<number>(),
    meta: {
      align: "right",
    },
  },
];

describe("DataTable", () => {
  it("sorts rows by itemName ascending by default", () => {
    renderWithIntl(
      <DataTable
        columns={columns}
        data={[
          { itemName: "sodaCan", amount: 4 },
          { itemName: "burger", amount: 10 },
          { itemName: "apple", amount: 2 },
        ]}
      />,
    );

    const rows = screen.getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("apple")).toBeInTheDocument();
    expect(within(rows[1]).getByText("burger")).toBeInTheDocument();
    expect(within(rows[2]).getByText("sodaCan")).toBeInTheDocument();
  });

  it("filters rows through the table options bar and shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();

    renderWithIntl(
      <DataTable
        columns={columns}
        data={[
          { itemName: "sodaCan", amount: 4 },
          { itemName: "burger", amount: 10 },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "filter-burger" }));

    expect(screen.getByText("burger")).toBeInTheDocument();
    expect(screen.queryByText("sodaCan")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "filter-miss" }));

    expect(screen.getByText("No results found.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "clear-filter" }));

    expect(screen.getByText("sodaCan")).toBeInTheDocument();
    expect(screen.getByText("burger")).toBeInTheDocument();
  });

  it("uses the custom renderRow callback when provided", () => {
    renderWithIntl(
      <DataTable
        columns={columns}
        data={[{ itemName: "burger", amount: 10 }]}
        renderRow={(row: Row<TestRow>) => (
          <tr key={row.id} data-testid="custom-row">
            <td>{`${row.original.itemName}:${row.original.amount}`}</td>
          </tr>
        )}
      />,
    );

    expect(screen.getByTestId("custom-row")).toHaveTextContent("burger:10");
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
  });
});
