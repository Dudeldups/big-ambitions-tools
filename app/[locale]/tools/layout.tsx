const ToolsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">{children}</section>
    </div>
  );
};

export default ToolsLayout;
