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
  const initialService = params.get("service") || "";
  const initialCulture = params.get("culture") || "";
  const [service, setService] = useState(initialService);
  const [culture, setCulture] = useState(initialCulture);
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
        const hay = `${v.name} ${v.tagline} ${v.bio} ${v.city}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [service, culture, city, maxPrice, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <span className="chip w-max">Directory</span>
        <h1 className="font-display text-5xl">Find your vendors</h1>
        <p className="max-w-2xl text-ink/70">
          Filter by what you actually need — service, culture, city and budget.
          Click any vendor to view full details, packages and reviews.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="card sticky top-24 h-max">
          <h2 className="font-display text-xl">Filter</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="e.g. dholi, vineyard"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Service</label>
              <select
                className="select"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">All services</option>
                {serviceCategories.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map((i) => (
                      <option key={i.slug} value={i.slug}>
                        {i.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Culture</label>
              <select
                className="select"
                value={culture}
                onChange={(e) => setCulture(e.target.value)}
              >
                <option value="">Any culture</option>
                {cultures.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <select
                className="select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Any city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Max budget (CAD)</label>
              <input
                className="input"
                placeholder="e.g. 5000"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
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
              Reset filters
            </button>
          </div>
        </aside>
        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-ink/70">
            <span>
              <strong className="text-ink">{filtered.length}</strong> vendors
              {service
                ? ` · ${allServices.find((s) => s.slug === service)?.name}`
                : ""}
              {culture
                ? ` · ${cultures.find((c) => c.slug === culture)?.name}`
                : ""}
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="card text-center text-ink/60">
              No vendors match these filters yet — try widening your budget or
              culture.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
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
