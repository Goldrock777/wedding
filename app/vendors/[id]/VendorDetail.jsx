"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { allServices, cultures, getVendorById } from "@/lib/catalog";
import { listRfps, shortlist, shortlistFor, unshortlist } from "@/lib/store";

export default function VendorDetail({ id }) {
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
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Vendor not found</h1>
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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/vendors" className="text-sm text-ink/60 hover:text-ink">
        ← All vendors
      </Link>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-4xl">{vendor.name}</h1>
        <div className="text-sm text-ink/60">
          ★ {vendor.rating.toFixed(1)} ({vendor.reviews})
        </div>
      </div>
      <p className="mt-1 text-ink/70">{vendor.tagline}</p>
      <div className="mt-2 text-sm text-ink/60">
        {vendor.city} · {vendor.yearsActive} years · from $
        {vendor.priceFrom.toLocaleString()}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {services.map((s) => (
          <span key={s.slug} className="chip">{s.name}</span>
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-display text-2xl">About</h2>
          <p className="mt-2 text-ink/80">{vendor.bio}</p>

          <h3 className="mt-8 font-display text-xl">Sample packages</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Package tier="Essentials" price={vendor.priceFrom} />
            <Package
              tier="Signature"
              price={Math.round(vendor.priceFrom * 1.6)}
              highlight
            />
            <Package tier="Heirloom" price={Math.round(vendor.priceFrom * 2.4)} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card space-y-3">
            <div className="text-sm font-medium">Add to a posted wedding</div>
            <select
              className="select"
              value={selectedRfp}
              onChange={(e) => setSelectedRfp(e.target.value)}
            >
              <option value="">Select a wedding…</option>
              {rfps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.coupleNames || "Wedding"} — {r.eventDate}
                </option>
              ))}
            </select>
            <button
              disabled={!selectedRfp}
              className="btn-primary w-full disabled:opacity-40"
              onClick={() => {
                if (shortlisted) unshortlist(selectedRfp, vendor.id);
                else shortlist(selectedRfp, vendor.id);
                setShortlisted(!shortlisted);
              }}
            >
              {shortlisted ? "Shortlisted ✓" : "Add to shortlist"}
            </button>
            <Link
              href={`/post-wedding?invite=${vendor.id}`}
              className="btn-secondary w-full"
            >
              Post a wedding
            </Link>
          </div>
          <div className="card space-y-2 text-sm">
            <Fact label="Cultures" value={cultureNames.join(", ") || "—"} />
            <Fact label="Languages" value={vendor.languages.join(", ")} />
            <Fact label="City" value={vendor.city} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Package({ tier, price, highlight }) {
  return (
    <div
      className={`rounded-md border p-4 ${
        highlight ? "border-ink bg-ink text-cream" : "border-ink/10 bg-cream"
      }`}
    >
      <div className="font-display text-lg">{tier}</div>
      <div className="mt-1 text-sm">${price.toLocaleString()}</div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-xs text-ink/50">{label}</div>
      <div>{value}</div>
    </div>
  );
}
