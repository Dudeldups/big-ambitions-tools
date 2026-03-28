"use client";

import CreateFactoryForm from "@/components/tools/create-factory-form";
import FactoryOverview from "@/components/tools/factory-overview";
import { FactoryFormValues, factorySchema } from "@/lib/schemas/factory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

const CreateFactoryPage = () => {
  const form = useForm<FactoryFormValues>({
    resolver: zodResolver(factorySchema),
    defaultValues: { workstations: [], openingHours: 24 },
  });

  const watchedValues = useWatch({ control: form.control });

  return (
    <div className="grid grid-cols-2 gap-8">
      <CreateFactoryForm form={form} />
      <FactoryOverview values={watchedValues} />
    </div>
  );
};

export default CreateFactoryPage;
