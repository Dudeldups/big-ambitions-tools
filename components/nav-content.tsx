import { GLOSSARY } from "@/i18n/glossary";
import LanguageSelect from "./language-select";
import NavLink from "./nav-link";
import ThemeToggle from "./theme-toggle";
import { useTranslations } from "next-intl";

type NavContentProps = {
  onAction?: () => void;
};

const NavContent = ({ onAction }: NavContentProps) => {
  const tGeneral = useTranslations("general");

  const links = [
    {
      name: tGeneral("home"),
      href: "/",
    },
    {
      name: tGeneral("database"),
      href: "/database",
    },
    {
      name: GLOSSARY.toolsSection,
      href: "/tools",
    },
    {
      name: tGeneral("about"),
      href: "/about",
    },
    {
      name: tGeneral("contact"),
      href: "/contact",
    },
  ];

  return (
    <>
      <nav className="max-md:w-full" aria-label="main navigation">
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
