export type AffiliateOffer = {
  carrierSlug: string;
  carrierName: string;
  destinationUrl: string;
  network: string;
};

export const affiliateOffers: Record<string, AffiliateOffer> = {
  sample: {
    carrierSlug: "sample",
    carrierName: "Sample Partner",
    destinationUrl: "https://example.com/pet-insurance-affiliate-placeholder",
    network: "placeholder"
  }
};

export function getAffiliateOffer(carrierSlug: string) {
  return affiliateOffers[carrierSlug];
}
