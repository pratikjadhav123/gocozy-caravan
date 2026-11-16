"use client";

import { Toaster } from "sonner";

/** Admin CRM always uses dark toast styling, independent of public site theme. */
export function AdminToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      closeButton
      expand
      duration={3500}
      toastOptions={{
        classNames: {
          toast: "border border-white/10 bg-[#252525] text-zinc-100 shadow-xl",
          title: "text-sm font-semibold",
          description: "text-xs text-zinc-400",
          success: "border-yellow-500/30",
          error: "border-red-400/30",
          actionButton: "bg-[#e8b923] text-[#1a1a1a]",
          cancelButton: "bg-white/10 text-zinc-200",
          closeButton: "border-white/15 bg-[#1a1a1a] text-zinc-300",
        },
      }}
    />
  );
}
