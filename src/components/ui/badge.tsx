import type { ReactNode } from "react";

import type { PropertyStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Tone = "dark" | "glass" | "gold" | "sand" | "green" | "amber" | "slate";

const tones: Record<Tone, string> = {
  dark: "bg-deep text-cream",
  glass: "bg-white/90 text-ink backdrop-blur-sm shadow-sm",
  gold: "bg-gold-100 text-ink",
  sand: "bg-sand text-ink/80",
  green: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/15",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10",
};

export function Badge({
  children,
  tone = "sand",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: PropertyStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        meta.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}
