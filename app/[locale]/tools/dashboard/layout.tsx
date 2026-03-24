type DashboardLayoutProps = {
  children: React.ReactNode;
  playthrough: React.ReactNode;
  factory: React.ReactNode;
};

const DashboardLayout = ({
  children,
  playthrough,
  factory,
}: DashboardLayoutProps) => {
  return (
    <div className="px-4 py-8">
      {children}
      {playthrough}
      {factory}
    </div>
  );
};

export default DashboardLayout;
