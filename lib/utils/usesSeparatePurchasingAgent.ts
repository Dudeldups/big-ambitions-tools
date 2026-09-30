import { FactoryFormValues } from "../schemas/factory";

export const usesSeparatePurchasingAgent = (
  factory: Pick<FactoryFormValues, "employees">,
): boolean => factory.employees.purchasingAgent.amount > 0;
