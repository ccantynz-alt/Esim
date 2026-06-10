import { Metadata } from "next";
import { DashboardNav } from "@/components/DashboardNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/plans", label: "Plans & pricing" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-white/50">
            Store performance, orders and catalog.
          </p>
        </div>
        <p className="rounded-full bg-amber-400/10 px-4 py-1.5 text-xs text-amber-300">
          Demo data — gate this route behind auth before launch
        </p>
      </div>
      <DashboardNav links={links} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
