import { cn } from "@/lib/utils";

type DatabaseHgroupProps = {
  title: string;
  caption?: string;
  className?: string;
};

const DatabaseHgroup = ({ title, caption, className }: DatabaseHgroupProps) => {
  return (
    <hgroup className={cn("max-w-2xl space-y-3", className)}>
      <h2>{title}</h2>
      {caption && <p className="text-muted-foreground">{caption}</p>}
    </hgroup>
  );
};

export default DatabaseHgroup;
