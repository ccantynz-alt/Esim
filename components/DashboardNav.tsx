"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-white/10 pb-px">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm transition ${
              active
                ? "border-b-2 border-aurora-400 font-semibold text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
