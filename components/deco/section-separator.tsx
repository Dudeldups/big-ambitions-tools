import { Separator } from "../ui/separator";

const SectionSeparator = () => {
  return (
    <Separator className="via-foreground/20 max-w-page mx-auto bg-linear-to-r from-transparent to-transparent data-horizontal:w-[calc(100vw-2*var(--spacing-clamp-x))]" />
  );
};

export default SectionSeparator;
