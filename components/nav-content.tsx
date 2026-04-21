import LanguageSelect from "./language-select";
import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";

type NavContentProps = {
  onAction?: () => void;
};

const NavContent = ({ onAction }: NavContentProps) => {
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Database",
      href: "/database",
    },
    {
      name: "Tools",
      href: "/tools",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <>
      <nav className="max-md:w-full">
        <ul className="flex flex-col items-end gap-4 max-md:w-full md:flex-row md:items-center">
          {links.map((link) => (
            <li key={link.href} className="max-md:w-full">
              <NavLink
                onClick={onAction}
                href={link.href}
                className="w-full max-md:text-lg"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-end gap-4 max-md:flex-col md:items-center">
        <ThemeToggle />

        <LanguageSelect />
      </div>
    </>
  );
};

export default NavContent;
