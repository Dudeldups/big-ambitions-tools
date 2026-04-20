import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";

const PageHeader = () => {
  return (
    <header className="flex justify-center">
      <div className="max-w-page bg-accent flex w-full items-center justify-between px-4 py-5">
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
