import { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "My eSIMs",
  robots: { index: false },
};

const links = [
  { href: "/dashboard", label: "My eSIMs" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/account", label: "Account" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.name}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your eSIMs, data and orders.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="glass glass-hover rounded-full px-4 py-2 text-xs text-white/60">
            Sign out ({session.email})
          </button>
        </form>
      </div>
      <DashboardNav links={links} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
