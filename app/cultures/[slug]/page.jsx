"use client";

import { use } from "react";
import Link from "next/link";
import { getCultureBySlug, seedVendors, serviceCategories } from "@/lib/catalog";
import VendorCard from "@/components/VendorCard";

export default function CulturePage({ params }) {
  const { slug } = use(params);
  const culture = getCultureBySlug(slug);
  if (!culture) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Culture not found</h1>
        <Link href="/cultures" className="btn-primary mt-6">
          Back to cultures
        </Link>
      </div>
    );
  }
  const vendors = seedVendors.filter((v) => v.cultures.includes(slug));
  return (
    <div>
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${culture.accent}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
          <Link href="/cultures" className="btn-ghost mb-2">
            ← All cultures
          </Link>
          <h1 className="font-display text-5xl sm:text-7xl">{culture.name} weddings</h1>
          <p className="mt-3 max-w-2xl text-lg italic text-ink/80">
            {culture.hero}
          </p>
          <p className="mt-4 max-w-2xl text-ink/80">{culture.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/post-wedding?culture=${culture.slug}`}
              className="btn-primary"
            >
              Post a {culture.name} wedding
            </Link>
            <Link
              href={`/vendors?culture=${culture.slug}`}
              className="btn-secondary"
            >
              Filter all vendors
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="divider-fancy mb-8 max-w-md">
          {vendors.length} curated {culture.name} vendors
        </div>
        {vendors.length === 0 ? (
          <div className="card text-center text-ink/60">
            We're onboarding vendors here — be the first to post and we'll
            invite our top {culture.name} vendors to bid directly.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <h2 className="font-display text-3xl">
            Vendor types {culture.name} couples typically book
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((g) => (
              <div key={g.group} className="rounded-xl bg-cream p-4">
                <div className="text-xs uppercase tracking-wider text-ink/50">
                  {g.group}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.items.map((i) => (
                    <Link
                      key={i.slug}
                      href={`/vendors?service=${i.slug}&culture=${culture.slug}`}
                      className="chip hover:border-rose-300 hover:text-rose-700"
                    >
                      <span>{i.icon}</span>
                      {i.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
