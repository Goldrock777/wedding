import Link from "next/link";

const NAV = [
  { href: "/vendors", label: "Find vendors" },
  { href: "/cultures", label: "Cultures" },
  { href: "/weddings", label: "Open weddings" },
  { href: "/post-wedding", label: "Post your wedding" },
  { href: "/vendor/join", label: "Join as vendor" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-600 text-cream shadow-soft">
            <span className="font-display text-xl leading-none">K</span>
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Knot <span className="text-rose-600">&amp;</span> Co
          </span>
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
            My dashboard
          </Link>
          <Link href="/post-wedding" className="btn-primary">
            Post wedding
          </Link>
        </div>
      </div>
    </header>
  );
}
