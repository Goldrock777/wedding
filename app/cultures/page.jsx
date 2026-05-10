import Link from "next/link";
import { cultures } from "@/lib/catalog";

export default function CulturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl">Cultures</h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        Find vendors who know the traditions you're planning around.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map((c) => (
          <Link
            key={c.slug}
            href={`/cultures/${c.slug}`}
            className="rounded-md border border-ink/10 bg-cream p-5 transition hover:border-ink/30"
          >
            <div className="font-display text-xl">{c.name}</div>
            <p className="mt-1 text-sm text-ink/60">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
