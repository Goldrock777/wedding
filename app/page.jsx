import Link from "next/link";
import { cultures, seedVendors, serviceCategories } from "@/lib/catalog";
import VendorCard from "@/components/VendorCard";

export default function HomePage() {
  const featured = seedVendors.slice(0, 6);
  return (
    <div>
      <Hero />
      <CulturesStrip />
      <HowItWorks />
      <FeaturedVendors vendors={featured} />
      <ServiceTaxonomy />
      <CTAStrip />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-60" aria-hidden />
      <div className="absolute -top-40 right-0 h-[34rem] w-[34rem] rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-gold-400/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-8 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <span className="chip mb-5 w-max border-rose-300 bg-rose-50 text-rose-700">
            🇨🇦 Built for Canadian weddings, every culture
          </span>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Vendors that <span className="gradient-text italic">bid</span> for
            your wedding.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            Post your day once. Photographers, banquet halls, dholis, mehndi
            artists, mariachis, florists and 30+ other vendor types compete for
            it — with real prices, real reviews and real availability.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/post-wedding" className="btn-primary">
              Post your wedding — free
            </Link>
            <Link href="/vendors" className="btn-secondary">
              Browse 12,000+ vendors
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/60">
            <Stat label="vendors vetted" value="12,400+" />
            <Stat label="weddings booked" value="8,900+" />
            <Stat label="cultures supported" value={cultures.length} />
            <Stat label="avg. couple savings" value="22%" />
          </div>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <FloatingTile
              big
              emoji="📷"
              title="Aurora Frames"
              note="Photo + video · ★ 4.9"
              tone="bg-rose-100"
            />
            <FloatingTile
              emoji="🛕"
              title="Rajwada Mandap"
              note="Banquet · 1,200 guests"
              tone="bg-gold-400/30"
            />
            <FloatingTile
              emoji="🥁"
              title="Amrit Dhol Crew"
              note="Loudest baraat in the GTA"
              tone="bg-rose-200/70"
            />
            <FloatingTile
              big
              emoji="🍇"
              title="Niagara Vines"
              note="Vineyard ceremonies · ★ 4.8"
              tone="bg-sand"
            />
            <FloatingTile
              emoji="🌿"
              title="Noor Mehndi"
              note="Bridal mehndi · 10 yrs"
              tone="bg-cream"
            />
            <FloatingTile
              emoji="🎂"
              title="Aria Cakes"
              note="Cake & mithai towers"
              tone="bg-rose-100/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-display text-3xl text-ink">{value}</div>
      <div className="text-xs uppercase tracking-wider text-ink/50">{label}</div>
    </div>
  );
}

function FloatingTile({ emoji, title, note, tone, big }) {
  return (
    <div
      className={`flex ${
        big ? "row-span-2 aspect-[3/4]" : "aspect-square"
      } flex-col justify-end rounded-2xl ${tone} p-5 shadow-soft transition hover:-translate-y-1`}
    >
      <div className="text-5xl">{emoji}</div>
      <div className="mt-3 font-display text-xl leading-tight">{title}</div>
      <div className="text-xs text-ink/60">{note}</div>
    </div>
  );
}

function CulturesStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <div className="divider-fancy mb-10">Built for every wedding</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map((c) => (
          <Link
            key={c.slug}
            href={`/cultures/${c.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-cream p-6 shadow-soft transition hover:-translate-y-1"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.accent}`}
            />
            <h3 className="font-display text-2xl">{c.name}</h3>
            <p className="mt-1 text-sm text-ink/70">{c.blurb}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-rose-700">
              Browse vendors →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Post your wedding in 3 minutes",
      d: "Tell us your date, city, guest count, culture and which vendors you need. It's free, no credit card.",
    },
    {
      n: "02",
      t: "Vendors send you bids",
      d: "Vetted vendors review your wedding and send sealed bids with packages, photos and availability.",
    },
    {
      n: "03",
      t: "Compare, shortlist, book",
      d: "Side-by-side compare prices and reviews. Shortlist your favourites and book directly through Knot & Co.",
    },
  ];
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <h2 className="font-display text-4xl sm:text-5xl">
            One post. Every vendor you need, racing for your day.
          </h2>
          <p className="text-ink/70">
            Knot & Co flips the wedding hunt. Instead of cold-emailing 40
            vendors, post your wedding once and let qualified vendors come to
            you with their best offer.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card">
              <div className="font-display text-5xl text-rose-600/80">{s.n}</div>
              <h3 className="mt-3 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedVendors({ vendors }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="divider-fancy mb-3 max-w-xs">Featured vendors</div>
          <h2 className="font-display text-4xl sm:text-5xl">
            A taste of who's on the platform.
          </h2>
        </div>
        <Link href="/vendors" className="btn-secondary hidden md:inline-flex">
          See all vendors
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <VendorCard key={v.id} vendor={v} />
        ))}
      </div>
    </section>
  );
}

function ServiceTaxonomy() {
  return (
    <section id="services" className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <h2 className="font-display text-4xl sm:text-5xl">
            Every vendor your wedding could ever need.
          </h2>
          <p className="text-ink/70">
            From the venue to the dholi, the mariachi to the chuppah florist,
            the late-night food truck to the gele tier. If a wedding needs it,
            Knot & Co lists it.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((g) => (
            <div key={g.group} className="card">
              <h3 className="font-display text-2xl">{g.group}</h3>
              <ul className="mt-4 space-y-1.5 text-sm">
                {g.items.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/vendors?service=${i.slug}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-rose-50"
                    >
                      <span className="flex items-center gap-2">
                        <span>{i.icon}</span>
                        <span>{i.name}</span>
                      </span>
                      <span className="text-xs text-ink/40">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-8">
      <div className="grid gap-6 rounded-3xl bg-rose-600 p-8 text-cream shadow-soft md:grid-cols-2 md:p-12">
        <div>
          <div className="text-cream/80">For couples</div>
          <h3 className="mt-2 font-display text-3xl sm:text-4xl">
            Post once. Let the right vendors come to you.
          </h3>
          <Link
            href="/post-wedding"
            className="mt-6 inline-flex rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Post your wedding →
          </Link>
        </div>
        <div className="md:border-l md:border-cream/20 md:pl-12">
          <div className="text-cream/80">For vendors</div>
          <h3 className="mt-2 font-display text-3xl sm:text-4xl">
            Stop chasing leads. Bid on couples ready to book.
          </h3>
          <Link
            href="/vendor/join"
            className="mt-6 inline-flex rounded-full border border-cream/70 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-cream/10"
          >
            Join as a vendor →
          </Link>
        </div>
      </div>
    </section>
  );
}
