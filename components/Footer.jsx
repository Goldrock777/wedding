import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-600 text-cream">
              <span className="font-display text-xl leading-none">K</span>
            </span>
            <span className="font-display text-2xl">Knot &amp; Co</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink/70">
            A modern wedding marketplace for the cultures, faiths and families
            of Canada. Post your wedding — let vetted vendors come to you.
          </p>
        </div>
        <FooterCol
          title="Couples"
          links={[
            ["/post-wedding", "Post your wedding"],
            ["/dashboard", "My dashboard"],
            ["/vendors", "Browse vendors"],
            ["/cultures", "Browse by culture"],
          ]}
        />
        <FooterCol
          title="Vendors"
          links={[
            ["/vendor/join", "Join as a vendor"],
            ["/weddings", "Open weddings to bid"],
            ["/vendors", "Vendor directory"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["/about", "About us"],
            ["/about#how", "How bidding works"],
            ["/about#trust", "Trust &amp; safety"],
          ]}
        />
      </div>
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-ink/60 sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} Knot &amp; Co. Made with love in Canada.</span>
          <span>Toronto · Vancouver · Calgary · Montréal · Halifax</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/50">
        {title}
      </h4>
      <ul className="space-y-2 text-sm">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-ink/80 hover:text-rose-700">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
