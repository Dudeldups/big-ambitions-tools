// Import global styles and fonts
import "./[locale]/globals.css";
import type { Metadata } from "next";
import RootLayout from "./[locale]/layout";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <RootLayout>
      <div className="flex w-full items-center justify-center">
        <h1>404 - Page Not Found</h1>
        <p>This page does not exist.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="underline">
          Go back home
        </a>
      </div>
    </RootLayout>
  );
}
