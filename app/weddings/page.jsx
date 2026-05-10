"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { allServices, getCultureBySlug } from "@/lib/catalog";
import { getState, subscribe } from "@/lib/store";

export default function WeddingsPage() {
  const [rfps, setRfps] = useState([]);
  useEffect(() => {
    setRfps(getState().rfps);
    return subscribe((s) => setRfps(s.rfps));
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl">Open weddings</h1>
      <p className="mt-2 text-ink/60">
        Couples actively requesting bids. Only the couple sees what you offer.
      </p>

      <div className="mt-8">
        {rfps.length === 0 ? (
          <div className="rounded-md border border-ink/10 p-6 text-center">
            <p>No live weddings yet.</p>
            <Link href="/post-wedding" className="btn-primary mt-4">Post a demo wedding</Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {rfps.map((r) => (
              <RfpCard key={r.id} rfp={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RfpCard({ rfp }) {
  const culture = getCultureBySlug(rfp.culture);
  const services = rfp.services
    .map((s) => allServices.find((x) => x.slug === s))
    .filter(Boolean);
  return (
    <Link
      href={`/weddings/view?id=${rfp.id}`}
      className="block rounded-md border border-ink/10 bg-cream p-5 transition hover:border-ink/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-ink/50">{culture?.name || "Wedding"}</div>
          <h3 className="font-display text-xl">{rfp.coupleNames || "Anonymous couple"}</h3>
          <div className="text-sm text-ink/60">
            {rfp.eventDate} · {rfp.city}
            {rfp.venue ? ` · ${rfp.venue}` : ""}
          </div>
        </div>
        <span className="text-xs text-ink/60">
          {rfp.guestCount ? `${rfp.guestCount} guests` : "TBD"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {services.slice(0, 6).map((s) => (
          <span key={s.slug} className="chip">{s.name}</span>
        ))}
        {services.length > 6 && (
          <span className="chip">+{services.length - 6}</span>
        )}
      </div>
      {rfp.budget && (
        <div className="mt-3 text-sm text-ink/60">
          Budget ${Number(rfp.budget).toLocaleString()}
        </div>
      )}
    </Link>
  );
}
