import { vi } from "vitest";

export const redirect = vi.fn();
export const getPathname = vi.fn();

export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const useRouter = vi.fn(() => routerMock);
export const usePathname = vi.fn(() => "/");

export function setMockPathname(pathname: string) {
  usePathname.mockReturnValue(pathname);
}

export function resetI18nNavigationMocks() {
  usePathname.mockReturnValue("/");
  useRouter.mockReturnValue(routerMock);
}

export function Link({
  href,
  children,
  ...props
}: React.ComponentProps<"a"> & { href: string }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
