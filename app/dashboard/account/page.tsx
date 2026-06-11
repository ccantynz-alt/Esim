import { demoUser } from "@/lib/demo-data";

export default function AccountPage() {
  return (
    <div className="max-w-xl space-y-5">
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={demoUser.name} />
          <Row label="Email" value={demoUser.email} />
          <Row label="Member since" value={demoUser.memberSince} />
        </dl>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-white/55">
          Low-data alerts and expiry reminders are sent to your email. Granular
          preferences arrive with account sign-in.
        </p>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Payment methods</h2>
        <p className="mt-2 text-sm text-white/55">
          Cards are stored securely with Stripe once payments go live. Nothing
          is saved on our servers.
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
