"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  allServices,
  getCultureBySlug,
  seedVendors,
} from "@/lib/catalog";
import {
  bidsForRfp,
  getRfp,
  placeBid,
  subscribe,
} from "@/lib/store";

export default function BidOnWeddingPage() {
  return (
    <Suspense fallback={null}>
      <BidView />
    </Suspense>
  );
}

function BidView() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [rfp, setRfp] = useState(null);
  const [bids, setBids] = useState([]);
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({
    vendorId: "",
    vendorName: "",
    vendorEmail: "",
    serviceLabel: "",
    amount: "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;
    setRfp(getRfp(id));
    setBids(bidsForRfp(id));
    return subscribe(() => {
      setRfp(getRfp(id));
      setBids(bidsForRfp(id));
    });
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function onPickVendor(vendorId) {
    const v = seedVendors.find((x) => x.id === vendorId);
    setForm((f) => ({
      ...f,
      vendorId,
      vendorName: v?.name || f.vendorName,
      serviceLabel:
        v && rfp
          ? allServices.find((s) =>
              v.services.includes(s.slug) && rfp.services.includes(s.slug)
            )?.name || f.serviceLabel
          : f.serviceLabel,
    }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.vendorName || !form.amount || !form.vendorEmail) return;
    placeBid({
      rfpId: id,
      ...form,
      amount: Number(form.amount),
    });
    setPosted(true);
    setForm({
      vendorId: "",
      vendorName: "",
      vendorEmail: "",
      serviceLabel: "",
      amount: "",
      message: "",
    });
  }

  if (!id || !rfp) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Wedding not found</h1>
        <p className="mt-2 text-ink/60">
          This wedding may have been removed, or the link was opened in a
          different browser. Open weddings live in your browser only.
        </p>
        <Link href="/weddings" className="btn-primary mt-6">
          Back to open weddings
        </Link>
      </div>
    );
  }
  const culture = getCultureBySlug(rfp.culture);
  const services = rfp.services
    .map((s) => allServices.find((x) => x.slug === s))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <Link href="/weddings" className="btn-ghost mb-4">
        ← Open weddings
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <div className="text-xs uppercase tracking-wider text-rose-700">
            {culture?.name || "Wedding"}
          </div>
          <h1 className="mt-1 font-display text-4xl">
            {rfp.coupleNames || "Anonymous couple"}
          </h1>
          <div className="mt-1 text-ink/60">
            {rfp.eventDate} · {rfp.city}
            {rfp.venue ? ` · ${rfp.venue}` : ""}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Fact k="Guest count" v={rfp.guestCount || "TBD"} />
            <Fact
              k="Total budget"
              v={
                rfp.budget
                  ? `$${Number(rfp.budget).toLocaleString()}`
                  : "Not disclosed"
              }
            />
          </div>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-ink/50">
              Vendors needed
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {services.map((s) => (
                <span key={s.slug} className="chip">
                  <span>{s.icon}</span>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          {rfp.notes && (
            <p className="mt-6 rounded-xl bg-sand p-4 text-sm text-ink/80">
              <strong>Couple's notes:</strong> {rfp.notes}
            </p>
          )}

          <div className="mt-8">
            <h3 className="font-display text-2xl">
              Sealed bids on this wedding ({bids.length})
            </h3>
            <p className="text-xs text-ink/50">
              Bid amounts are visible to the couple, sorted lowest to highest.
              Your contact details remain private until they shortlist you.
            </p>
            <div className="mt-3 space-y-2">
              {bids.length === 0 && (
                <div className="rounded-xl bg-cream/50 p-3 text-sm text-ink/60">
                  Be the first to bid.
                </div>
              )}
              {bids.map((b, i) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-ink/10 bg-cream/60 p-3 text-sm"
                >
                  <div>
                    <div className="font-semibold">
                      {b.vendorName}{" "}
                      {i === 0 && (
                        <span className="ml-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink/60">{b.serviceLabel}</div>
                  </div>
                  <div className="font-display text-xl text-rose-700">
                    ${Number(b.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card sticky top-24 h-max">
          <h2 className="font-display text-2xl">Place your bid</h2>
          <p className="text-sm text-ink/60">
            One bid per service. The couple sees your bid right away in their
            dashboard.
          </p>
          {posted && (
            <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-900">
              Bid sent. The couple has been notified — they can shortlist you
              from their dashboard.
            </div>
          )}
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <div>
              <label className="label">I'm bidding as</label>
              <select
                className="select"
                value={form.vendorId}
                onChange={(e) => onPickVendor(e.target.value)}
              >
                <option value="">Custom vendor (type below)</option>
                {seedVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Business name</label>
              <input
                className="input"
                value={form.vendorName}
                onChange={(e) => update("vendorName", e.target.value)}
                placeholder="Your business name"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.vendorEmail}
                onChange={(e) => update("vendorEmail", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Service</label>
              <select
                className="select"
                value={form.serviceLabel}
                onChange={(e) => update("serviceLabel", e.target.value)}
              >
                <option value="">Pick the service you're bidding for</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Bid amount (CAD)</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="e.g. 4500"
                value={form.amount}
                onChange={(e) =>
                  update("amount", e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>
            <div>
              <label className="label">Pitch (optional)</label>
              <textarea
                className="textarea min-h-[100px]"
                placeholder="What's included, why you're a fit, packages, dates available."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>
            <button className="btn-primary w-full" type="submit">
              Submit bid
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink/50">{k}</div>
      <div className="text-ink">{v}</div>
    </div>
  );
}
