import type { APIRoute } from "astro";
import { getAffiliateOffer } from "@/data/affiliateOffers";
import { trackOutboundClick } from "@/lib/analytics";

export const prerender = false;

export const GET: APIRoute = async ({ locals, params, request }) => {
  const carrierSlug = params.carrier;

  if (!carrierSlug) {
    return new Response("Missing carrier", { status: 400 });
  }

  const offer = getAffiliateOffer(carrierSlug);

  if (!offer) {
    return new Response("Unknown affiliate partner", { status: 404 });
  }

  const sourcePath = new URL(request.url).pathname;

  await trackOutboundClick(locals, {
    carrierSlug,
    carrierName: offer.carrierName,
    destinationUrl: offer.destinationUrl,
    sourcePath,
    cookieHeader: request.headers.get("cookie") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined
  });

  return Response.redirect(offer.destinationUrl, 302);
};
