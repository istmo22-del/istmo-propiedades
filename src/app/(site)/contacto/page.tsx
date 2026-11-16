import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { site } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos para comprar, vender o alquilar una propiedad en Panamá. Atención directa por WhatsApp, teléfono o email.",
  alternates: { canonical: "/contacto" },
};

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.phone,
    href: `https://wa.me/${site.whatsapp}`,
    note: "La forma más rápida",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: site.phone,
    href: site.phoneHref,
    note: "Lun–Vie 9:00–18:00",
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Respuesta en 24 h",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: site.address,
    note: "Visitas con cita previa",
  },
];

export default function ContactPage() {
  return (
    <>
      <header className="bg-sand/70 pt-32 pb-14 sm:pt-36">
        <div className="container-page">
          <p className="eyebrow text-gold">Contacto</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl leading-[1.04] sm:text-6xl">
            Hablemos de tu próxima propiedad.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted">
            Sin formularios que se pierden en el olvido. Elige el canal que prefieras y
            tendrás respuesta de una persona real.
          </p>
        </div>
      </header>

      <div className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => {
                const content = (
                  <>
                    <span className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal">
                      <channel.icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="mt-4 block text-[10.5px] font-semibold tracking-[0.14em] text-muted uppercase">
                      {channel.label}
                    </span>
                    <span className="mt-1.5 block text-[14px] font-semibold text-ink">
                      {channel.value}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-muted">{channel.note}</span>
                  </>
                );

                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={channel.label} className="rounded-2xl border border-line bg-white p-5">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl bg-deep p-6 text-cream">
              <p className="eyebrow text-gold">Horario de atención</p>
              <p className="mt-2 font-display text-2xl">{site.hours}</p>
              <p className="mt-3 flex items-center gap-2 text-[12.5px] text-cream/65">
                <Clock className="size-4 text-gold" aria-hidden="true" />
                Fuera de horario, déjanos un WhatsApp y respondemos al día siguiente.
              </p>
            </div>

            <div className="mt-8 space-y-3 text-[13px] leading-6 text-muted">
              <p>
                <strong className="font-semibold text-ink">¿Quieres vender o alquilar?</strong>{" "}
                También trabajamos con propietarios. Cuéntanos sobre tu propiedad y coordinamos
                una valoración sin compromiso.
              </p>
              <p>
                <strong className="font-semibold text-ink">¿Estás fuera del país?</strong>{" "}
                Podemos hacer recorridos por video y revisar documentos a distancia.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
