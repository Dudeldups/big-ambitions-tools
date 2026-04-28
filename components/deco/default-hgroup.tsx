import { cn } from "@/lib/utils";

type DefaultHgroupProps = {
  title: string | React.ReactNode;
  caption?: string | React.ReactNode;
  className?: string;
  captionAs?: React.ElementType;
};

const DefaultHgroup = ({
  title,
  caption,
  className,
  captionAs: Component = "p",
}: DefaultHgroupProps) => {
  return (
    <hgroup className={cn("max-w-2xl space-y-4", className)}>
      <h2>{title}</h2>
      {caption && (
        <Component className="text-muted-foreground">{caption}</Component>
      )}
    </hgroup>
  );
};

export default DefaultHgroup;
