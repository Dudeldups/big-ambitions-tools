type InfoListProps = {
  title?: string;
  items: string[];
};

export const InfoList = ({ title, items }: InfoListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {title && <p>{title}</p>}

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="aria-hidden text-primary-light font-bold">-</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
