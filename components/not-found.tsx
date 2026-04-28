import { SmartLink } from "./smart-link";

type NotFoundProps = {
  code?: string;
  title: string;
  desc?: string;
  link?: { href: string; label: string };
};

const NotFound = ({ code = "404", title, desc, link }: NotFoundProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-muted-foreground font-mono text-lg">{code}</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="text-muted-foreground">{desc}</p>}
      </div>
      {link && (
        <SmartLink
          href={link.href}
          className="hover:text-foreground text-muted-foreground text-sm underline underline-offset-4 transition-colors"
        >
          {link.label}
        </SmartLink>
      )}
    </div>
  );
};

export default NotFound;
