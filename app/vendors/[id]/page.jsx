"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { allServices, cultures, getVendorById } from "@/lib/catalog";
import { listRfps, shortlist, shortlistFor, unshortlist } from "@/lib/store";

export default function VendorDetail({ params }) {
  const { id } = use(params);
  const vendor = getVendorById(id);
  const [rfps, setRfps] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState("");
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    setRfps(listRfps());
  }, []);

  useEffect(() => {
    if (selectedRfp) setShortlisted(shortlistFor(selectedRfp).includes(id));
    else setShortlisted(false);
  }, [selectedRfp, id]);

  if (!vendor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Vendor not found</h1>
        <Link href="/vendors" className="btn-primary mt-6">
          Back to directory
        </Link>
      </div>
    );
  }

  const services = vendor.services
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter(Boolean);
  const cultureNames = vendor.cultures
    .map((slug) => cultures.find((c) => c.slug === slug)?.name)
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <Link href="/vendors" className="btn-ghost mb-4">
        ← All vendors
      </Link>
      <section className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-rose-100 via-sand to-gold-400/40 p-12">
          <div className="grid place-items-center text-[10rem] leading-none">
            {vendor.emoji}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {vendor.badge && (
            <span className="chip w-max border-rose-300 bg-rose-50 text-rose-700">
              {vendor.badge}
            </span>
          )}
          <h1 className="font-display text-5xl leading-tight">{vendor.name}</h1>
          <p className="text-lg text-ink/70">{vendor.tagline}</p>
          <div className="flex flex-wrap gap-2 text-sm text-ink/70">
            <span>★ {vendor.rating.toFixed(1)} ({vendor.reviews} reviews)</span>
            <span>·</span>
            <span>{vendor.city}</span>
            <span>·</span>
            <span>{vendor.yearsActive} years in business</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {services.map((s) => (
              <span key={s.slug} className="chip">
                <span>{s.icon}</span>
                {s.name}
              </span>
            ))}
          </div>
          <div className="card mt-2 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Starting from</span>
              <span className="font-display text-3xl text-rose-700">
                ${vendor.priceFrom.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-ink/50">
              Final price set by the bid this vendor sends to your wedding.
            </div>
            <hr className="border-ink/10" />
            <label className="label">Add this vendor to a posted wedding</label>
            <select
              className="select"
              value={selectedRfp}
              onChange={(e) => setSelectedRfp(e.target.value)}
            >
              <option value="">Select one of your weddings…</option>
              {rfps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.coupleNames || "Wedding"} — {r.eventDate} · {r.city}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                disabled={!selectedRfp}
                className="btn-primary flex-1 disabled:opacity-40"
                onClick={() => {
                  if (shortlisted) unshortlist(selectedRfp, vendor.id);
                  else shortlist(selectedRfp, vendor.id);
                  setShortlisted(!shortlisted);
                }}
              >
                {shortlisted ? "✓ Shortlisted" : "Add to shortlist"}
              </button>
              <Link
                href={`/post-wedding?invite=${vendor.id}`}
                className="btn-secondary"
              >
                Post a wedding
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="font-display text-3xl">About</h2>
          <p className="mt-3 text-ink/80">{vendor.bio}</p>
          <h3 className="mt-8 font-display text-2xl">Sample packages</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Package
              tier="Essentials"
              price={vendor.priceFrom}
              points={["Core service", "Up to 6 hours", "Single primary contact"]}
            />
            <Package
              tier="Signature"
              price={Math.round(vendor.priceFrom * 1.6)}
              points={["Full event coverage", "Add-on extras", "2-person team"]}
              highlight
            />
            <Package
              tier="Heirloom"
              price={Math.round(vendor.priceFrom * 2.4)}
              points={[
                "Multi-day coverage",
                "Custom design",
                "Priority response",
              ]}
            />
          </div>
        </div>
        <aside className="card h-max">
          <h3 className="font-display text-xl">Quick facts</h3>
          <Fact label="Cultures served" value={cultureNames.join(", ") || "—"} />
          <Fact label="Languages" value={vendor.languages.join(", ")} />
          <Fact label="City" value={vendor.city} />
          <Fact label="Years active" value={`${vendor.yearsActive}`} />
        </aside>
      </section>
    </div>
  );
}

function Package({ tier, price, points, highlight }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-soft ${
        highlight
          ? "border-rose-400 bg-rose-50"
          : "border-ink/10 bg-cream"
      }`}
    >
      <div className="font-display text-xl">{tier}</div>
      <div className="mt-1 text-2xl font-semibold text-rose-700">
        ${price.toLocaleString()}
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-ink/70">
        {points.map((p) => (
          <li key={p}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="mt-3 border-t border-ink/5 pt-3 text-sm">
      <div className="text-xs uppercase tracking-wider text-ink/50">{label}</div>
      <div className="text-ink">{value}</div>
    </div>
  );
}
