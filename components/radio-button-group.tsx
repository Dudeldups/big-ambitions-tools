import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

type RadioOption<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type RadioButtonGroupProps<T extends string> = {
  name: string;
  value: T | null | undefined;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  className?: string;
};

export function RadioButtonGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  className,
}: RadioButtonGroupProps<T>) {
  return (
    <ButtonGroup className={cn(className)} role="radiogroup">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Button
            key={option.value}
            asChild
            variant={isActive ? "secondary" : "outline"}
            className="has-focus-visible:focus-ring capitalize"
          >
            <label htmlFor={option.value} className="cursor-pointer">
              <input
                type="radio"
                id={option.value}
                name={name}
                value={option.value}
                checked={isActive}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
