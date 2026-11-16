"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      data-public
      data-site-theme={theme}
      className="flex min-h-dvh flex-col bg-background text-foreground"
    >
      {children}
    </div>
  );
}
