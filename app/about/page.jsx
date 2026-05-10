import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl">About</h1>
      <p className="mt-3 text-ink/70">
        Knot &amp; Co is a wedding marketplace where couples post their wedding
        and vetted vendors compete with sealed bids — across every culture,
        faith and budget in Canada.
      </p>

      <h2 className="mt-10 font-display text-2xl">How bidding works</h2>
      <ol className="mt-2 space-y-2 text-ink/80">
        <li>1. Post your wedding — date, city, guest count, vendors needed.</li>
        <li>2. Matched vendors send sealed bids.</li>
        <li>3. Compare in your dashboard. Shortlist the favourites.</li>
        <li>4. Book directly through Knot &amp; Co.</li>
      </ol>

      <h2 id="trust" className="mt-10 font-display text-2xl">Trust &amp; safety</h2>
      <ul className="mt-2 space-y-2 text-ink/80">
        <li>· Every vendor is identity-verified before placing bids.</li>
        <li>· Reviews are tied to bookings — no fake reviews.</li>
        <li>· Couples never pay platform fees. Vendors only pay when they win.</li>
        <li>· LGBTQ+ couples can filter for explicitly affirming vendors.</li>
      </ul>

      <div className="mt-10 flex gap-3">
        <Link href="/post-wedding" className="btn-primary">Post a wedding</Link>
        <Link href="/vendor/join" className="btn-secondary">Join as vendor</Link>
      </div>
    </div>
  );
}
