"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { taskBuckets } from "@/lib/templates";
import {
  addBudgetItem,
  addDayOfEvent,
  addTask,
  getPlanner,
  getState,
  removeBudgetItem,
  removeDayOfEvent,
  removeTask,
  subscribe,
  toggleTask,
  updateBudgetItem,
  updateDayOfEvent,
} from "@/lib/store";

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <Planner />
    </Suspense>
  );
}

function Planner() {
  const params = useSearchParams();
  const initialRfp = params.get("rfp") || "";
  const initialTab = params.get("tab") || "budget";
  const [rfps, setRfps] = useState([]);
  const [active, setActive] = useState(initialRfp);
  const [tab, setTab] = useState(initialTab);
  const [planner, setPlanner] = useState(null);

  useEffect(() => {
    setRfps(getState().rfps);
    return subscribe((s) => {
      setRfps(s.rfps);
      if (active) setPlanner(s.planners[active] || null);
    });
  }, [active]);

  useEffect(() => {
    if (!active && rfps[0]) setActive(rfps[0].id);
  }, [rfps, active]);

  useEffect(() => {
    if (active) setPlanner(getPlanner(active));
  }, [active]);

  if (rfps.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">No weddings yet</h1>
        <p className="mt-2 text-ink/60">
          Post a wedding first — we'll build your budget, checklist and day-of
          timeline automatically.
        </p>
        <Link href="/post-wedding" className="btn-primary mt-6">
          Post a wedding
        </Link>
      </div>
    );
  }

  const rfp = rfps.find((r) => r.id === active);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl">Planner</h1>
      <p className="mt-2 text-ink/60">
        Budget, checklist and day-of timeline — auto-built around your wedding
        and culture.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          className="select max-w-sm"
          value={active}
          onChange={(e) => setActive(e.target.value)}
        >
          {rfps.map((r) => (
            <option key={r.id} value={r.id}>
              {r.coupleNames || "Wedding"} — {r.eventDate}
            </option>
          ))}
        </select>
        <Link href="/dashboard" className="btn-ghost">
          ← Dashboard
        </Link>
      </div>

      <nav className="mt-8 flex border-b border-ink/10">
        {[
          ["budget", "Budget"],
          ["tasks", "Checklist"],
          ["dayof", "Day-of timeline"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm transition ${
              tab === id
                ? "border-ink text-ink"
                : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {planner && tab === "budget" && (
          <BudgetTab rfp={rfp} budget={planner.budget} />
        )}
        {planner && tab === "tasks" && (
          <TasksTab rfp={rfp} tasks={planner.tasks} />
        )}
        {planner && tab === "dayof" && (
          <DayOfTab rfp={rfp} dayOf={planner.dayOf} />
        )}
      </div>
    </div>
  );
}

// ───────── Budget ─────────

function BudgetTab({ rfp, budget }) {
  const [draft, setDraft] = useState({ category: "Misc", label: "", planned: "" });

  const totals = useMemo(() => {
    const planned = budget.reduce((s, b) => s + Number(b.planned || 0), 0);
    const actual = budget.reduce((s, b) => s + Number(b.actual || 0), 0);
    return { planned, actual, target: Number(rfp?.budget || 0) };
  }, [budget, rfp]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const b of budget) {
      if (!map.has(b.category)) map.set(b.category, []);
      map.get(b.category).push(b);
    }
    return [...map.entries()];
  }, [budget]);

  function addItem() {
    if (!draft.label) return;
    addBudgetItem(rfp.id, draft);
    setDraft({ category: "Misc", label: "", planned: "" });
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Target budget" value={fmt(totals.target)} />
        <Stat label="Planned" value={fmt(totals.planned)} hint={hint(totals.planned, totals.target)} />
        <Stat label="Spent" value={fmt(totals.actual)} hint={hint(totals.actual, totals.target)} />
      </div>

      <div className="mt-6 space-y-6">
        {grouped.map(([cat, items]) => {
          const sumP = items.reduce((s, b) => s + Number(b.planned || 0), 0);
          const sumA = items.reduce((s, b) => s + Number(b.actual || 0), 0);
          return (
            <div key={cat} className="rounded-md border border-ink/10">
              <div className="flex items-center justify-between border-b border-ink/10 bg-cream px-4 py-2 text-sm">
                <div className="font-medium">{cat}</div>
                <div className="text-ink/60">
                  {fmt(sumA)} / {fmt(sumP)} planned
                </div>
              </div>
              <ul>
                {items.map((b) => (
                  <li
                    key={b.id}
                    className="grid grid-cols-12 items-center gap-2 border-b border-ink/5 px-4 py-2 text-sm last:border-b-0"
                  >
                    <input
                      className="col-span-5 bg-transparent focus:outline-none"
                      value={b.label}
                      onChange={(e) =>
                        updateBudgetItem(rfp.id, b.id, { label: e.target.value })
                      }
                    />
                    <input
                      className="col-span-3 rounded border border-ink/10 bg-cream px-2 py-1 text-right text-sm focus:border-ink focus:outline-none"
                      inputMode="numeric"
                      placeholder="planned"
                      value={b.planned}
                      onChange={(e) =>
                        updateBudgetItem(rfp.id, b.id, {
                          planned: Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                        })
                      }
                    />
                    <input
                      className="col-span-3 rounded border border-ink/10 bg-cream px-2 py-1 text-right text-sm focus:border-ink focus:outline-none"
                      inputMode="numeric"
                      placeholder="spent"
                      value={b.actual}
                      onChange={(e) =>
                        updateBudgetItem(rfp.id, b.id, {
                          actual: Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                        })
                      }
                    />
                    <button
                      className="col-span-1 text-ink/40 hover:text-ink"
                      title="Remove"
                      onClick={() => removeBudgetItem(rfp.id, b.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-2 rounded-md border border-ink/10 p-4 sm:grid-cols-[1fr_2fr_1fr_auto]">
        <input
          className="input"
          placeholder="Category"
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        />
        <input
          className="input"
          placeholder="Line item"
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
        />
        <input
          className="input"
          placeholder="Planned"
          inputMode="numeric"
          value={draft.planned}
          onChange={(e) =>
            setDraft({ ...draft, planned: e.target.value.replace(/[^0-9]/g, "") })
          }
        />
        <button className="btn-primary" onClick={addItem}>
          Add line
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-md border border-ink/10 p-4">
      <div className="text-xs text-ink/50">{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
      {hint && <div className="text-xs text-ink/60">{hint}</div>}
    </div>
  );
}
function fmt(n) {
  return `$${Number(n || 0).toLocaleString()}`;
}
function hint(part, total) {
  if (!total) return "";
  const pct = Math.round((part / total) * 100);
  return `${pct}% of target`;
}

// ───────── Tasks ─────────

function TasksTab({ rfp, tasks }) {
  const [draft, setDraft] = useState({ bucket: taskBuckets[3], title: "" });
  const grouped = useMemo(() => {
    const map = new Map(taskBuckets.map((b) => [b, []]));
    for (const t of tasks) {
      if (!map.has(t.bucket)) map.set(t.bucket, []);
      map.get(t.bucket).push(t);
    }
    return [...map.entries()];
  }, [tasks]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div className="rounded-md border border-ink/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{done} / {total} complete</span>
          <span className="text-ink/60">{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-ink/10">
          <div
            className="h-2 rounded-full bg-ink transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {grouped.map(([bucket, items]) =>
          items.length === 0 ? null : (
            <div key={bucket}>
              <h3 className="font-display text-lg">{bucket}</h3>
              <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                {items.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(rfp.id, t.id)}
                      className="mt-1 h-4 w-4 accent-ink"
                    />
                    <div
                      className={`flex-1 text-sm ${
                        t.done ? "text-ink/40 line-through" : ""
                      }`}
                    >
                      {t.title}
                    </div>
                    <button
                      onClick={() => removeTask(rfp.id, t.id)}
                      className="text-xs text-ink/40 hover:text-ink"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      <div className="mt-6 grid gap-2 rounded-md border border-ink/10 p-4 sm:grid-cols-[1fr_2fr_auto]">
        <select
          className="select"
          value={draft.bucket}
          onChange={(e) => setDraft({ ...draft, bucket: e.target.value })}
        >
          {taskBuckets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          className="input"
          placeholder="New task"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <button
          className="btn-primary"
          onClick={() => {
            if (!draft.title) return;
            addTask(rfp.id, draft);
            setDraft({ ...draft, title: "" });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ───────── Day-of ─────────

function DayOfTab({ rfp, dayOf }) {
  const [draft, setDraft] = useState({ time: "12:00", title: "", location: "" });
  const sorted = useMemo(
    () => [...dayOf].sort((a, b) => a.time.localeCompare(b.time)),
    [dayOf]
  );

  return (
    <div>
      <p className="text-sm text-ink/60">
        Drag-free editable schedule for the wedding day. Share the final version
        with your vendors.
      </p>

      <ol className="relative mt-6 border-l border-ink/15 pl-6">
        {sorted.map((e) => (
          <li key={e.id} className="relative mb-6 last:mb-0">
            <span className="absolute -left-[27px] top-2 h-2 w-2 rounded-full bg-ink" />
            <div className="grid gap-2 rounded-md border border-ink/10 p-3 sm:grid-cols-[100px_1fr_1fr_auto]">
              <input
                type="time"
                className="rounded border border-ink/10 bg-cream px-2 py-1 text-sm focus:border-ink focus:outline-none"
                value={e.time}
                onChange={(ev) =>
                  updateDayOfEvent(rfp.id, e.id, { time: ev.target.value })
                }
              />
              <input
                className="rounded border border-ink/10 bg-cream px-2 py-1 text-sm focus:border-ink focus:outline-none"
                placeholder="Event"
                value={e.title}
                onChange={(ev) =>
                  updateDayOfEvent(rfp.id, e.id, { title: ev.target.value })
                }
              />
              <input
                className="rounded border border-ink/10 bg-cream px-2 py-1 text-sm focus:border-ink focus:outline-none"
                placeholder="Location"
                value={e.location}
                onChange={(ev) =>
                  updateDayOfEvent(rfp.id, e.id, { location: ev.target.value })
                }
              />
              <button
                onClick={() => removeDayOfEvent(rfp.id, e.id)}
                className="text-ink/40 hover:text-ink"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2 grid gap-2 rounded-md border border-ink/10 p-4 sm:grid-cols-[100px_1fr_1fr_auto]">
        <input
          type="time"
          className="rounded border border-ink/10 bg-cream px-2 py-1 text-sm"
          value={draft.time}
          onChange={(e) => setDraft({ ...draft, time: e.target.value })}
        />
        <input
          className="input"
          placeholder="Event"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <input
          className="input"
          placeholder="Location"
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
        />
        <button
          className="btn-primary"
          onClick={() => {
            if (!draft.title) return;
            addDayOfEvent(rfp.id, draft);
            setDraft({ time: "12:00", title: "", location: "" });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
