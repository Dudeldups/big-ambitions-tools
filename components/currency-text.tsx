import { cn } from "@/lib/utils";
import { formatToUSD } from "@/lib/utils/formatToUSD";

type CurrencyTextProps = {
  className?: string;
  value: number;
  hideCents?: boolean;
};

const CurrencyText = ({
  className,
  value,
  hideCents = false,
}: CurrencyTextProps) => {
  const color = value > 0 ? "text-success" : "text-destructive";

  return (
    <span className={cn("amount", color, className)}>
      {formatToUSD(value, hideCents)}
    </span>
  );
};

export default CurrencyText;
