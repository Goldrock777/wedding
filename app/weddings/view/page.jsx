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
    placeBid({ rfpId: id, ...form, amount: Number(form.amount) });
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
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Wedding not found</h1>
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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/weddings" className="text-sm text-ink/60 hover:text-ink">
        ← Open weddings
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <div className="text-xs text-ink/50">{culture?.name || "Wedding"}</div>
          <h1 className="mt-1 font-display text-3xl">
            {rfp.coupleNames || "Anonymous couple"}
          </h1>
          <div className="mt-1 text-sm text-ink/60">
            {rfp.eventDate} · {rfp.city}
            {rfp.venue ? ` · ${rfp.venue}` : ""}
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Fact k="Guests" v={rfp.guestCount || "TBD"} />
            <Fact k="Budget" v={rfp.budget ? `$${Number(rfp.budget).toLocaleString()}` : "—"} />
          </div>
          <div className="mt-4">
            <div className="text-xs text-ink/50">Vendors needed</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {services.map((s) => (
                <span key={s.slug} className="chip">{s.name}</span>
              ))}
            </div>
          </div>
          {rfp.notes && (
            <p className="mt-4 rounded-md border border-ink/10 p-3 text-sm text-ink/70">
              {rfp.notes}
            </p>
          )}

          <h3 className="mt-8 font-display text-xl">Bids ({bids.length})</h3>
          <p className="text-xs text-ink/50">
            Sorted lowest to highest. Vendor contact stays private until shortlisted.
          </p>
          <div className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
            {bids.length === 0 && (
              <div className="py-3 text-sm text-ink/60">Be the first to bid.</div>
            )}
            {bids.map((b, i) => (
              <div key={b.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium">
                    {b.vendorName}
                    {i === 0 && (
                      <span className="ml-2 rounded-sm border border-ink/30 px-1.5 py-0.5 text-[10px] uppercase">
                        lead
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink/60">{b.serviceLabel}</div>
                </div>
                <div className="font-medium">${Number(b.amount).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card self-start">
          <h2 className="font-display text-xl">Place your bid</h2>
          {posted && (
            <div className="mt-3 rounded-md border border-ink/20 bg-cream p-3 text-sm">
              Bid sent.
            </div>
          )}
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <div>
              <label className="label">Bidding as</label>
              <select className="select" value={form.vendorId} onChange={(e) => onPickVendor(e.target.value)}>
                <option value="">Custom (type below)</option>
                {seedVendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Business name</label>
              <input
                className="input"
                value={form.vendorName}
                onChange={(e) => update("vendorName", e.target.value)}
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
                <option value="">Pick a service</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Amount (CAD)</label>
              <input
                className="input"
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
            <div>
              <label className="label">Pitch (optional)</label>
              <textarea
                className="textarea min-h-[80px]"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>
            <button className="btn-primary w-full" type="submit">Submit bid</button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  return (
    <div>
      <div className="text-xs text-ink/50">{k}</div>
      <div>{v}</div>
    </div>
  );
}
