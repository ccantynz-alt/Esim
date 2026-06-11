/**
 * Volume discount tiers for group/partner orders. Shared by the public
 * quote builder and the API so quotes can never drift from what we honor.
 */
export const BULK_TIERS = [
  { min: 50, discount: 0.2, label: "50+ travelers — 20% off" },
  { min: 20, discount: 0.15, label: "20–49 travelers — 15% off" },
  { min: 10, discount: 0.1, label: "10–19 travelers — 10% off" },
  { min: 1, discount: 0, label: "1–9 travelers — standard pricing" },
] as const;

export function bulkDiscount(quantity: number): number {
  return BULK_TIERS.find((t) => quantity >= t.min)?.discount ?? 0;
}

/** Default revenue share offered to referring agencies/operators. */
export const PARTNER_COMMISSION = 0.2;
