"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SORT_LABELS } from "@/lib/constants";
import type { SortOption } from "@/lib/types";

export function SortSelect({ value }: { value: SortOption }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", nextValue);
    }
    params.delete("page");
    router.push(`${pathname}${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  return (
    <label className="flex items-center gap-2 text-[12.5px] text-muted">
      <span className="hidden sm:inline">Ordenar por</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-full border border-line bg-white pr-8 pl-3.5 text-[12.5px] font-semibold text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
      >
        {Object.entries(SORT_LABELS).map(([sortValue, label]) => (
          <option key={sortValue} value={sortValue}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
