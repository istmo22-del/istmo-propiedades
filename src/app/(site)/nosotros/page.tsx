import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, MessageCircle } from "lucide-react";

import { site, whatsappLink } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce cómo trabajamos: asesoría inmobiliaria directa, propiedades verificadas y acompañamiento de principio a fin en Panamá.",
  alternates: { canonical: "/nosotros" },
};

const principles = [
  {
    title: "Conocemos el terreno",
    text: "Antes de recomendar una zona, la recorremos. Sabemos cómo se llega, qué servicios hay y cómo es la vida allí en temporada de lluvias y en verano.",
  },
  {
    title: "Información sin adornos",
    text: "Publicamos fotos reales y datos verificados. Si algo tiene una limitación, lo decimos desde el principio para que no pierdas tiempo.",
  },
  {
    title: "Un solo interlocutor",
    text: "Desde la primera consulta hasta la entrega de llaves hablas con la misma persona. Sin call centers, sin respuestas automáticas.",
  },
];

const steps = [
  {
    title: "Conversamos",
    text: "Nos cuentas qué buscas, cuál es tu presupuesto y qué es innegociable para ti.",
  },
  {
    title: "Seleccionamos",
    text: "Filtramos el portafolio y te enviamos solo las opciones que realmente encajan.",
  },
  {
    title: "Visitamos y cerramos",
    text: "Coordinamos visitas, revisamos documentos y te acompañamos hasta la firma.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="bg-sand/70 pt-32 pb-14 sm:pt-36">
        <div className="container-page">
          <p className="eyebrow text-gold">Quiénes somos</p>
          <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl leading-[1.04] sm:text-6xl">
            Un socio local para decisiones importantes.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-muted">
            {site.name} nace para simplificar la compra, venta y alquiler de propiedades en
            Panamá. Menos ruido, más información útil y una persona real al otro lado.
          </p>
        </div>
      </header>

      <div className="container-page">
        <div className="mt-10 overflow-hidden rounded-[2rem]">
          <img
            src="/about.jpg"
            alt="Villa con piscina en Panamá"
            className="aspect-[21/9] w-full object-cover"
          />
        </div>

        <section className="mx-auto mt-20 grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-gold">Nuestra mirada</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.1]">
              El mercado inmobiliario puede ser ruidoso. Nosotros preferimos ser claros.
            </h2>
          </div>
          <div className="space-y-5 text-[14.5px] leading-7 text-ink/75">
            <p>
              Panamá ofrece algo difícil de encontrar en otros lugares: playas a una hora de la
              ciudad, montañas con clima fresco, ciudad cosmopolita y un interior tranquilo. Pero
              elegir bien depende de detalles que no aparecen en un anuncio: accesos, servicios,
              humedad, plusvalía y estilo de vida.
            </p>
            <p>
              Por eso trabajamos con un portafolio acotado y curado. Preferimos conocer a fondo
              cada propiedad antes que publicar cientos de fichas repetidas. Así podemos darte
              una opinión honesta, incluso cuando la respuesta es “esta no es para ti”.
            </p>
            <p>
              Nuestra recompensa es que vuelvas a recomendarnos. Ese es el tipo de negocio que
              queremos construir.
            </p>
          </div>
        </section>

        <section className="mt-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">Cómo trabajamos</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.1]">Tres pasos, sin vueltas.</h2>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="font-display text-4xl text-gold/70">0{index + 1}</span>
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-24 grid gap-10 border-t border-line pt-16 md:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title}>
              <span className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-2xl">{principle.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-muted">{principle.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-24 rounded-[2rem] bg-deep px-6 py-14 text-cream sm:px-12 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-gold">Siguiente paso</p>
              <h2 className="mt-3 max-w-xl text-balance font-display text-4xl leading-[1.08] sm:text-5xl">
                Cuéntanos qué estás buscando.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-cream/70">
                Ya sea una casa para tu familia, un apartamento para invertir o una finca para
                escapar de la ciudad, empecemos por una conversación.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink
                href={whatsappLink({
                  message: "Hola, quisiera conversar sobre una propiedad en Panamá.",
                })}
                external
                variant="gold"
                size="lg"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Escribir por WhatsApp
              </ButtonLink>
              <ButtonLink
                href="/propiedades"
                variant="outline"
                size="lg"
                className="border-white/25 text-cream hover:border-white/45 hover:bg-white/10"
              >
                Ver propiedades
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>

        <div className="py-16 text-center">
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-teal hover:underline"
          >
            Ver todos los canales de contacto
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
