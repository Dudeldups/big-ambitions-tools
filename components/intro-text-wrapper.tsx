import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const IntroTextWrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "border-muted-foreground my-8 max-w-2xl rounded-xl border bg-linear-60 from-cyan-800 to-cyan-900 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default IntroTextWrapper;
