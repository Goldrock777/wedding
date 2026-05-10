"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  allServices,
  cultures,
  getCultureBySlug,
  getVendorById,
} from "@/lib/catalog";
import {
  bidsForRfp,
  getState,
  shortlistFor,
  subscribe,
  unshortlist,
} from "@/lib/store";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const params = useSearchParams();
  const newId = params.get("new");
  const [state, setState] = useState({ rfps: [], bids: [], shortlists: {} });
  const [active, setActive] = useState("");

  useEffect(() => {
    setState(getState());
    const unsub = subscribe(setState);
    return unsub;
  }, []);
  useEffect(() => {
    if (newId) setActive(newId);
    else if (state.rfps[0]) setActive(state.rfps[0].id);
  }, [newId, state.rfps]);

  const rfp = state.rfps.find((r) => r.id === active);
  const bids = rfp ? bidsForRfp(rfp.id) : [];
  const shortIds = rfp ? shortlistFor(rfp.id) : [];

  if (state.rfps.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="chip">My dashboard</span>
        <h1 className="mt-3 font-display text-5xl">No weddings yet.</h1>
        <p className="mt-2 text-ink/70">
          Post your first wedding and we'll start gathering bids from vendors.
        </p>
        <Link href="/post-wedding" className="btn-primary mt-6">
          Post a wedding
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      {newId && (
        <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-900">
          <strong className="font-semibold">Your wedding is live.</strong> We've
          notified vendors that match your services. Open the{" "}
          <Link href="/weddings" className="underline">
            open weddings
          </Link>{" "}
          page in another tab to see what vendors see — and try placing a demo
          bid.
        </div>
      )}
      <span className="chip">My dashboard</span>
      <h1 className="mt-3 font-display text-5xl">Your weddings</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          {state.rfps.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active === r.id
                  ? "border-rose-500 bg-rose-50"
                  : "border-ink/10 bg-cream hover:border-rose-300"
              }`}
            >
              <div className="font-display text-xl">
                {r.coupleNames || "Untitled wedding"}
              </div>
              <div className="text-xs text-ink/60">
                {r.eventDate} · {r.city}
              </div>
              <div className="mt-2 text-xs">
                <span className="font-semibold text-rose-700">
                  {state.bids.filter((b) => b.rfpId === r.id).length}
                </span>{" "}
                bids ·{" "}
                <span className="font-semibold text-rose-700">
                  {(state.shortlists[r.id] || []).length}
                </span>{" "}
                shortlisted
              </div>
            </button>
          ))}
          <Link href="/post-wedding" className="btn-secondary w-full">
            + Post another wedding
          </Link>
        </aside>

        <div>
          {rfp && <RfpDetail rfp={rfp} bids={bids} shortIds={shortIds} />}
        </div>
      </div>
    </div>
  );
}

function RfpDetail({ rfp, bids, shortIds }) {
  const culture = getCultureBySlug(rfp.culture);
  const services = rfp.services
    .map((s) => allServices.find((x) => x.slug === s))
    .filter(Boolean);
  const shortVendors = shortIds.map(getVendorById).filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="card">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl">
            {rfp.coupleNames || "Wedding"}
          </h2>
          <span className="chip">Status: {rfp.status}</span>
        </div>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <Fact k="Date" v={rfp.eventDate} />
          <Fact k="City" v={rfp.city} />
          <Fact k="Venue" v={rfp.venue || "Open to suggestions"} />
          <Fact k="Guests" v={rfp.guestCount || "—"} />
          <Fact
            k="Budget"
            v={rfp.budget ? `$${Number(rfp.budget).toLocaleString()}` : "—"}
          />
          <Fact k="Culture" v={culture?.name || "—"} />
        </div>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-ink/50">
            Services requested
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
          <p className="mt-4 rounded-xl bg-sand p-3 text-sm text-ink/80">
            <strong>Notes for vendors:</strong> {rfp.notes}
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-2xl">Bids ({bids.length})</h3>
          <Link
            href={`/weddings/view?id=${rfp.id}`}
            className="text-sm font-semibold text-rose-700 hover:underline"
          >
            View vendor-facing page →
          </Link>
        </div>
        {bids.length === 0 ? (
          <div className="card text-ink/60">
            No bids yet. As vendors view your wedding, their sealed bids will
            appear here, sorted lowest to highest.
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((b, idx) => (
              <BidRow key={b.id} bid={b} winning={idx === 0} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-2xl">Shortlist</h3>
        {shortVendors.length === 0 ? (
          <div className="card mt-3 text-ink/60">
            Save your favourite vendors here while you're browsing the
            directory. Open any vendor page → "Add to shortlist".
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {shortVendors.map((v) => (
              <div key={v.id} className="card flex items-start gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-rose-100 text-3xl">
                  {v.emoji}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/vendors/${v.id}`}
                    className="font-display text-lg hover:text-rose-700"
                  >
                    {v.name}
                  </Link>
                  <div className="text-xs text-ink/60">{v.city}</div>
                </div>
                <button
                  className="text-xs text-ink/50 hover:text-rose-700"
                  onClick={() => unshortlist(rfp.id, v.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BidRow({ bid, winning }) {
  const vendor = getVendorById(bid.vendorId);
  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-soft ${
        winning ? "border-rose-400 bg-rose-50" : "border-ink/10 bg-cream"
      }`}
    >
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-cream text-3xl">
        {vendor?.emoji || "🎀"}
      </div>
      <div className="flex-1">
        <div className="font-display text-xl">
          {bid.vendorName || vendor?.name}
          {winning && (
            <span className="ml-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream">
              Best price
            </span>
          )}
        </div>
        <div className="text-sm text-ink/70">{bid.message}</div>
        <div className="mt-1 text-xs text-ink/50">
          {bid.serviceLabel} ·{" "}
          {new Date(bid.createdAt).toLocaleDateString()} ·{" "}
          {bid.vendorEmail}
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-3xl text-rose-700">
          ${Number(bid.amount).toLocaleString()}
        </div>
        {vendor && (
          <Link
            href={`/vendors/${vendor.id}`}
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            View vendor →
          </Link>
        )}
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink/50">{k}</div>
      <div className="text-ink">{v || "—"}</div>
    </div>
  );
}
