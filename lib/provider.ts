import { EsimRec, totalDataGb } from "./db";

/**
 * eSIM supplier abstraction. The store talks only to this interface, so
 * connecting the real provider (eSIM Access / Telna / Mobilise / etc.) means
 * writing one class and flipping `getProvider()` — nothing else changes.
 *
 * Until then `MockProvider` simulates the full lifecycle (provision, top-up,
 * usage, deactivate) so every flow is testable end-to-end, mirroring how
 * Stripe stays wired-but-inert until keys exist.
 */

export interface ProvisionResult {
  iccid: string;
  /** LPA activation string encoded into the QR code. */
  activationCode: string;
}

export interface UsageResult {
  usedGb: number;
}

export interface ProviderHealth {
  ok: boolean;
  name: string;
  latencyMs: number;
  detail: string;
}

export interface EsimProvider {
  readonly name: string;
  provision(input: {
    planId: string;
    countryCode: string;
    email: string;
  }): Promise<ProvisionResult>;
  topUp(iccid: string, dataGb: number): Promise<void>;
  getUsage(esim: EsimRec): Promise<UsageResult>;
  deactivate(iccid: string): Promise<void>;
  health(): Promise<ProviderHealth>;
}

class MockProvider implements EsimProvider {
  readonly name = "MockProvider (simulation)";

  async provision(input: {
    planId: string;
    countryCode: string;
    email: string;
  }): Promise<ProvisionResult> {
    const serial = Array.from({ length: 13 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    const iccid = `891039${serial}`;
    const token = `${input.countryCode}-${input.planId.toUpperCase()}-${serial.slice(0, 6)}`;
    return {
      iccid,
      activationCode: `LPA:1$rsp.layova.travel$${token}`,
    };
  }

  async topUp(): Promise<void> {
    // Real provider: POST /esims/{iccid}/topup
  }

  /**
   * Deterministic simulated usage: grows ~80–250 MB per hour since
   * activation (seeded by ICCID), capped at the plan total.
   */
  async getUsage(esim: EsimRec): Promise<UsageResult> {
    if (!esim.activatedAt) return { usedGb: 0 };
    const hours = (Date.now() - new Date(esim.activatedAt).getTime()) / 3.6e6;
    const seed = (parseInt(esim.iccid.slice(-4), 10) % 100) / 100;
    const ratePerHour = 0.08 + seed * 0.17;
    const total = totalDataGb(esim);
    const used = hours * ratePerHour;
    return {
      usedGb:
        total === "unlimited"
          ? Math.round(used * 10) / 10
          : Math.min(total, Math.round(used * 10) / 10),
    };
  }

  async deactivate(): Promise<void> {
    // Real provider: POST /esims/{iccid}/deactivate
  }

  async health(): Promise<ProviderHealth> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 5));
    return {
      ok: true,
      name: this.name,
      latencyMs: Date.now() - start,
      detail:
        "Simulation mode — connect the real supplier API in lib/provider.ts before launch.",
    };
  }
}

let provider: EsimProvider | null = null;

export function getProvider(): EsimProvider {
  // When the supplier contract is signed, return their adapter here when
  // e.g. process.env.ESIM_PROVIDER_API_KEY is set.
  provider ??= new MockProvider();
  return provider;
}

export function isRealProvider(): boolean {
  return false; // flips to env-based check with the real adapter
}
