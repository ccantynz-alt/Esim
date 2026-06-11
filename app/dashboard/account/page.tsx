import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listEsims, listOrders, upsertUser } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = upsertUser(session.email, session.name);
  const esims = listEsims(session.email);
  const orders = listOrders(session.email);

  return (
    <div className="max-w-xl space-y-5">
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Member since" value={user.createdAt.slice(0, 10)} />
          <Row label="eSIMs" value={String(esims.length)} />
          <Row label="Orders" value={String(orders.length)} />
        </dl>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-white/55">
          Low-data alerts and expiry reminders are sent to your email. Granular
          preferences arrive with production email delivery.
        </p>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Payment methods</h2>
        <p className="mt-2 text-sm text-white/55">
          Cards are handled securely by Stripe once payments go live. Nothing
          is stored on our servers.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/45">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
