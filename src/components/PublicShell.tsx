"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      data-public
      data-site-theme={theme}
      className={`site-shell relative flex min-h-dvh flex-col bg-background text-foreground ${
        theme === "light" ? "site-shell-light" : "site-shell-dark"
      }`}
    >
      {theme === "light" ? (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#fff8ee_0%,_#f3efe6_45%,_#ebe4d8_100%)]" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute right-0 top-[30%] h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-100/40 blur-3xl" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
