import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const imageCircleBgVariants = cva("", {
  variants: {
    variant: {
      primary: "text-primary bg-primary-foreground",
      primaryInverted: "text-primary-foreground bg-primary",
      secondary: "text-brand-secondary bg-brand-secondary-foreground",
      secondaryInverted: "text-brand-secondary-foreground bg-brand-secondary",
      accent: "text-accent bg-accent-foreground",
      accentInverted: "text-accent-foreground bg-accent",
      foreground: "text-foreground bg-background",
      foregroundInverted: "text-background bg-foreground",
    },
    size: {
      sm: "p-3 *:size-8",
      md: "p-4 *:size-10",
      lg: "p-4 *:size-12",
      xl: "p-5 *:size-14",
      "2xl": "p-7 *:size-20",
    },
  },
  defaultVariants: {
    variant: "foreground",
    size: "md",
  },
});

type ImageCircleBgProps = VariantProps<typeof imageCircleBgVariants> & {
  className?: string;
  children: React.ReactNode;
};

const ImageCircleBg = ({
  className,
  children,
  variant,
  size,
}: ImageCircleBgProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-6",
        imageCircleBgVariants({ variant, size }),
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ImageCircleBg;
