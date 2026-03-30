const env = process.env.NODE_ENV ?? "development";

export const isDev = env === "development";
export const isProd = env === "production";

export const safeLog = (...args: Parameters<typeof console.log>) => {
  if (isDev) {
    console.log(...args);
  }
};

export const safeInfo = (...args: Parameters<typeof console.info>) => {
  if (isDev) {
    console.info(...args);
  }
};

export const safeWarn = (...args: Parameters<typeof console.warn>) => {
  if (isDev) {
    console.warn(...args);
  }
};

export const safeError = (...args: Parameters<typeof console.error>) => {
  if (isDev) {
    console.error(...args);
  }
};
