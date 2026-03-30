import { X, Search } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  label?: string;
};

const SearchBar = ({
  value,
  onChange,
  placeholder,
  className,
  id = "search",
  label,
}: SearchBarProps) => {
  return (
    <form className={className} onSubmit={(e) => e.preventDefault()}>
      {label && (
        <Label htmlFor={id} className="sr-only">
          {label}
        </Label>
      )}

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />

        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="px-8"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-muted-foreground hocus:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
