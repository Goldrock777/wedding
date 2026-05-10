"use client";

import { useState } from "react";
import Link from "next/link";
import { cities, cultures, serviceCategories } from "@/lib/catalog";
import { joinAsVendor } from "@/lib/store";

export default function VendorJoinPage() {
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({
    business: "",
    contactName: "",
    email: "",
    phone: "",
    city: cities[0],
    yearsActive: "",
    services: [],
    cultures: [],
    bio: "",
    portfolio: "",
  });

  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }
  function toggleArr(field, value) {
    setForm((s) => ({
      ...s,
      [field]: s[field].includes(value)
        ? s[field].filter((x) => x !== value)
        : [...s[field], value],
    }));
  }
  function submit(e) {
    e.preventDefault();
    setDone(joinAsVendor(form));
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Welcome, {form.business}.</h1>
        <p className="mt-2 text-ink/60">You can now browse open weddings and place bids.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/weddings" className="btn-primary">Browse weddings</Link>
          <Link href="/" className="btn-secondary">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl">Join as a vendor</h1>
      <p className="mt-2 text-ink/60">
        No monthly fees — you only pay when you book.
      </p>

      <form className="mt-8 space-y-6" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name" full>
            <input className="input" required value={form.business} onChange={(e) => update("business", e.target.value)} />
          </Field>
          <Field label="Contact name">
            <input className="input" required value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="input" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="City">
            <select className="select" value={form.city} onChange={(e) => update("city", e.target.value)}>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Years active">
            <input className="input" inputMode="numeric" value={form.yearsActive} onChange={(e) => update("yearsActive", e.target.value.replace(/[^0-9]/g, ""))} />
          </Field>
          <Field label="Portfolio URL" full>
            <input className="input" placeholder="https://" value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} />
          </Field>
          <Field label="About your work" full>
            <textarea className="textarea min-h-[80px]" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          </Field>
        </div>

        <div>
          <div className="text-sm font-medium">Services you offer</div>
          <div className="mt-3 space-y-3">
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
                        onClick={() => toggleArr("services", i.slug)}
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
        </div>

        <div>
          <div className="text-sm font-medium">Cultures you serve</div>
          <div className="mt-3 flex flex-wrap gap-1">
            {cultures.map((c) => {
              const on = form.cultures.includes(c.slug);
              return (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => toggleArr("cultures", c.slug)}
                  className={`chip ${on ? "chip-active" : "hover:border-ink/40"}`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" type="submit">Join</button>
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
