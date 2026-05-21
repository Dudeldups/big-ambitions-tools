import userEvent from "@testing-library/user-event";
import { setMockParams } from "@/__tests__/mocks/next-navigation";
import {
  renderWithIntl,
  screen,
  waitFor,
  within,
} from "@/__tests__/test-utils";
import messages from "@/messages/en.json";
import { products } from "@/lib/game/products";
import { FactoryFormValues } from "@/lib/schemas/factory";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { useFieldArray, useForm } from "react-hook-form";
import WorkstationSelects from "./workstation-selects";
import React from "react";

vi.mock("next/navigation", () => import("@/__tests__/mocks/next-navigation"));
vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => (
    <img {...props} alt={props.alt} />
  ),
}));

vi.mock("../price-index-popover", () => ({
  default: () => null,
}));

vi.mock("../ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({
    children,
    asChild,
    ...props
  }: React.ComponentProps<"button"> & { asChild?: boolean }) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, props);
    }

    return <button {...props}>{children}</button>;
  },
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../ui/select", async () => {
  const React = await import("react");

  const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
  }>({});

  return {
    Select: ({
      value,
      onValueChange,
      children,
    }: {
      value?: string;
      onValueChange?: (value: string) => void;
      children: React.ReactNode;
    }) => (
      <SelectContext.Provider value={{ value, onValueChange }}>
        <div>{children}</div>
      </SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <button type="button">{children}</button>
    ),
    SelectValue: ({ placeholder }: { placeholder?: string }) => {
      const { value } = React.useContext(SelectContext);
      return <span>{value ?? placeholder}</span>;
    },
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectGroup: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectLabel: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectItem: ({
      value,
      children,
    }: {
      value: string;
      children: React.ReactNode;
    }) => {
      const { onValueChange } = React.useContext(SelectContext);

      return (
        <button type="button" onClick={() => onValueChange?.(value)}>
          {children}
        </button>
      );
    },
  };
});

const productData = Object.entries(products).map(([key, value]) => ({
  name: key,
  ...value,
}));

function WorkstationSelectsHarness() {
  const form = useForm<FactoryFormValues>({
    defaultValues: {
      name: "Factory",
      description: "",
      openingHours: 10,
      shelfAmount: 2,
      employees: {
        deliveryDriver: { amount: 1, salary: 10 },
        hrManager: { amount: 0, salary: 10 },
        logisticsManager: { amount: 1, salary: 10 },
        purchasingAgent: { amount: 0, salary: 10 },
        factoryWorker: { amount: 1, salary: 10 },
      },
      vehicles: [{ name: "FreightTruckT1" }],
      workstations: [
        {
          amount: 1,
          name: "foodWorkstation",
          product: "burger",
          productionLimit: 100,
        },
      ],
    },
  });

  const { control, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workstations",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} data-testid={`workstation-${index}`}>
          <WorkstationSelects
            control={control}
            index={index}
            append={append}
            remove={remove}
            setValue={setValue}
            getValues={getValues}
            unregister={form.unregister}
            factoryWorkerSalary={10}
            openingHours={10}
            productData={productData}
          />
        </div>
      ))}
      <pre data-testid="form-values">
        {JSON.stringify(form.watch("workstations"), null, 2)}
      </pre>
    </div>
  );
}

function WorkstationSalesAmountHarness() {
  const form = useForm<FactoryFormValues>({
    defaultValues: {
      name: "Factory",
      description: "",
      openingHours: 10,
      shelfAmount: 2,
      employees: {
        deliveryDriver: { amount: 1, salary: 10 },
        hrManager: { amount: 0, salary: 10 },
        logisticsManager: { amount: 1, salary: 10 },
        purchasingAgent: { amount: 0, salary: 10 },
        factoryWorker: { amount: 1, salary: 10 },
      },
      vehicles: [{ name: "FreightTruckT1" }],
      workstations: [
        {
          amount: 1,
          name: "foodWorkstation",
          product: "burger",
          salesAmount: 100,
        },
      ],
    },
  });

  const { control, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workstations",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} data-testid={`sales-workstation-${index}`}>
          <WorkstationSelects
            control={control}
            index={index}
            append={append}
            remove={remove}
            setValue={setValue}
            getValues={getValues}
            unregister={form.unregister}
            factoryWorkerSalary={10}
            openingHours={10}
            productData={productData}
          />
        </div>
      ))}
      <pre data-testid="sales-form-values">
        {JSON.stringify(form.watch("workstations"), null, 2)}
      </pre>
    </div>
  );
}

