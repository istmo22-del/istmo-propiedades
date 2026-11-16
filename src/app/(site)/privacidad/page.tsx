import type { Metadata } from "next";

import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Cómo trata ${site.name} los datos que recibimos a través del sitio web.`,
  alternates: { canonical: "/privacidad" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="bg-sand/70 pt-32 pb-12 sm:pt-36">
        <div className="container-page">
          <p className="eyebrow text-gold">Legal</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.04]">Aviso de privacidad</h1>
          <p className="mt-4 text-[13px] text-muted">Última actualización: {new Date().getFullYear()}</p>
        </div>
      </header>

      <div className="container-page max-w-3xl py-14">
        <div className="space-y-8 text-[14px] leading-7 text-ink/75">
          <section>
            <h2 className="font-display text-2xl text-ink">1. Quiénes somos</h2>
            <p className="mt-2">
              {site.name} es un servicio de asesoría inmobiliaria con base en {site.address}.
              Puedes contactarnos en {site.email} o al {site.phone}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">2. Qué datos recibimos</h2>
            <p className="mt-2">
              Este sitio no requiere registro para navegar. Solo recibimos los datos que tú nos
              compartes voluntariamente cuando nos escribes por WhatsApp, teléfono o email:
              nombre, datos de contacto y la información que decidas incluir en tu mensaje.
            </p>
            <p className="mt-2">
              El sitio no utiliza cookies de publicidad ni herramientas de seguimiento de terceros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">3. Para qué los usamos</h2>
            <p className="mt-2">
              Usamos tus datos únicamente para responder tu consulta, enviarte opciones de
              propiedades que se ajusten a lo que buscas y coordinar visitas o trámites
              relacionados. No vendemos ni compartimos tu información con terceros ajenos a la
              operación inmobiliaria.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">4. Dónde se alojan</h2>
            <p className="mt-2">
              El sitio se aloja en Cloudflare y las propiedades se gestionan con Supabase. Las
              conversaciones de WhatsApp se rigen por la política de privacidad de WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">5. Tus derechos</h2>
            <p className="mt-2">
              Puedes solicitar acceso, corrección o eliminación de los datos que nos hayas
              compartido escribiendo a {site.email}. Atenderemos tu solicitud en un plazo
              razonable.
            </p>
          </section>

          <p className="rounded-xl bg-sand px-5 py-4 text-[12px] leading-6 text-muted">
            Este texto es una base informativa y debe revisarse con un asesor legal antes de
            publicar el sitio con fines comerciales.
          </p>
        </div>
      </div>
    </>
  );
}
