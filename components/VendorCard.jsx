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
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[5/3] w-full bg-gradient-to-br from-rose-100 via-sand to-gold-400/40">
        <div className="absolute inset-0 grid place-items-center text-7xl">
          {vendor.emoji}
        </div>
        {vendor.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream shadow">
            {vendor.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium text-ink/80 shadow">
          ★ {vendor.rating.toFixed(1)} · {vendor.reviews}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-2xl leading-tight">{vendor.name}</h3>
          <p className="text-sm text-ink/70">{vendor.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {services.slice(0, 3).map((s) => (
            <span key={s.slug} className="chip">
              <span>{s.icon}</span>
              {s.name}
            </span>
          ))}
          {services.length > 3 && (
            <span className="chip">+{services.length - 3} more</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-ink/5 pt-3 text-sm">
          <span className="text-ink/60">{vendor.city}</span>
          <span className="font-semibold text-rose-700">
            from ${vendor.priceFrom.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-ink/50">
          {cultureNames.slice(0, 3).join(" · ")}
        </div>
      </div>
    </Link>
  );
}
