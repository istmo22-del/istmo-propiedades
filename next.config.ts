import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Cloudflare no incluye optimización de imágenes en el plan gratuito.
  // Las imágenes se sirven ya optimizadas desde Supabase Storage / Unsplash.
  images: { unoptimized: true },
  // sharp es un módulo nativo: debe quedar fuera del bundle del servidor.
  serverExternalPackages: ["sharp"],
  // Cada foto viaja en su propia petición (~200 KB). El límite de 6 MB cubre
  // el caso raro de una imagen que el navegador no pudo reducir.
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
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
