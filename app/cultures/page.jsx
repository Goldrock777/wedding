import Link from "next/link";
import { cultures } from "@/lib/catalog";

export default function CulturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <span className="chip">Cultures</span>
      <h1 className="mt-3 font-display text-5xl">
        Find vendors who know your traditions.
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Wedding traditions vary wildly. We curate vendors by culture so the team
        you book has actually done what you're asking for.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map((c) => (
          <Link
            key={c.slug}
            href={`/cultures/${c.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-cream p-8 shadow-soft transition hover:-translate-y-1"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.accent}`}
            />
            <h3 className="font-display text-3xl">{c.name}</h3>
            <p className="mt-2 italic text-ink/60">{c.hero}</p>
            <p className="mt-4 text-sm text-ink/70">{c.blurb}</p>
            <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-rose-700">
              See vendors →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
