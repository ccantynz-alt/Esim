import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db";

/** Captures a B2B lead / bulk-quote request from /business. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const company = String(body.company ?? "").trim();
  const contactName = String(body.contactName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const segment = String(body.segment ?? "other").trim();
  const details = String(body.details ?? "").trim().slice(0, 2000);
  const estMonthlyTravelers = Number(body.estMonthlyTravelers) || undefined;

  if (!company || !contactName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Company, contact name and a valid email are required" },
      { status: 400 },
    );
  }

  const lead = createLead({
    company,
    contactName,
    email,
    segment,
    details,
    estMonthlyTravelers,
  });
  // TODO at launch: email notification to sales inbox.
  return NextResponse.json({ ok: true, id: lead.id });
}
