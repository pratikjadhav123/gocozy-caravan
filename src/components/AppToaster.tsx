"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/ThemeProvider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      expand
      duration={3500}
      toastOptions={{
        classNames: {
          toast: "border border-white/10 bg-charcoal-light text-foreground shadow-xl",
          title: "text-sm font-semibold",
          description: "text-xs text-zinc-400",
          success: "border-gold/30",
          error: "border-red-400/30",
          actionButton: "bg-gold text-charcoal",
          cancelButton: "bg-white/10 text-zinc-200",
          closeButton: "border-white/15 bg-charcoal text-zinc-300",
        },
      }}
    />
  );
}
