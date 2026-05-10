"use client";

import { useState } from "react";
import Link from "next/link";
import {
  cities,
  cultures,
  serviceCategories,
} from "@/lib/catalog";
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

  function update(f, v) {
    setForm((s) => ({ ...s, [f]: v }));
  }
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
    const app = joinAsVendor(form);
    setDone(app);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="chip">You're in</span>
        <h1 className="mt-3 font-display text-5xl">
          Welcome to Knot &amp; Co, {form.business}.
        </h1>
        <p className="mt-3 text-ink/70">
          We've added you to the vendor pool. Browse open weddings now and place
          your first bid.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/weddings" className="btn-primary">
            Browse open weddings
          </Link>
          <Link href="/vendor/join" className="btn-secondary" onClick={() => setDone(null)}>
            Add another vendor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
      <span className="chip">Join as a vendor</span>
      <h1 className="mt-3 font-display text-5xl">List your business.</h1>
      <p className="mt-2 max-w-2xl text-ink/70">
        Couples post weddings. We match them to vendors who fit. You bid on the
        ones that match your style — no monthly fees, you only pay when you
        book.
      </p>
      <form className="card mt-8 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
        <Field label="Business name" full>
          <input
            className="input"
            required
            value={form.business}
            onChange={(e) => update("business", e.target.value)}
          />
        </Field>
        <Field label="Contact name">
          <input
            className="input"
            required
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
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
        <Field label="Primary city">
          <select
            className="select"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Years active">
          <input
            className="input"
            inputMode="numeric"
            value={form.yearsActive}
            onChange={(e) =>
              update("yearsActive", e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </Field>
        <Field label="Portfolio / website" full>
          <input
            className="input"
            placeholder="https://"
            value={form.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
          />
        </Field>
        <Field label="Tell us about your work" full>
          <textarea
            className="textarea min-h-[100px]"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <label className="label">Services you offer</label>
          <div className="space-y-3">
            {serviceCategories.map((g) => (
              <div key={g.group}>
                <div className="text-xs uppercase tracking-wider text-ink/50">
                  {g.group}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {g.items.map((i) => {
                    const on = form.services.includes(i.slug);
                    return (
                      <button
                        key={i.slug}
                        type="button"
                        onClick={() => toggleArr("services", i.slug)}
                        className={`chip transition ${
                          on
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "hover:border-rose-300"
                        }`}
                      >
                        <span>{i.icon}</span>
                        {i.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Cultures you serve</label>
          <div className="flex flex-wrap gap-1.5">
            {cultures.map((c) => {
              const on = form.cultures.includes(c.slug);
              return (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => toggleArr("cultures", c.slug)}
                  className={`chip transition ${
                    on
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "hover:border-rose-300"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button className="btn-primary" type="submit">
            Join Knot &amp; Co
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
