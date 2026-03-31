type CurrencyTextProps = {
  children: React.ReactNode;
  className?: string;
  color: "green" | "red";
};

const CurrencyText = ({ children, className, color }: CurrencyTextProps) => {
  return (
    <span
      className={`amount ${className} ${color === "green" ? "text-green-600" : "text-red-600"}`}
    >
      {children}
    </span>
  );
};

export default CurrencyText;
