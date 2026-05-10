"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  cities,
  cultures,
  serviceCategories,
} from "@/lib/catalog";
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

  const [step, setStep] = useState(1);
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

  function submit() {
    const rfp = createRfp(form);
    if (inviteVendor) shortlist(rfp.id, inviteVendor);
    router.push(`/dashboard?new=${rfp.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
      <div className="mb-8">
        <span className="chip">Post your wedding</span>
        <h1 className="mt-3 font-display text-5xl">Tell us about your day.</h1>
        <p className="mt-2 max-w-2xl text-ink/70">
          The more we know, the better the bids you'll receive. Takes about 3
          minutes — and it's always free.
        </p>
      </div>

      <Stepper step={step} />

      <div className="card mt-6">
        {step === 1 && (
          <Step1 form={form} update={update} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            form={form}
            toggleService={toggleService}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            update={update}
            onBack={() => setStep(2)}
            onSubmit={submit}
            inviteVendor={inviteVendor}
          />
        )}
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const steps = ["The basics", "The vendors", "Review & post"];
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-rose-600 text-cream"
                  : done
                  ? "bg-rose-200 text-rose-800"
                  : "bg-ink/10 text-ink/60"
              }`}
            >
              {n}
            </span>
            <span className={active ? "font-semibold" : "text-ink/60"}>{s}</span>
            {n < steps.length && <span className="text-ink/30">/</span>}
          </li>
        );
      })}
    </ol>
  );
}

function Step1({ form, update, onNext }) {
  const ready =
    form.coupleNames && form.email && form.eventDate && form.city;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Couple's names" full>
        <input
          className="input"
          placeholder="e.g. Priya & Daniel"
          value={form.coupleNames}
          onChange={(e) => update("coupleNames", e.target.value)}
        />
      </Field>
      <Field label="Email">
        <input
          className="input"
          type="email"
          placeholder="hello@yourwedding.ca"
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
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Venue (optional)">
        <input
          className="input"
          placeholder="If you've already chosen one"
          value={form.venue}
          onChange={(e) => update("venue", e.target.value)}
        />
      </Field>
      <Field label="Guest count">
        <input
          className="input"
          inputMode="numeric"
          placeholder="e.g. 250"
          value={form.guestCount}
          onChange={(e) =>
            update("guestCount", e.target.value.replace(/[^0-9]/g, ""))
          }
        />
      </Field>
      <Field label="Approximate total budget (CAD)">
        <input
          className="input"
          inputMode="numeric"
          placeholder="e.g. 80000"
          value={form.budget}
          onChange={(e) =>
            update("budget", e.target.value.replace(/[^0-9]/g, ""))
          }
        />
      </Field>
      <Field label="Wedding culture / style" full>
        <select
          className="select"
          value={form.culture}
          onChange={(e) => update("culture", e.target.value)}
        >
          <option value="">Select one (or fusion)</option>
          {cultures.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2 flex justify-end">
        <button
          className="btn-primary disabled:opacity-40"
          disabled={!ready}
          onClick={onNext}
        >
          Next: vendors →
        </button>
      </div>
    </div>
  );
}

function Step2({ form, toggleService, onBack, onNext }) {
  return (
    <div>
      <h2 className="font-display text-2xl">Which vendors do you need?</h2>
      <p className="mt-1 text-sm text-ink/60">
        Pick everything you want bids on. You can change this later.
      </p>
      <div className="mt-6 space-y-6">
        {serviceCategories.map((g) => (
          <div key={g.group}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="font-display text-lg">{g.group}</h3>
              <span className="text-xs text-ink/50">
                {form.services.filter((s) =>
                  g.items.some((i) => i.slug === s)
                ).length}{" "}
                selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((i) => {
                const active = form.services.includes(i.slug);
                return (
                  <button
                    key={i.slug}
                    type="button"
                    onClick={() => toggleService(i.slug)}
                    className={`chip transition ${
                      active
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "hover:border-rose-300"
                    }`}
                  >
                    <span>{i.icon}</span>
                    {i.name}
                    {active && <span className="ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn-primary disabled:opacity-40"
          disabled={form.services.length === 0}
          onClick={onNext}
        >
          Next: review →
        </button>
      </div>
    </div>
  );
}

function Step3({ form, update, onBack, onSubmit, inviteVendor }) {
  return (
    <div>
      <h2 className="font-display text-2xl">Anything else vendors should know?</h2>
      <textarea
        className="textarea mt-3 min-h-[140px]"
        placeholder="Mention must-haves, accessibility needs, must-not-haves, religious requirements, parking, dietary restrictions, etc."
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
      />
      <div className="mt-6 grid gap-3 rounded-2xl bg-rose-50 p-5 text-sm text-rose-900">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💌</span>
          <div>
            <strong className="font-semibold">What happens next?</strong>
            <p className="mt-1 text-rose-900/80">
              Your wedding goes live in our matching engine. Vetted vendors in{" "}
              <strong>{form.city || "your area"}</strong> who match your
              services will receive your wedding and place sealed bids in your
              dashboard.
            </p>
          </div>
        </div>
      </div>
      {inviteVendor && (
        <div className="mt-3 rounded-2xl bg-gold-400/20 p-4 text-sm">
          You arrived via a vendor invite — they'll be auto-shortlisted on this
          wedding.
        </div>
      )}
      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-primary" onClick={onSubmit}>
          Post my wedding
        </button>
      </div>
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
