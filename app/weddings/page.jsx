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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <span className="chip">For vendors</span>
      <h1 className="mt-3 font-display text-5xl">Open weddings to bid on</h1>
      <p className="mt-2 max-w-2xl text-ink/70">
        Browse couples actively requesting bids. Sealed bids are submitted from
        each wedding's page — only the couple sees what you offered.
      </p>

      <div className="mt-10">
        {rfps.length === 0 ? (
          <div className="card text-center">
            <h3 className="font-display text-2xl">No live weddings yet.</h3>
            <p className="mt-2 text-ink/70">
              Once a couple posts a wedding it will show up here for vendors.
              Try posting a demo wedding to see the full flow.
            </p>
            <Link href="/post-wedding" className="btn-primary mt-4">
              Post a demo wedding
            </Link>
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
      href={`/weddings/${rfp.id}`}
      className="card flex flex-col gap-3 transition hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-rose-700">
            {culture?.name || "Wedding"}
          </div>
          <h3 className="font-display text-2xl">
            {rfp.coupleNames || "Anonymous couple"}
          </h3>
          <div className="text-sm text-ink/60">
            {rfp.eventDate} · {rfp.city}
            {rfp.venue ? ` · ${rfp.venue}` : ""}
          </div>
        </div>
        <span className="chip">
          {rfp.guestCount ? `${rfp.guestCount} guests` : "Guest count tbd"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {services.slice(0, 6).map((s) => (
          <span key={s.slug} className="chip">
            <span>{s.icon}</span>
            {s.name}
          </span>
        ))}
        {services.length > 6 && (
          <span className="chip">+{services.length - 6} more</span>
        )}
      </div>
      {rfp.budget && (
        <div className="text-sm text-ink/70">
          Budget: ${Number(rfp.budget).toLocaleString()}
        </div>
      )}
      <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
        Place a bid →
      </div>
    </Link>
  );
}
