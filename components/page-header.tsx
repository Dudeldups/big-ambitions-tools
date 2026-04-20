import { cn } from "@/lib/utils";
import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";

const PageHeader = () => {
  return (
    <header className="flex justify-center py-4">
      <div
        className={cn(
          "max-w-page flex w-full items-center justify-between rounded-lg px-4 py-3",
          "border-foreground/10 shadow-foreground/5 border shadow-md",
          "bg-background/20",
          "saturate-150 backdrop-blur-md",
          "from-accent/20 via-muted dark:via-muted/50 to-accent/20 bg-linear-150",
        )}
      >
        <nav>
          <ul className="flex flex-col gap-4 md:flex-row">
            <li>
              <Button asChild variant="outline">
                <NavLink href="/">Home</NavLink>
              </Button>
            </li>
            <li>
              <Button asChild variant="outline">
                <NavLink href="/database">Database</NavLink>
              </Button>
            </li>
            <li>
              <Button asChild variant="outline">
                <NavLink href="/tools">Tools</NavLink>
              </Button>
            </li>
            <li>
              <Button asChild variant="outline">
                <NavLink href="/about">About</NavLink>
              </Button>
            </li>
            <li>
              <Button asChild variant="outline">
                <NavLink href="/contact">Contact</NavLink>
              </Button>
            </li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default PageHeader;
