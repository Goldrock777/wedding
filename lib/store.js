"use client";

// Tiny localStorage store for couples' RFPs, vendor profiles and bids.
// Keeps the demo functional without a database.

const KEY = "knot-and-co-store-v1";

function read() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
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
    rfps: [], // weddings posted by couples
    bids: [], // bids placed by vendors on rfps
    vendorApplications: [], // vendors who joined the platform
    shortlists: {}, // rfpId -> [vendorId]
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

export function bidsByEmail(email) {
  return read().bids.filter((b) => b.vendorEmail === email);
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

export function clearAll() {
  write(defaultState());
}
