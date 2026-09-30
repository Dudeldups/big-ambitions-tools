import DatabaseDetailModal from "@/components/database/database-detail-modal";
import DatabaseItemDetail from "@/components/database/database-item-detail";
import { isWorkstationName } from "@/lib/game/machineNames";
import { notFound } from "next/navigation";

export { generateMetadata } from "../../../workstations/[workstationName]/page";

export default async function WorkstationDetailModal({
  params,
}: {
  params: Promise<{ workstationName: string }>;
}) {
  const { workstationName } = await params;
  if (!isWorkstationName(workstationName)) notFound();

  return (
    <DatabaseDetailModal kind="workstation" itemName={workstationName}>
      <DatabaseItemDetail kind="workstation" name={workstationName} inDialog />
    </DatabaseDetailModal>
  );
}
