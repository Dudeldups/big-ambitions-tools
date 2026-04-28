import ScrollToTop from "@/components/providers/scroll-to-top";

const ToolsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

export default ToolsLayout;
