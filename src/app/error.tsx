"use client";

import { ErrorContent } from "@/components/layout/error-content";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-dvh pt-20">
      <ErrorContent reset={reset} />
    </div>
  );
}
