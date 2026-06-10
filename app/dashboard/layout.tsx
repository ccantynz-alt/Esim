import { Metadata } from "next";
import { DashboardNav } from "@/components/DashboardNav";
import { demoUser } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "My eSIMs",
  robots: { index: false },
};

const links = [
  { href: "/dashboard", label: "My eSIMs" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/account", label: "Account" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {demoUser.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your eSIMs, data and orders.
          </p>
        </div>
        <p className="rounded-full bg-amber-400/10 px-4 py-1.5 text-xs text-amber-300">
          Demo mode — sign-in & live data arrive with the backend
        </p>
      </div>
      <DashboardNav links={links} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
