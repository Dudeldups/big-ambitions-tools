"use client";

import ImporterTable from "@/components/tables/importer-table";
import { Link } from "@/i18n/navigation";
import { getShoppingList } from "@/lib/utils/getShoppingList";
import { useActiveFactory } from "@/lib/hooks/useActiveFactory";
import { useActivePlaythrough } from "@/lib/hooks/useActivePlaythrough";
import { useTranslations } from "next-intl";

const FactoryIdPage = () => {
  const t = useTranslations();
  const { activePlaythrough } = useActivePlaythrough();
  const { activeFactory } = useActiveFactory();

  // TODO add skeletons
  if (!activeFactory || !activePlaythrough) return null;

  const workstationAmount = activeFactory.workstations.reduce(
    (sum, ws) => sum + ws.amount,
    0,
  );

  const shoppingListData = getShoppingList(
    activeFactory,
    activePlaythrough.difficulty,
  );

  return (
    <div className="max-w-page mx-auto">
      <div>
        <h2>{activeFactory.name}</h2>
        {activeFactory.description && <p>{activeFactory.description}</p>}

        <dl>
          <dt>Opening hours</dt>
          <dd>{activeFactory.openingHours}</dd>

          <dt>Delivery period</dt>
          <dd>{activeFactory.deliveryPeriod}</dd>

          <dt>Workstation amount</dt>
          <dd>{workstationAmount}</dd>
        </dl>
      </div>
      <Link
        href={`/tools/${activePlaythrough.id}/factories/${activeFactory.id}/edit`}
      >
        Edit factory
      </Link>

      <div>
        <h2>Shopping list</h2>
        <p>This is what your factory needs to run at full capacity.</p>

        <div className="space-y-6">
          {shoppingListData.map((group) => (
            <ImporterTable key={group.importer} data={group} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactoryIdPage;
