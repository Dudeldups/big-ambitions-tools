import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import React from "react";

interface SmartLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string;
}

export const SmartLink = ({
  className,
  children,
  href,
  ...props
}: SmartLinkProps) => {
  const isExternal = href.startsWith("http");
  const combinedClassName = cn("link", className);

  if (isExternal) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const { prefetch, scroll, locale, ...externalProps } = props as any;

    return (
      <a
        href={href}
        className={combinedClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...externalProps}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
};
