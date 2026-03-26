import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "../ui/card";

type FactoryInfoCardProps = {
  factoryId: string;
};

const FactoryInfoCard = ({ factoryId }: FactoryInfoCardProps) => {
  const t = useTranslations();
  const factory = usePlaythroughState((s) => s.getFactoryById(factoryId));

  if (!factory) return null;

  const groupedWorkstations = Object.values(
    factory.workstations.reduce(
      (acc, ws) => {
        if (!acc[ws.name]) {
          acc[ws.name] = { name: ws.name, count: 0 };
        }

        acc[ws.name].count += 1;

        return acc;
      },
      {} as Record<string, { name: string; count: number }>,
    ),
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <h3>{factory.name}</h3>
        {factory.description && <p>{factory.description}</p>}
      </CardHeader>
      <CardContent className="mt-auto">
        <p>Opening hours / week: {factory.openingHours * 7}h</p>
        <ul>
          {groupedWorkstations.map((workstation) => (
            <li key={workstation.name}>
              <p>
                {workstation.count}x {t(`workstations.${workstation.name}`)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FactoryInfoCard;
