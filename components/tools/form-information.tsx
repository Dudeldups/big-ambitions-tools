import { UseFormReturn } from "react-hook-form";
import { RadioButtonGroup } from "../radio-button-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { Translator } from "@/lib/types";
import { useAppState } from "@/lib/hooks/useAppState";
import { useAppStore } from "@/lib/stores/appStore";
import { PalletShelfField } from "./pallet-shelf-field";

type FormInformationProps = {
  form: UseFormReturn<FactoryFormValues>;
  openingHours: number;
  t: Translator;
};

const FormInformation = ({ form, openingHours, t }: FormInformationProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const calculationPeriod = useAppState((s) => s.calculationPeriod);
  const setCalculationPeriod = useAppStore((s) => s.setCalculationPeriod);

  return (
    <FieldSet className="@container/field-set grid px-4 @[38rem]:grid-cols-2">
      <FieldLegend className="col-span-full text-lg underline">
        Factory Information
      </FieldLegend>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Factory Name</FieldLabel>
          <Input
            id="name"
            autoComplete="off"
            maxLength={50}
            {...register("name")}
          />
          {errors.name?.message && (
            <FieldError>{t(errors.name.message as never)}</FieldError>
          )}
        </Field>

        <Field className="-mt-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            {...register("description")}
            maxLength={150}
          />
          {errors.description?.message && (
            <FieldError>{t(errors.description.message as never)}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="@md:@max-xl:flex-row @md:@max-xl:*:flex-1">
        <Field>
          <FieldLabel htmlFor="openingHours">Opening hours / day</FieldLabel>
          <div className="flex items-center gap-3">
            <Input
              className="max-w-20"
              id="openingHours"
              type="number"
              min={1}
              max={24}
              step={1}
              {...register("openingHours", { valueAsNumber: true })}
            />
            <span className="text-muted-foreground">
              {openingHours * 7}h / week
            </span>
          </div>
        </Field>

        <FieldSet>
          <FieldLegend>Calculation basis</FieldLegend>
          <RadioButtonGroup
            name="calculationPeriod"
            value={calculationPeriod}
            onChange={setCalculationPeriod}
            options={[
              {
                value: "hourly",
                label: t("general.calculationPeriodOptions.hourly"),
              },
              {
                value: "daily",
                label: t("general.calculationPeriodOptions.daily"),
              },
              {
                value: "weekly",
                label: t("general.calculationPeriodOptions.weekly"),
              },
            ]}
          />
        </FieldSet>
      </FieldGroup>

      <FieldGroup className="gap-4 @xl:col-span-2">
        <PalletShelfField control={control} errors={errors} />
      </FieldGroup>
    </FieldSet>
  );
};

export default FormInformation;
