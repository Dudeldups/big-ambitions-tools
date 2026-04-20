import { cn } from "@/lib/utils";
import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";

const PageHeader = () => {
  return (
    <header className="flex justify-center py-4">
      <div
        className={cn(
          "max-w-page border-border flex w-full items-center justify-between rounded-lg border px-4 py-3",
          "from-card to-card via-accent/80 bg-linear-150 from-15% via-50% to-85%",
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

        <ThemeToggle />
      </div>
    </header>
  );
};

export default PageHeader;
