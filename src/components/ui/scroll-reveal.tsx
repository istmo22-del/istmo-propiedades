"use client";

import { useEffect } from "react";

/**
 * Revela los elementos con `data-reveal` al entrar en pantalla y anima los
 * contadores con `data-count-to`.
 *
 * - La animación es por tiempo (900 ms), no atada a la posición del scroll:
 *   se reproduce completa aunque el usuario baje rápido.
 * - Los estados se aplican recién cuando el usuario empieza a desplazarse.
 *   Así nunca se toca el DOM durante la hidratación de React y, si alguien
 *   no baja, ve todo el contenido sin esperas.
 * - Lo que ya está en pantalla no se oculta: solo se oculta lo que está por
 *   debajo, que en ese momento no se está viendo.
 * - Con "reducir movimiento" activo no se oculta nada.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const registered = new WeakSet<Element>();
    const animatedCounters = new WeakSet<HTMLElement>();
    const frames = new Set<number>();
    const cleanups: Array<() => void> = [];
    const numberFormat = new Intl.NumberFormat("es-PA");

    let observer: IntersectionObserver | null = null;
    let initialized = false;
    let disposed = false;

    const animateCount = (element: HTMLElement) => {
      const target = Number(element.dataset.countTo);
      if (!Number.isFinite(target) || animatedCounters.has(element)) return;
      animatedCounters.add(element);

      let start: number | null = null;
      let frame = 0;

      const step = (now: number) => {
        if (start === null) start = now;
        const progress = Math.min((now - start) / 900, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        if (progress < 1) {
          element.textContent = numberFormat.format(Math.round(target * eased));
          frame = requestAnimationFrame(step);
          frames.add(frame);
        } else {
          element.textContent = numberFormat.format(target);
          frames.delete(frame);
        }
      };

      frame = requestAnimationFrame(step);
      frames.add(frame);
    };

    const prepare = (element: Element) => {
      if (!observer || registered.has(element)) return;
      registered.add(element);

      const isCounter =
        element instanceof HTMLElement && element.hasAttribute("data-count-to");

      // Ya visible (o por encima de la pantalla): se deja como está.
      if (element.getBoundingClientRect().top < window.innerHeight) {
        if (isCounter) animateCount(element as HTMLElement);
        return;
      }

      if (!isCounter) element.setAttribute("data-reveal-state", "hidden");
      observer.observe(element);
    };

    const init = () => {
      if (initialized || disposed) return;
      initialized = true;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.unobserve(entry.target);

            const element = entry.target;
            if (
              element instanceof HTMLElement &&
              element.hasAttribute("data-count-to")
            ) {
              animateCount(element);
            } else {
              element.setAttribute("data-reveal-state", "visible");
            }
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
      );

      document
        .querySelectorAll("[data-reveal], [data-count-to]")
        .forEach(prepare);

      // Cubre filtros, paginación y navegación del cliente.
      const mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches("[data-reveal], [data-count-to]")) prepare(node);
            node
              .querySelectorAll("[data-reveal], [data-count-to]")
              .forEach(prepare);
          });
        }
      });

      mutations.observe(document.body, { childList: true, subtree: true });

      // Si un salto de scroll dejó un elemento atrás sin intersectar, se
      // muestra al terminar el scroll. No anima: ya pasó de largo.
      let scrollTimer = 0;
      const onScrollEnd = () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          document
            .querySelectorAll('[data-reveal-state="hidden"]')
            .forEach((element) => {
              if (element.getBoundingClientRect().top < 0) {
                element.setAttribute("data-reveal-state", "visible");
                observer?.unobserve(element);
              }
            });
        }, 140);
      };

      window.addEventListener("scroll", onScrollEnd, { passive: true });

      cleanups.push(() => {
        window.clearTimeout(scrollTimer);
        window.removeEventListener("scroll", onScrollEnd);
        mutations.disconnect();
      });
    };

    // Se dispara con la primera interacción real del usuario (rueda, touch,
    // teclado o scroll). Así el DOM no se toca durante la hidratación de React
    // y quien no baja ve todo el contenido sin esperas.
    window.addEventListener("wheel", init, { passive: true });
    window.addEventListener("touchstart", init, { passive: true });
    window.addEventListener("keydown", init);
    window.addEventListener("scroll", init, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("wheel", init);
      window.removeEventListener("touchstart", init);
      window.removeEventListener("keydown", init);
      window.removeEventListener("scroll", init);
      frames.forEach((frame) => cancelAnimationFrame(frame));
      cleanups.forEach((cleanup) => cleanup());
      observer?.disconnect();
    };
  }, []);

  return null;
}
