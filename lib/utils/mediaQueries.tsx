import dynamic from "next/dynamic";

const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
};

export const Mobile = ({ children }: { children: React.ReactNode }) => (
  <MediaQuery query={`(width < ${breakpoints.md})`}>{children}</MediaQuery>
);

export const TabletToLg = ({ children }: { children: React.ReactNode }) => (
  <MediaQuery
    query={`(width >= ${breakpoints.md}) and (width < ${breakpoints.lg})`}
  >
    {children}
  </MediaQuery>
);

export const TabletToXl = ({ children }: { children: React.ReactNode }) => (
  <MediaQuery
    query={`(width >= ${breakpoints.md}) and (width < ${breakpoints.xl})`}
  >
    {children}
  </MediaQuery>
);

export const DesktopLg = ({ children }: { children: React.ReactNode }) => (
  <MediaQuery minWidth={breakpoints.lg}>{children}</MediaQuery>
);

export const DesktopXl = ({ children }: { children: React.ReactNode }) => (
  <MediaQuery minWidth={breakpoints.xl}>{children}</MediaQuery>
);
