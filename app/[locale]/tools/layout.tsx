type ToolsLayoutProps = {
  children: React.ReactNode;
  factory: React.ReactNode;
};

const ToolsLayout = ({ children, factory }: ToolsLayoutProps) => {
  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">
        <div>{children}</div>
        {factory && <div>{factory}</div>}
      </section>
    </div>
  );
};

export default ToolsLayout;
