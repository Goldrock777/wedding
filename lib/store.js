"use client";

import { buildBudget, buildDayOf, buildTasks } from "./templates";

// Tiny localStorage store for couples' RFPs, vendor profiles, bids
// and per-wedding planners (budget / checklist / day-of timeline).

const KEY = "knot-and-co-store-v2";

function read() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function write(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("knot-store-change"));
}

function defaultState() {
  return {
    rfps: [],
    bids: [],
    vendorApplications: [],
    shortlists: {},
    planners: {}, // rfpId -> { budget, tasks, dayOf }
  };
}

export function getState() {
  return read();
}

export function subscribe(cb) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb(read());
  window.addEventListener("knot-store-change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("knot-store-change", handler);
    window.removeEventListener("storage", handler);
  };
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(-3)}`;
}

export function createRfp(input) {
  const state = read();
  const rfp = {
    id: uid("rfp"),
    createdAt: Date.now(),
    status: "open",
    ...input,
  };
  state.rfps.unshift(rfp);
  state.planners[rfp.id] = {
    budget: buildBudget(input.budget, input.culture),
    tasks: buildTasks(input.culture),
    dayOf: buildDayOf(input.culture),
  };
  write(state);
  return rfp;
}

export function listRfps() {
  return read().rfps;
}

export function getRfp(id) {
  return read().rfps.find((r) => r.id === id);
}

export function bidsForRfp(id) {
  return read()
    .bids.filter((b) => b.rfpId === id)
    .sort((a, b) => a.amount - b.amount);
}

export function placeBid(input) {
  const state = read();
  const bid = { id: uid("bid"), createdAt: Date.now(), ...input };
  state.bids.push(bid);
  write(state);
  return bid;
}

export function joinAsVendor(input) {
  const state = read();
  const app = { id: uid("vnd"), createdAt: Date.now(), ...input };
  state.vendorApplications.unshift(app);
  write(state);
  return app;
}

export function shortlist(rfpId, vendorId) {
  const state = read();
  const list = state.shortlists[rfpId] || [];
  if (!list.includes(vendorId)) list.push(vendorId);
  state.shortlists[rfpId] = list;
  write(state);
}

export function unshortlist(rfpId, vendorId) {
  const state = read();
  state.shortlists[rfpId] = (state.shortlists[rfpId] || []).filter(
    (v) => v !== vendorId
  );
  write(state);
}

export function shortlistFor(rfpId) {
  return read().shortlists[rfpId] || [];
}

// ───── planner ─────

function getOrInitPlanner(state, rfpId) {
  if (state.planners[rfpId]) return state.planners[rfpId];
  const rfp = state.rfps.find((r) => r.id === rfpId);
  const planner = {
    budget: buildBudget(rfp?.budget, rfp?.culture),
    tasks: buildTasks(rfp?.culture),
    dayOf: buildDayOf(rfp?.culture),
  };
  state.planners[rfpId] = planner;
  return planner;
}

export function getPlanner(rfpId) {
  const state = read();
  return getOrInitPlanner(state, rfpId);
}

function mutate(rfpId, fn) {
  const state = read();
  const planner = getOrInitPlanner(state, rfpId);
  fn(planner);
  write(state);
}

// budget
export function addBudgetItem(rfpId, item) {
  mutate(rfpId, (p) =>
    p.budget.push({
      id: uid("bud"),
      category: item.category || "Misc",
      label: item.label || "Untitled",
      planned: Number(item.planned) || 0,
      actual: Number(item.actual) || 0,
      notes: item.notes || "",
    })
  );
}
export function updateBudgetItem(rfpId, id, patch) {
  mutate(rfpId, (p) => {
    const item = p.budget.find((b) => b.id === id);
    if (!item) return;
    Object.assign(item, patch);
  });
}
export function removeBudgetItem(rfpId, id) {
  mutate(rfpId, (p) => {
    p.budget = p.budget.filter((b) => b.id !== id);
  });
}

// tasks
export function toggleTask(rfpId, id) {
  mutate(rfpId, (p) => {
    const t = p.tasks.find((t) => t.id === id);
    if (t) t.done = !t.done;
  });
}
export function addTask(rfpId, item) {
  mutate(rfpId, (p) =>
    p.tasks.push({
      id: uid("tsk"),
      bucket: item.bucket || "1–3 months",
      title: item.title || "New task",
      done: false,
    })
  );
}
export function removeTask(rfpId, id) {
  mutate(rfpId, (p) => {
    p.tasks = p.tasks.filter((t) => t.id !== id);
  });
}

// day-of
export function addDayOfEvent(rfpId, evt) {
  mutate(rfpId, (p) =>
    p.dayOf.push({
      id: uid("evt"),
      time: evt.time || "12:00",
      title: evt.title || "Untitled",
      location: evt.location || "",
      notes: evt.notes || "",
    })
  );
}
export function updateDayOfEvent(rfpId, id, patch) {
  mutate(rfpId, (p) => {
    const e = p.dayOf.find((x) => x.id === id);
    if (e) Object.assign(e, patch);
  });
}
export function removeDayOfEvent(rfpId, id) {
  mutate(rfpId, (p) => {
    p.dayOf = p.dayOf.filter((x) => x.id !== id);
  });
}

// derived helpers
export function bidsByRfpId(rfpId) {
  return read().bids.filter((b) => b.rfpId === rfpId);
}

export function clearAll() {
  write(defaultState());
}
