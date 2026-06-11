import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/esims", label: "eSIMs" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/monitoring", label: "Monitoring" },
  { href: "/admin/plans", label: "Plans & pricing" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page renders inside this layout — don't gate it.
  const path = (await headers()).get("x-pathname");
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  if (!isAdmin && path !== "/admin/login") {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-white/50">
            See everything, monitor everything, fix everything.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="glass glass-hover rounded-full px-4 py-2 text-xs text-white/60">
            Sign out
          </button>
        </form>
      </div>
      <DashboardNav links={links} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
