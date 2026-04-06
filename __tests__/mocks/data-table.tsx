export const MockedDataTable = ({
  data,
  columns,
}: {
  data: unknown[];
  columns: unknown[];
}) => (
  <div data-testid="data-table">
    <span data-testid="row-count">{data.length}</span>
    <span data-testid="column-count">{columns.length}</span>
  </div>
);

export const mockDataTable = () => {
  vi.mock("@/components/tables/data-table", () => ({
    DataTable: MockedDataTable,
  }));
};
