const DatabaseTableHead = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="sticky -top-px bg-gray-900 text-left shadow-sm">
      <tr>{children}</tr>
    </thead>
  );
};

export default DatabaseTableHead;
