import Link from "next/link";
import { allServices, cultures } from "@/lib/catalog";

export default function VendorCard({ vendor }) {
  const services = vendor.services
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter(Boolean);
  const cultureNames = vendor.cultures
    .map((slug) => cultures.find((c) => c.slug === slug)?.name)
    .filter(Boolean);
  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="block rounded-lg border border-ink/10 bg-cream p-5 transition hover:border-ink/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl">{vendor.name}</h3>
          <p className="mt-0.5 text-sm text-ink/60">{vendor.city}</p>
        </div>
        <span className="text-sm text-ink/60">★ {vendor.rating.toFixed(1)}</span>
      </div>
      <p className="mt-3 text-sm text-ink/70">{vendor.tagline}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {services.slice(0, 3).map((s) => (
          <span key={s.slug} className="chip">{s.name}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-sm">
        <span className="text-ink/50">{cultureNames.slice(0, 2).join(" · ")}</span>
        <span className="font-medium">from ${vendor.priceFrom.toLocaleString()}</span>
      </div>
    </Link>
  );
}
