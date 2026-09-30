import DatabaseItemDetail from "@/components/database/database-item-detail";
import DatabaseDetailPage from "@/components/database/database-detail-page";
import { isWorkstationName } from "@/lib/game/machineNames";
import { generateDatabaseDetailMetadata } from "@/lib/generateDatabaseDetailMetadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type WorkstationDetailRouteProps = {
  params: Promise<{ locale: string; workstationName: string }>;
};

export async function generateMetadata({
  params,
}: WorkstationDetailRouteProps): Promise<Metadata> {
  const { locale, workstationName } = await params;
  if (!isWorkstationName(workstationName)) return {};

  return generateDatabaseDetailMetadata({
    locale,
    kind: "workstation",
    name: workstationName,
  });
}

export default async function WorkstationDetailPage({
  params,
}: WorkstationDetailRouteProps) {
  const { workstationName } = await params;
  if (!isWorkstationName(workstationName)) notFound();

  return (
    <DatabaseDetailPage kind="workstation">
      <DatabaseItemDetail kind="workstation" name={workstationName} />
    </DatabaseDetailPage>
  );
}
