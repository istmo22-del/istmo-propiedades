import type { Post } from "@/lib/types";

/**
 * Artículos de ejemplo para el modo demostración (sin Supabase).
 * Al configurar Supabase se usan los artículos reales de la tabla posts.
 */
export const DEMO_POSTS: Post[] = [
  {
    id: "demo-post-extranjeros",
    slug: "comprar-casa-en-panama-extranjeros",
    title: "Comprar casa en Panamá siendo extranjero: lo que realmente importa",
    excerpt:
      "Qué puede comprar un extranjero, qué documentos pide el Registro Público y los tres errores que cuestan dinero.",
    content: `Panamá es uno de los países de la región donde un extranjero puede comprar propiedad con título pleno, sin necesidad de residencia ni de socios locales. La condición es simple: la propiedad debe estar titulada y libre de gravámenes.

## Qué puedes comprar

- Casas, apartamentos y terrenos con título en el Registro Público.
- Fincas y propiedades de playa tituladas.
- Propiedades en zonas francas y proyectos con régimen especial.

Hay excepciones que conviene revisar con un abogado: tierras dentro de ciertos límites fronterizos, territorios indígenas y propiedades sin título (derechos posesorios). En esos casos el proceso es distinto y el riesgo, mayor.

## Los documentos que te van a pedir

1. Pasaporte vigente.
2. Poder notarial si no estarás presente en la firma.
3. Estudio de título actualizado de la finca.
4. Paz y salvo municipal del inmueble.

## Los tres errores caros

1. **Comprar sin estudio de título.** Una finca puede tener hipotecas, servidumbres o herederos con derechos. El estudio cuesta poco comparado con el problema.
2. **Confiar en el área del anuncio.** Verifica que los metros coincidan con el catastro y con el plano.
3. **Pagar sin contrato escrito.** La promesa de compraventa debe detallar precio, plazos, penalidades y quién paga cada gasto de cierre.

Un abogado local revisa el título y redacta la escritura en español; el Registro Público inscribe la compra y desde ese momento eres el propietario. Si quieres, te acompañamos en el proceso con propiedades verificadas.`,
    cover_image: "/hero.jpg",
    status: "published",
    published_at: "2026-11-12T14:00:00Z",
    author_id: null,
    created_at: "2026-11-12T14:00:00Z",
    updated_at: "2026-11-12T14:00:00Z",
  },
  {
    id: "demo-post-boquete-coronado",
    slug: "boquete-o-coronado-donde-invertir",
    title: "Boquete o Coronado: dónde conviene invertir según tu plan",
    excerpt:
      "Montaña fresca o playa a una hora de la capital. Comparamos clima, precios, alquileres y estilo de vida.",
    content: `Son los dos mercados favoritos de quien busca salir de la ciudad, y no compiten entre sí: responden a estilos de vida distintos.

## Clima y entorno

Boquete está en las tierras altas de Chiriquí, a unos 1.200 metros. Mañanas frescas, tardes de lluvia en temporada verde y una comunidad de expatriados consolidada. Coronado, en la costa de Panamá Oeste, es calor de playa, brisa y acceso rápido por la Interamericana.

## Precios y oferta

En Boquete encuentras desde casas de campo hasta fincas productivas; la oferta es amplia y los precios varían mucho según la vista y el acceso. En Coronado dominan casas de playa, condominios con amenidades y terrenos cerca de la costa. La cercanía a la capital sostiene la demanda de alquiler durante todo el año.

## Alquileres

Boquete tiene demanda de alquiler amueblado por temporadas y por residentes extranjeros. Coronado tiene un mercado de alquiler más estable, con familias que trabajan en la capital y buscan casa de playa para fines de semana.

## Cuál elegir

- Si buscas clima fresco, comunidad de montaña y posibilidad de finca: **Boquete**.
- Si buscas playa, acceso a la ciudad y reventa más líquida: **Coronado**.

Lo que decide la inversión no es la zona, sino la propiedad: acceso, título limpio y servicios. Esa parte la revisamos nosotros.`,
    cover_image: "/about.jpg",
    status: "published",
    published_at: "2026-11-06T14:00:00Z",
    author_id: null,
    created_at: "2026-11-06T14:00:00Z",
    updated_at: "2026-11-06T14:00:00Z",
  },
  {
    id: "demo-post-promesa",
    slug: "revisar-antes-de-firmar-promesa-compraventa",
    title: "Qué revisar antes de firmar una promesa de compraventa",
    excerpt:
      "Una lista concreta para no heredar deudas, sorpresas de área ni gastos que no esperabas.",
    content: `La promesa de compraventa es el documento que más dinero mueve en una compra de propiedad, y el que más se firma sin leer con calma. Esta es la lista que usamos antes de recomendarte firmar.

## 1. Estudio de título

Pide el certificado del Registro Público y verifica: propietario actual, hipotecas, servidumbres y anotaciones. Un título con gravamen se negocia, no se ignora.

## 2. Área y linderos

Compara los metros del anuncio con el plano y con el catastro. Diferencias de área son comunes y afectan el precio.

## 3. Deudas del inmueble

Paz y salvo municipal de impuestos y de la administración del edificio. Si hay cuotas atrasadas, deben quedar saldadas antes del cierre.

## 4. Quién paga qué

La promesa debe decir con claridad: impuesto de transferencia, gastos notariales, registro y comisión. Sin eso, el cierre termina costando más de lo previsto.

## 5. Plazos y penalidades

Fecha límite para el cierre, qué pasa si el comprador se atrasa, qué pasa si el vendedor se arrepiente. Las penalidades protegen a ambas partes.

## 6. Entrega y estado del inmueble

Qué se queda con la casa: muebles, electrodomésticos, equipos. Haz un inventario firmado y fotos del estado en la entrega.

## 7. Salida del vendedor

Fecha de entrega de llaves y desocupación. Coordínala por escrito para evitar un cierre sin casa disponible.

Si estás por firmar una promesa, envíanosla y la revisamos contigo antes de que pongas tu firma.`,
    cover_image: null,
    status: "published",
    published_at: "2026-10-29T14:00:00Z",
    author_id: null,
    created_at: "2026-10-29T14:00:00Z",
    updated_at: "2026-10-29T14:00:00Z",
  },
];
