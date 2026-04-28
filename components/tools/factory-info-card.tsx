import { usePlaythroughState } from "@/lib/hooks/usePlaythroughState";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { Clock, Copy, Edit, GripVertical, TrendingUp } from "lucide-react";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { Factory, usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { deriveWeeklyIncome } from "@/lib/calculations/derivedFactoryData";
import CurrencyText from "../currency-text";
import TextSkeleton from "../cemetery/text-skeleton";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import DeleteDialog from "../delete-dialog";
import { toast } from "sonner";

type FactoryInfoCardProps = {
  factoryId: string;
  setDraggedFactoryId: React.Dispatch<React.SetStateAction<string | null>>;
};

const FactoryInfoCard = ({
  factoryId,
  setDraggedFactoryId,
}: FactoryInfoCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { activePlaythrough } = useActivePlaythrough();
  const factory = usePlaythroughState((s) => s.getFactoryById(factoryId));
  const deleteFactory = usePlaythroughStore((state) => state.deleteFactory);
  const setTemplateFactory = usePlaythroughStore(
    (state) => state.setTemplateFactory,
  );

  if (!factory || !activePlaythrough) return null;

  const groupedWorkstations = Object.values(
    factory.workstations.reduce(
      (acc, ws) => {
        if (!acc[ws.name]) {
          acc[ws.name] = { name: ws.name, count: 0 };
        }

        acc[ws.name].count += ws.amount;

        return acc;
      },
      {} as Record<string, { name: string; count: number }>,
    ),
  );

  const weeklyProfit = deriveWeeklyIncome([factory], activePlaythrough);

  const handleCopy = (factory: Factory) => {
    setTemplateFactory(factory);
    router.push(`/tools/${activePlaythrough.id}/factories/create`);
  };

  const onDelete = () => {
    const deleted = deleteFactory(factoryId, activePlaythrough.id);
    if (deleted) {
      toast.success(
        t("toasts.factoryDeleteSuccess", {
          factoryName: deleted.name,
        }),
        {
          position: "bottom-right",
        },
      );
    }

    router.push(`/tools/${activePlaythrough.id}/factories`);
  };

  return (
    <Card
      className="relative h-full border"
      draggable
      onDragStart={() => setDraggedFactoryId(factoryId)}
      onDragEnd={() => setDraggedFactoryId(null)}
    >
      <div className="absolute inset-s-[92%] inset-bs-2 z-20 flex size-5 cursor-grab items-center justify-center active:cursor-grabbing">
        <GripVertical />
      </div>

      <Link
        href={`/tools/${activePlaythrough.id}/factories/${factoryId}`}
        className={cn("absolute inset-0 z-0")}
        aria-label={factory.name}
      />

      <CardHeader>
        <h3 className="truncate text-lg font-semibold">{factory.name}</h3>
        {factory.description && (
          <p className="text-muted-foreground mt-2 truncate">
            {factory.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="mt-auto flex flex-row items-end justify-between gap-2">
        <div className="w-full">
          <ul className="mb-2">
            {groupedWorkstations.map((workstation) => (
              <li key={workstation.name}>
                <span>
                  {workstation.count}x {t(`workstations.${workstation.name}`)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-2" />

          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2">
              <Clock className="text-muted-foreground" />
              {factory.openingHours}h
            </span>

            <span className="flex items-center gap-1.5">
              <TrendingUp className="text-muted-foreground size-5 shrink-0" />
              <span className="text-foreground font-medium">
                {weeklyProfit !== null ? (
                  <CurrencyText value={weeklyProfit} hideCents />
                ) : (
                  <TextSkeleton />
                )}
              </span>
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="relative z-20"
            onClick={() => handleCopy(factory)}
          >
            <Copy className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            asChild
            className="relative z-20"
          >
            <Link
              href={`/tools/${activePlaythrough.id}/factories/${factoryId}/edit`}
            >
              <Edit className="size-5" />
            </Link>
          </Button>

          <DeleteDialog
            onDelete={onDelete}
            title={t("tools.factoryForm.deleteTitle")}
            description={t("tools.factoryForm.deleteDesc")}
            className="z-20"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FactoryInfoCard;
