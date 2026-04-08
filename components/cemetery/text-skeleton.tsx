import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
};

const TextSkeleton = ({ className }: Props) => {
  return <Skeleton className={cn("inline-block h-5 w-[10ch]", className)} />;
};

export default TextSkeleton;
