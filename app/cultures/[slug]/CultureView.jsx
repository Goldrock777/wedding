"use client";

import Link from "next/link";
import { getCultureBySlug, seedVendors, serviceCategories } from "@/lib/catalog";
import VendorCard from "@/components/VendorCard";

export default function CultureView({ slug }) {
  const culture = getCultureBySlug(slug);
  if (!culture) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Culture not found</h1>
        <Link href="/cultures" className="btn-primary mt-6">
          Back to cultures
        </Link>
      </div>
    );
  }
  const vendors = seedVendors.filter((v) => v.cultures.includes(slug));
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/cultures" className="text-sm text-ink/60 hover:text-ink">
        ← All cultures
      </Link>
      <h1 className="mt-4 font-display text-4xl">{culture.name}</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{culture.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/post-wedding?culture=${culture.slug}`} className="btn-primary">
          Post a {culture.name} wedding
        </Link>
        <Link href={`/vendors?culture=${culture.slug}`} className="btn-secondary">
          Filter all vendors
        </Link>
      </div>

      <section className="mt-12 border-t border-ink/10 pt-10">
        <h2 className="font-display text-2xl">
          {vendors.length} {culture.name} vendors
        </h2>
        {vendors.length === 0 ? (
          <p className="mt-3 text-ink/60">
            We're onboarding vendors here — be the first to post and we'll invite
            top {culture.name} vendors to bid directly.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 border-t border-ink/10 pt-10">
        <h2 className="font-display text-2xl">Vendor types {culture.name} couples typically book</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((g) => (
            <div key={g.group}>
              <div className="text-xs font-medium uppercase tracking-wider text-ink/50">
                {g.group}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {g.items.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/vendors?service=${i.slug}&culture=${culture.slug}`}
                    className="chip hover:border-ink/40"
                  >
                    {i.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
