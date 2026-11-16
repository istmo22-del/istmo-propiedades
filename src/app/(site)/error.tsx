"use client";

import { ErrorContent } from "@/components/layout/error-content";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorContent reset={reset} />;
}
