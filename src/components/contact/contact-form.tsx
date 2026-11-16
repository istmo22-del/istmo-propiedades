"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import { whatsappLink } from "@/config/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const zone = String(data.get("zone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const lines = [
      `Hola, mi nombre es ${name || "—"}.`,
      interest ? `Me interesa: ${interest}.` : "",
      zone ? `Zona de interés: ${zone}.` : "",
      phone ? `Mi teléfono: ${phone}.` : "",
      message ? `\n${message}` : "",
    ].filter(Boolean);

    window.open(
      whatsappLink({ message: lines.join("\n") }),
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#1faa59]/10 text-[#188c49]">
          <MessageCircle className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl">Escríbenos</h2>
          <p className="mt-1 text-[12.5px] leading-5 text-muted">
            Completa los campos y se abrirá WhatsApp con tu mensaje listo para enviar.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">
            Nombre
          </label>
          <input id="contact-name" name="name" required className="field" placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="label">
            Teléfono o email
          </label>
          <input
            id="contact-phone"
            name="phone"
            className="field"
            placeholder="Cómo te contactamos"
          />
        </div>
        <div>
          <label htmlFor="contact-interest" className="label">
            Me interesa
          </label>
          <select id="contact-interest" name="interest" className="field" defaultValue="Comprar">
            <option>Comprar</option>
            <option>Alquilar</option>
            <option>Vender</option>
            <option>Invertir</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="contact-zone" className="label">
            Zona de interés
          </label>
          <input
            id="contact-zone"
            name="zone"
            className="field"
            placeholder="Ej. Boquete, Coronado…"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="label">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            className="field-textarea min-h-28"
            placeholder="Cuéntanos qué buscas: tipo de propiedad, presupuesto, habitaciones…"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1faa59] text-sm font-semibold text-white transition-colors hover:bg-[#188c49]"
      >
        <Send className="size-4" aria-hidden="true" />
        Abrir WhatsApp
      </button>

      {sent && (
        <p className="mt-3 text-center text-[12px] text-teal">
          Si no se abrió WhatsApp, escríbenos directamente desde los datos de contacto.
        </p>
      )}
    </form>
  );
}
