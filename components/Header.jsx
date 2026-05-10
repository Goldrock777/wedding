import Link from "next/link";

const NAV = [
  { href: "/vendors", label: "Vendors" },
  { href: "/cultures", label: "Cultures" },
  { href: "/planner", label: "Planner" },
  { href: "/weddings", label: "Open weddings" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold">
          Knot &amp; Co
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="btn-ghost">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="btn-ghost hidden sm:inline-flex">
            Dashboard
          </Link>
          <Link href="/post-wedding" className="btn-primary">
            Post wedding
          </Link>
        </div>
      </div>
    </header>
  );
}
