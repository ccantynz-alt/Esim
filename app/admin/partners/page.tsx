import { listLeads, LeadStatus } from "@/lib/db";
import { updateLeadStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-sky-glow/15 text-sky-glow",
  contacted: "bg-amber-400/15 text-amber-300",
  won: "bg-aurora-500/15 text-aurora-400",
  lost: "bg-white/10 text-white/40",
};

const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus[]>> = {
  new: ["contacted", "won", "lost"],
  contacted: ["won", "lost"],
  lost: ["contacted"],
};

export default function AdminPartnersPage() {
  const leads = listLeads();

  if (leads.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-white/60">
        No partner leads yet. They arrive from the quote builder on{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">/business</code>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-semibold">
                {lead.company}
                <span className="ml-2 text-xs font-normal text-white/45">
                  {lead.segment}
                </span>
              </div>
              <div className="mt-0.5 text-sm text-white/60">
                {lead.contactName} · {lead.email}
                {lead.estMonthlyTravelers
                  ? ` · ~${lead.estMonthlyTravelers} travelers`
                  : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[lead.status]}`}
              >
                {lead.status}
              </span>
              <span className="text-xs text-white/35">
                {lead.createdAt.slice(0, 10)}
              </span>
            </div>
          </div>
          {lead.details && (
            <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white/65">
              {lead.details}
            </p>
          )}
          {NEXT_STATUS[lead.status] && (
            <div className="mt-4 flex gap-2">
              {NEXT_STATUS[lead.status]!.map((next) => (
                <form key={next} action={updateLeadStatusAction}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="status" value={next} />
                  <button className="glass glass-hover rounded-lg px-3 py-1.5 text-xs capitalize">
                    Mark {next}
                  </button>
                </form>
              ))}
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your Layova group quote — ${lead.company}`)}`}
                className="btn-primary rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                Reply by email
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