describe("WorkstationSelects", () => {
  beforeEach(() => {
    const playthrough = usePlaythroughStore.getState().createPlaythrough({
      characterName: "Jordan",
      difficulty: "normal",
      gameVersion: "0.10",
    });
    usePlaythroughStore.setState({ _hasHydrated: true });
    setMockParams({ playthroughId: playthrough.id });
  });

  it("allows toggling the production limit after copying and changing the product", async () => {
    const user = userEvent.setup();
    renderWithIntl(<WorkstationSelectsHarness />);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(
      within(screen.getByTestId("workstation-1")).getByRole("checkbox", {
        name: messages.tools.factoryPlanner.workstations.useProductionLimit,
      }),
    ).toBeChecked();

    const pizzaButtons = within(
      screen.getByTestId("workstation-1"),
    ).getAllByRole("button", {
      name: /pizza/i,
    });
    await user.click(pizzaButtons[0]);

    expect(screen.getByTestId("form-values")).toHaveTextContent("pizza");

    await waitFor(() => {
      expect(
        within(screen.getByTestId("workstation-1")).getByRole("checkbox", {
          name: messages.tools.factoryPlanner.workstations.useProductionLimit,
        }),
      ).not.toBeChecked();
    });

    const checkbox = within(screen.getByTestId("workstation-1")).getByRole(
      "checkbox",
      {
        name: messages.tools.factoryPlanner.workstations.useProductionLimit,
      },
    );

    await user.click(checkbox);

    await waitFor(() => {
      expect(
        within(screen.getByTestId("workstation-1")).getByRole("checkbox", {
          name: messages.tools.factoryPlanner.workstations.useProductionLimit,
        }),
      ).toBeChecked();
      expect(
        within(screen.getByTestId("workstation-1")).getByLabelText(
          messages.tools.factoryPlanner.workstations.productionLimit,
        ),
      ).toBeEnabled();
    });
  });

  it("keeps the checkbox checked when the production limit input is cleared", async () => {
    const user = userEvent.setup();
    renderWithIntl(<WorkstationSelectsHarness />);

    const workstation = screen.getByTestId("workstation-0");
    const checkbox = within(workstation).getByRole("checkbox", {
      name: messages.tools.factoryPlanner.workstations.useProductionLimit,
    });
    const input = workstation.querySelector(
      "#workstationProductionLimit-0",
    ) as HTMLInputElement | null;

    expect(checkbox).toBeChecked();
    expect(input).not.toBeNull();

    await user.clear(input!);

    await waitFor(() => {
      expect(
        within(screen.getByTestId("workstation-0")).getByRole("checkbox", {
          name: messages.tools.factoryPlanner.workstations.useProductionLimit,
        }),
      ).toBeChecked();
      expect(screen.getByTestId("form-values")).toHaveTextContent(
        '"productionLimit": 0',
      );
    });
  });

  it("keeps estimated sales empty after clearing a previously saved value", async () => {
    const user = userEvent.setup();
    renderWithIntl(<WorkstationSalesAmountHarness />);

    const workstation = screen.getByTestId("sales-workstation-0");
    const input = within(workstation).getByLabelText(
      messages.tools.factoryPlanner.estimatedSales,
    ) as HTMLInputElement;

    expect(input).toHaveValue("100");

    await user.clear(input);

    await waitFor(() => {
      expect(input).toHaveValue("");
      expect(screen.getByTestId("sales-form-values")).not.toHaveTextContent(
        '"salesAmount": 100',
      );
    });
  });
});
