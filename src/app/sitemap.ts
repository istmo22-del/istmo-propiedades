import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getAllPublishedPostSlugs } from "@/lib/posts";
import { getAllPublishedSlugs } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    getAllPublishedSlugs(),
    getAllPublishedPostSlugs(),
  ]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/propiedades`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${site.url}/propiedades/${property.slug}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...postPages];
}
