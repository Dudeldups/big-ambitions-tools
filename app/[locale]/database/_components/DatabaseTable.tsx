import { TableType } from "@/lib/game/types";
import { useTranslations } from "next-intl";

type Props = {
  children: React.ReactNode;
  tableType: TableType;
};

const DatabaseTable = ({ tableType, children }: Props) => {
  const t = useTranslations("database.table");
  const captionKey = `${tableType}.caption`;

  return (
    <table className="w-full border-collapse bg-gray-800 [&_td,&_th]:border-2 [&_td,&_th]:border-gray-600 [&_td,&_th]:px-3 [&_td,&_th]:py-1">
      <caption className="p-5">{t(captionKey)}</caption>
      {children}
    </table>
  );
};

export default DatabaseTable;
