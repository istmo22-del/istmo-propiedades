import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminMobileBar, AdminSidebar } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Panel",
    template: "%s · Panel",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  if (configured && !user) redirect("/admin/login");

  const demo = !configured;
  const email = user?.email ?? "demo@istmo.local";

  return (
    <div className="min-h-dvh bg-sand lg:grid lg:grid-cols-[256px_1fr]">
      <AdminSidebar email={email} demo={demo} />
      <div className="flex min-w-0 flex-col">
        <AdminMobileBar demo={demo} />
        {demo && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-[11.5px] text-amber-900">
            Modo demostración con datos de ejemplo. Configura Supabase para guardar cambios.
          </div>
        )}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
