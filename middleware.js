const API_BASE = "https://mobirays.voucherndeals.com";

const CRAWLER_UA =
  /facebookexternalhit|Facebot|facebookcatalog|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Pinterest|Discordbot|vkShare|SkypeUriPreview|Googlebot|bingbot|W3C_Validator/i;

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/product\/(\d+)/);
  if (!match) return;

  const ua = request.headers.get("user-agent") || "";
  if (!CRAWLER_UA.test(ua)) return;

  const productId = match[1];

  try {
    const res = await fetch(`${API_BASE}/api/v1/products/getProductById`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: Number(productId), is_visited: 0 }),
    });

    if (!res.ok) return;

    const json = await res.json();
    const product = json?.data;
    if (!product) return;

    const title = esc(`${product.name} - Full Specifications | Mobirays`);
    const description = esc(
      `${product.name} full specs, price, camera, battery, display and more on Mobirays.`,
    );
    const image = esc(product.image || "");
    const pageUrl = esc(`${url.origin}${url.pathname}`);

    return new Response(
      `<!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <title>${title}</title>
            <meta name="description" content="${description}" />
            <link rel="canonical" href="${pageUrl}" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Mobirays" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:image:alt" content="${title}" />
            <meta property="og:url" content="${pageUrl}" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />
            </head>
            <body>Redirecting to <a href="${pageUrl}">${title}</a>...</body>
        </html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch {
    return;
  }
}

export const config = {
  matcher: ["/product/:path*"],
};
