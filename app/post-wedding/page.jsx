"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cities, cultures, serviceCategories } from "@/lib/catalog";
import { createRfp, shortlist } from "@/lib/store";

export default function PostWeddingPage() {
  return (
    <Suspense fallback={null}>
      <PostWeddingForm />
    </Suspense>
  );
}

function PostWeddingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const inviteVendor = params.get("invite") || "";
  const initialCulture = params.get("culture") || "";

  const [form, setForm] = useState({
    coupleNames: "",
    email: "",
    phone: "",
    eventDate: "",
    city: cities[0],
    venue: "",
    guestCount: "",
    budget: "",
    culture: initialCulture,
    services: [],
    notes: "",
  });

  useEffect(() => {
    if (initialCulture) setForm((f) => ({ ...f, culture: initialCulture }));
  }, [initialCulture]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function toggleService(slug) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(slug)
        ? f.services.filter((s) => s !== slug)
        : [...f.services, slug],
    }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.coupleNames || !form.email || !form.eventDate) return;
    if (form.services.length === 0) return;
    const rfp = createRfp(form);
    if (inviteVendor) shortlist(rfp.id, inviteVendor);
    router.push(`/dashboard?new=${rfp.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl">Post your wedding</h1>
      <p className="mt-2 text-ink/60">
        Free. Takes about 3 minutes. Vendors send you bids in your dashboard.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Couple's names" full>
            <input
              className="input"
              required
              value={form.coupleNames}
              onChange={(e) => update("coupleNames", e.target.value)}
              placeholder="e.g. Priya & Daniel"
            />
          </Field>
          <Field label="Email">
            <input
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              className="input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Event date">
            <input
              className="input"
              type="date"
              required
              value={form.eventDate}
              onChange={(e) => update("eventDate", e.target.value)}
            />
          </Field>
          <Field label="City">
            <select
              className="select"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Venue (optional)">
            <input
              className="input"
              value={form.venue}
              onChange={(e) => update("venue", e.target.value)}
            />
          </Field>
          <Field label="Guest count">
            <input
              className="input"
              inputMode="numeric"
              value={form.guestCount}
              onChange={(e) => update("guestCount", e.target.value.replace(/[^0-9]/g, ""))}
            />
          </Field>
          <Field label="Budget (CAD)">
            <input
              className="input"
              inputMode="numeric"
              value={form.budget}
              onChange={(e) => update("budget", e.target.value.replace(/[^0-9]/g, ""))}
            />
          </Field>
          <Field label="Culture / style" full>
            <select
              className="select"
              value={form.culture}
              onChange={(e) => update("culture", e.target.value)}
            >
              <option value="">Select one</option>
              {cultures.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>
        </section>

        <section>
          <div className="text-sm font-medium">Vendors you need bids on</div>
          <div className="mt-3 space-y-4">
            {serviceCategories.map((g) => (
              <div key={g.group}>
                <div className="text-xs text-ink/50">{g.group}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {g.items.map((i) => {
                    const on = form.services.includes(i.slug);
                    return (
                      <button
                        key={i.slug}
                        type="button"
                        onClick={() => toggleService(i.slug)}
                        className={`chip ${on ? "chip-active" : "hover:border-ink/40"}`}
                      >
                        {i.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Field label="Notes for vendors" full>
          <textarea
            className="textarea min-h-[100px]"
            placeholder="Must-haves, dietary needs, religious requirements, parking, etc."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </Field>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Post wedding
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, full, children }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
