export type OutboundClickEvent = {
  carrierSlug: string;
  carrierName: string;
  destinationUrl: string;
  sourcePath: string;
  userAgent?: string;
};

type AnalyticsProvider = "plausible" | "ga4" | "none";

function getEnv(context: App.Locals, key: string): string | undefined {
  const runtime = context.runtime?.env as Record<string, string | undefined> | undefined;
  return runtime?.[key] ?? import.meta.env[key];
}

function getProvider(context: App.Locals): AnalyticsProvider {
  const configured = getEnv(context, "ANALYTICS_PROVIDER")?.toLowerCase();

  if (configured === "ga4" || configured === "none") {
    return configured;
  }

  return "plausible";
}

async function withTimeout(fetcher: (signal: AbortSignal) => Promise<Response>, milliseconds = 1200) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);

  try {
    return await fetcher(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

async function trackPlausibleClick(context: App.Locals, event: OutboundClickEvent) {
  const domain = getEnv(context, "PLAUSIBLE_DOMAIN") ?? "petinsurancegenius.com";
  const apiHost = getEnv(context, "PLAUSIBLE_API_HOST") ?? "https://plausible.io";

  await withTimeout((signal) =>
    fetch(`${apiHost.replace(/\/$/, "")}/api/event`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": event.userAgent ?? "petinsurancegenius.com"
      },
      body: JSON.stringify({
        name: "Affiliate Outbound Click",
        url: `https://${domain}${event.sourcePath}`,
        domain,
        props: {
          carrier_slug: event.carrierSlug,
          carrier_name: event.carrierName,
          network: "redirect",
          destination_host: new URL(event.destinationUrl).hostname
        }
      })
    })
  );
}

async function trackGa4Click(_context: App.Locals, _event: OutboundClickEvent) {
  // GA4 is intentionally behind the same interface and can be enabled when funnel depth is needed.
}

export async function trackOutboundClick(context: App.Locals, event: OutboundClickEvent) {
  try {
    const provider = getProvider(context);

    if (provider === "none") {
      return;
    }

    if (provider === "ga4") {
      await trackGa4Click(context, event);
      return;
    }

    await trackPlausibleClick(context, event);
  } catch {
    // Redirects must not fail because analytics is temporarily unavailable.
  }
}
