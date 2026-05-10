import Link from "next/link";
import { cultures, seedVendors, serviceCategories } from "@/lib/catalog";
import VendorCard from "@/components/VendorCard";

export default function HomePage() {
  const featured = seedVendors.slice(0, 6);
  return (
    <div className="mx-auto max-w-6xl px-6">
      <Hero />
      <Cultures />
      <HowItWorks />
      <Featured vendors={featured} />
      <Services />
    </div>
  );
}

function Hero() {
  return (
    <section className="py-20 md:py-28">
      <h1 className="font-display text-5xl leading-tight md:text-6xl">
        Wedding vendors that bid for your day.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Post your wedding once. Vetted vendors send you sealed bids — across
        every culture, faith and budget in Canada.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/post-wedding" className="btn-primary">
          Post your wedding
        </Link>
        <Link href="/vendors" className="btn-secondary">
          Browse vendors
        </Link>
      </div>
    </section>
  );
}

function Cultures() {
  return (
    <section className="border-t border-ink/10 py-16">
      <h2 className="font-display text-3xl">Built for every wedding</h2>
      <p className="mt-2 text-ink/60">
        Vendors are tagged by the cultures they actually know.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map((c) => (
          <Link
            key={c.slug}
            href={`/cultures/${c.slug}`}
            className="rounded-md border border-ink/10 bg-cream p-4 transition hover:border-ink/30"
          >
            <div className="font-display text-lg">{c.name}</div>
            <div className="mt-1 text-sm text-ink/60">{c.blurb}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["1", "Post your wedding", "Date, city, guest count, the vendors you need."],
    ["2", "Receive bids", "Matched vendors send sealed offers."],
    ["3", "Compare and book", "Side-by-side prices, reviews, packages."],
    ["4", "Plan it all", "Auto-built budget, checklist and day-of timeline tailored to your culture."],
  ];
  return (
    <section className="border-t border-ink/10 py-16">
      <h2 className="font-display text-3xl">How it works</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([n, t, d]) => (
          <div key={n}>
            <div className="font-display text-2xl text-ink/40">{n}</div>
            <div className="mt-1 font-medium">{t}</div>
            <div className="mt-1 text-sm text-ink/60">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Featured({ vendors }) {
  return (
    <section className="border-t border-ink/10 py-16">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-3xl">Featured vendors</h2>
        <Link href="/vendors" className="text-sm text-ink/70 hover:text-ink">
          See all →
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <VendorCard key={v.id} vendor={v} />
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="border-t border-ink/10 py-16">
      <h2 className="font-display text-3xl">All vendor types</h2>
      <p className="mt-2 text-ink/60">From the venue to the dholi — every category we list.</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((g) => (
          <div key={g.group}>
            <div className="text-xs font-medium uppercase tracking-wider text-ink/50">
              {g.group}
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {g.items.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/vendors?service=${i.slug}`}
                    className="text-ink/80 hover:text-ink"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
