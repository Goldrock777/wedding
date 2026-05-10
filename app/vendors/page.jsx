"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  allServices,
  cities,
  cultures,
  seedVendors,
  serviceCategories,
} from "@/lib/catalog";
import VendorCard from "@/components/VendorCard";

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsBrowser />
    </Suspense>
  );
}

function VendorsBrowser() {
  const params = useSearchParams();
  const [service, setService] = useState(params.get("service") || "");
  const [culture, setCulture] = useState(params.get("culture") || "");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return seedVendors.filter((v) => {
      if (service && !v.services.includes(service)) return false;
      if (culture && !v.cultures.includes(culture)) return false;
      if (city && v.city !== city) return false;
      if (maxPrice && v.priceFrom > Number(maxPrice)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${v.name} ${v.tagline} ${v.bio} ${v.city}`.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [service, culture, city, maxPrice, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl">Vendors</h1>
      <p className="mt-2 text-ink/60">
        Filter by service, culture, city or budget.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="space-y-3 self-start">
          <div>
            <label className="label">Search</label>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Service</label>
            <select className="select" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">All</option>
              {serviceCategories.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((i) => (
                    <option key={i.slug} value={i.slug}>{i.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Culture</label>
            <select className="select" value={culture} onChange={(e) => setCulture(e.target.value)}>
              <option value="">Any</option>
              {cultures.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">City</label>
            <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Any</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Max price</label>
            <input
              className="input"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
          <button
            className="btn-secondary w-full"
            onClick={() => {
              setService("");
              setCulture("");
              setCity("");
              setMaxPrice("");
              setQuery("");
            }}
          >
            Reset
          </button>
        </aside>

        <div>
          <div className="mb-3 text-sm text-ink/60">
            {filtered.length} vendors
            {service && ` · ${allServices.find((s) => s.slug === service)?.name}`}
            {culture && ` · ${cultures.find((c) => c.slug === culture)?.name}`}
          </div>
          {filtered.length === 0 ? (
            <p className="text-ink/60">No vendors match — try widening your filters.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
