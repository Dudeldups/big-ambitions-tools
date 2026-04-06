const MockedDataTable = ({
  data,
  columns,
}: {
  data: unknown[];
  columns: unknown[];
}) => (
  <div data-testid="data-table">
    <span data-testid="row-count">{data.length}</span>
    <span data-testid="column-count">{columns.length}</span>
    <span data-testid="row-data" data-value={JSON.stringify(data)}>
      {JSON.stringify(data)}
    </span>
  </div>
);

vi.mock("@/components/tables/data-table", () => ({
  DataTable: MockedDataTable,
}));
