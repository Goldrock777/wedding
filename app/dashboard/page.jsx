"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  allServices,
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
    return subscribe(setState);
  }, []);
  useEffect(() => {
    if (newId) setActive(newId);
    else if (state.rfps[0]) setActive(state.rfps[0].id);
  }, [newId, state.rfps]);

  if (state.rfps.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">No weddings yet</h1>
        <p className="mt-2 text-ink/60">Post your first wedding to start receiving bids.</p>
        <Link href="/post-wedding" className="btn-primary mt-6">Post a wedding</Link>
      </div>
    );
  }

  const rfp = state.rfps.find((r) => r.id === active);
  const bids = rfp ? bidsForRfp(rfp.id) : [];
  const shortIds = rfp ? shortlistFor(rfp.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {newId && (
        <div className="mb-6 rounded-md border border-ink/20 bg-cream p-4 text-sm">
          Wedding posted. Open <Link href="/weddings" className="underline">open weddings</Link> in another tab to place a demo bid as a vendor.
        </div>
      )}
      <h1 className="font-display text-4xl">Your weddings</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          {state.rfps.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r.id)}
              className={`w-full rounded-md border p-3 text-left transition ${
                active === r.id ? "border-ink bg-cream" : "border-ink/10 hover:border-ink/30"
              }`}
            >
              <div className="font-medium">{r.coupleNames || "Untitled"}</div>
              <div className="text-xs text-ink/60">{r.eventDate} · {r.city}</div>
              <div className="mt-1 text-xs text-ink/60">
                {state.bids.filter((b) => b.rfpId === r.id).length} bids ·{" "}
                {(state.shortlists[r.id] || []).length} shortlisted
              </div>
            </button>
          ))}
          <Link href="/post-wedding" className="btn-secondary w-full">+ New wedding</Link>
        </aside>

        <div>{rfp && <RfpDetail rfp={rfp} bids={bids} shortIds={shortIds} />}</div>
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
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl">{rfp.coupleNames || "Wedding"}</h2>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <Fact k="Date" v={rfp.eventDate} />
          <Fact k="City" v={rfp.city} />
          <Fact k="Venue" v={rfp.venue || "—"} />
          <Fact k="Guests" v={rfp.guestCount || "—"} />
          <Fact k="Budget" v={rfp.budget ? `$${Number(rfp.budget).toLocaleString()}` : "—"} />
          <Fact k="Culture" v={culture?.name || "—"} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {services.map((s) => (
            <span key={s.slug} className="chip">{s.name}</span>
          ))}
        </div>
        {rfp.notes && (
          <p className="mt-3 rounded-md border border-ink/10 p-3 text-sm text-ink/70">
            {rfp.notes}
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Bids ({bids.length})</h3>
          <Link href={`/weddings/view?id=${rfp.id}`} className="text-sm text-ink/70 hover:text-ink">
            Vendor view →
          </Link>
        </div>
        {bids.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">
            No bids yet. New bids will appear here, sorted lowest to highest.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
            {bids.map((b, i) => (
              <BidRow key={b.id} bid={b} winning={i === 0} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-xl">Shortlist</h3>
        {shortVendors.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">
            Save favourite vendors here from any vendor page.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {shortVendors.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-md border border-ink/10 p-3">
                <Link href={`/vendors/${v.id}`} className="font-medium hover:underline">
                  {v.name}
                </Link>
                <button
                  className="text-xs text-ink/50 hover:text-ink"
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
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <div className="font-medium">
          {bid.vendorName}
          {winning && (
            <span className="ml-2 rounded-sm border border-ink/30 px-1.5 py-0.5 text-[10px] uppercase">
              best
            </span>
          )}
        </div>
        <div className="text-xs text-ink/60">{bid.serviceLabel} · {bid.vendorEmail}</div>
        {bid.message && <div className="mt-1 text-sm text-ink/70">{bid.message}</div>}
      </div>
      <div className="text-right">
        <div className="font-medium">${Number(bid.amount).toLocaleString()}</div>
        {vendor && (
          <Link href={`/vendors/${vendor.id}`} className="text-xs text-ink/60 hover:text-ink">
            View →
          </Link>
        )}
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  return (
    <div>
      <div className="text-xs text-ink/50">{k}</div>
      <div>{v || "—"}</div>
    </div>
  );
}
