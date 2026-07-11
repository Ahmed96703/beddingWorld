import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  /** Canonical path, e.g. "/category/bedding" */
  path?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
}

const SITE = "LINÉA";
const BASE_DESC =
  "Premium bedding, bath, and home textiles, thoughtfully made for everyday comfort. Cash on delivery available.";

/** Create-or-update a <meta> tag keyed by name or property. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Dependency-free per-page SEO: sets a unique <title>, meta description, and
 * Open Graph / Twitter tags imperatively. Keep a single <h1> in the page body.
 */
export function Seo({
  title,
  description = BASE_DESC,
  image,
  path,
  type = "website",
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE) ? title : `${title} · ${SITE}`;
    const url = `${window.location.origin}${path ?? window.location.pathname}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setLink("canonical", url);
    setMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");

    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);

    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);

    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    }
  }, [title, description, image, path, type, noindex]);

  return null;
}
