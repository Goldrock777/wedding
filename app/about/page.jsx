import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <span className="chip">About</span>
      <h1 className="mt-3 font-display text-5xl">A wedding marketplace built around real Canadian couples.</h1>
      <p className="mt-4 text-ink/70">
        Knot &amp; Co is a curated marketplace where couples post their wedding
        and vetted vendors compete to win it. We support every culture, every
        faith, every kind of love — from a 600-guest South Asian banquet to an
        elopement on the Sunshine Coast.
      </p>

      <section id="how" className="mt-14">
        <h2 className="font-display text-3xl">How bidding works</h2>
        <ol className="mt-4 space-y-4 text-ink/80">
          <li><strong>1. Post your wedding.</strong> A short form: date, city, guest count, culture, and the vendor categories you need.</li>
          <li><strong>2. We notify matched vendors.</strong> Vendors who fit your services and cultures are alerted and can submit sealed bids.</li>
          <li><strong>3. You compare and shortlist.</strong> Bids are sorted lowest to highest. Read profiles, view portfolios, ask questions, shortlist.</li>
          <li><strong>4. Book directly.</strong> When you accept a bid we close the loop — no separate emails, no missed messages.</li>
        </ol>
      </section>

      <section id="trust" className="mt-14">
        <h2 className="font-display text-3xl">Trust &amp; safety</h2>
        <ul className="mt-4 space-y-2 text-ink/80">
          <li>· Every vendor is identity-verified before they can place bids.</li>
          <li>· Reviews are tied to bookings — no fake reviews from non-customers.</li>
          <li>· Couples never pay platform fees. Vendors only pay when they win.</li>
          <li>· LGBTQ+ couples can filter for explicitly affirming vendors.</li>
          <li>· Cultural fluency is self-declared and rated by the couples who book.</li>
        </ul>
      </section>

      <div className="mt-14 flex gap-3">
        <Link href="/post-wedding" className="btn-primary">Post your wedding</Link>
        <Link href="/vendor/join" className="btn-secondary">Join as a vendor</Link>
      </div>
    </div>
  );
}
