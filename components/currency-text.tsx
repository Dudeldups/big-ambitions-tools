import { formatToUSD } from "@/lib/utils/formatToUSD";

type CurrencyTextProps = {
  className?: string;
  value: number;
};

const CurrencyText = ({ className, value }: CurrencyTextProps) => {
  const color = value > 0 ? "text-green-600" : "text-red-600";

  return (
    <span className={`amount ${color} ${className} `}>
      {formatToUSD(value)}
    </span>
  );
};

export default CurrencyText;
