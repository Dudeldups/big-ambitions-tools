import { Link } from "@/i18n/navigation";

type StatBadgeProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  href?: string;
};

export const StatBadge = ({ icon, value, label, href }: StatBadgeProps) => {
  const content = (
    <div className="border-muted-foreground hover:bg-accent/10 flex items-center gap-1.5 rounded-md border bg-transparent p-1.5 transition-colors">
      {icon}
      <span className="whitespace-nowrap">
        <span className="text-foreground font-semibold">{value}</span>{" "}
        <span className="opacity-80">{label}</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
