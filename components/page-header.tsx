import { cn } from "@/lib/utils";
import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";
import LanguageSelect from "./language-select";

const PageHeader = () => {
  return (
    <header className="flex justify-center py-4">
      <div
        className={cn(
          "max-w-page mx-4 flex w-full items-center justify-between rounded-lg px-4 py-3",
          "border-foreground/10 shadow-foreground/5 border shadow-md",
          "bg-background/20",
          "saturate-150 backdrop-blur-md",
          "from-accent/20 via-muted dark:via-muted/50 to-accent/20 bg-linear-150",
        )}
      >
        <nav>
          <ul className="flex flex-col gap-4 md:flex-row">
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
            <li>
              <NavLink href="/database">Database</NavLink>
            </li>
            <li>
              <NavLink href="/tools">Tools</NavLink>
            </li>
            <li>
              <NavLink href="/about">About</NavLink>
            </li>
            <li>
              <NavLink href="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex gap-4">
          <ThemeToggle />

          <LanguageSelect />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
