import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Cloudflare no incluye optimización de imágenes en el plan gratuito.
  // Las imágenes se sirven ya optimizadas desde Supabase Storage / Unsplash.
  images: { unoptimized: true },
  // Las fotos se optimizan en el navegador, pero un formulario con varias
  // imágenes puede superar el límite por defecto de 1 MB de las server actions.
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
