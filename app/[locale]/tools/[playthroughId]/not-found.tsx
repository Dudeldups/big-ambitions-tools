import { Link } from "@/i18n/navigation";

// TODO: translations

const PlaythroughNotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Playthrough not found
        </h1>
        <p className="text-muted-foreground">
          This playthrough doesn&apos;t exist or may have been deleted.
        </p>
      </div>
      <Link
        href="/tools"
        className="hover:text-foreground text-muted-foreground text-sm underline underline-offset-4 transition-colors"
      >
        Back to playthroughs
      </Link>
    </div>
  );
};

export default PlaythroughNotFound;
