import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/config/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex items-center gap-0 rounded-full bg-[#1faa59] p-4 text-white shadow-[0_10px_30px_-8px_rgba(16,33,31,0.45)] transition-all hover:bg-[#188c49] sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:ml-2 group-hover:max-w-40">
        Escríbenos
      </span>
    </a>
  );
}
