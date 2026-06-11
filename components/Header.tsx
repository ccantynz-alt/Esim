import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/destinations", label: "Destinations" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/business", label: "Business" },
  { href: "/compatibility", label: "Compatibility" },
  { href: "/help", label: "Help" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Logo />
          {site.name}
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm text-white/80 transition hover:text-white sm:block"
          >
            My eSIMs
          </Link>
          <Link
            href="/destinations"
            className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
          >
            Get your eSIM
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <rect x="1" y="1" width="24" height="24" rx="7" stroke="url(#lg)" strokeWidth="2" />
      <path d="M8 13a5 5 0 0 1 10 0" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="13" cy="17" r="1.8" fill="#34e0c8" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="26" y2="26">
          <stop stopColor="#7c6cff" />
          <stop offset="1" stopColor="#34e0c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
