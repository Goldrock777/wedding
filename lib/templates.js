// Default budget split, planning checklist and day-of timeline templates.
// Couples can edit any of these in the planner.

export const budgetTemplate = [
  { category: "Venue", label: "Ceremony + reception venue", share: 0.3 },
  { category: "Catering", label: "Food & service", share: 0.18 },
  { category: "Catering", label: "Bar / beverages", share: 0.05 },
  { category: "Photo & video", label: "Photographer", share: 0.06 },
  { category: "Photo & video", label: "Videographer", share: 0.04 },
  { category: "Decor", label: "Florals", share: 0.05 },
  { category: "Decor", label: "Lighting & rentals", share: 0.03 },
  { category: "Music", label: "DJ or band", share: 0.04 },
  { category: "Attire", label: "Bridal attire", share: 0.04 },
  { category: "Attire", label: "Groom attire", share: 0.02 },
  { category: "Attire", label: "Hair & makeup", share: 0.02 },
  { category: "Stationery", label: "Invitations & signage", share: 0.02 },
  { category: "Cake", label: "Cake & desserts", share: 0.02 },
  { category: "Transport", label: "Limo / shuttle", share: 0.02 },
  { category: "Officiant", label: "Officiant fee", share: 0.01 },
  { category: "Misc", label: "Favors & gifts", share: 0.02 },
  { category: "Misc", label: "Contingency", share: 0.08 },
];

// Extra budget rows added when a culture is set, so amounts don't get
// missed on the spreadsheet.
export const cultureBudgetExtras = {
  "south-asian": [
    { category: "Decor", label: "Mandap & stage decor", share: 0.04 },
    { category: "Music", label: "Dhol / baraat band", share: 0.01 },
    { category: "Beauty", label: "Mehndi artist", share: 0.01 },
    { category: "Attire", label: "Jewelry rental", share: 0.02 },
  ],
  "east-asian": [
    { category: "Attire", label: "Tea ceremony attire (qipao / hanbok)", share: 0.02 },
    { category: "Catering", label: "Tea ceremony service", share: 0.01 },
  ],
  jewish: [
    { category: "Decor", label: "Chuppah build", share: 0.02 },
    { category: "Officiant", label: "Ketubah artwork", share: 0.01 },
  ],
  "middle-eastern-persian": [
    { category: "Decor", label: "Sofreh aghd setup", share: 0.03 },
  ],
  "latin-american": [
    { category: "Music", label: "Mariachi / hora loca", share: 0.02 },
  ],
  "african-caribbean": [
    { category: "Attire", label: "Aso ebi / gele tying", share: 0.02 },
  ],
};

// Generic planning checklist, grouped by countdown bucket.
export const taskTemplate = [
  // 12+ months out
  { bucket: "12+ months", title: "Set the wedding date" },
  { bucket: "12+ months", title: "Set the total budget" },
  { bucket: "12+ months", title: "Draft the guest list" },
  { bucket: "12+ months", title: "Choose the wedding party" },
  { bucket: "12+ months", title: "Decide cultural / religious traditions" },

  // 9-12 months
  { bucket: "9–12 months", title: "Book the venue" },
  { bucket: "9–12 months", title: "Book the photographer" },
  { bucket: "9–12 months", title: "Book the caterer" },
  { bucket: "9–12 months", title: "Send save-the-dates" },
  { bucket: "9–12 months", title: "Book the wedding planner / coordinator" },

  // 6-9 months
  { bucket: "6–9 months", title: "Book DJ or band" },
  { bucket: "6–9 months", title: "Book the florist" },
  { bucket: "6–9 months", title: "Choose wedding attire" },
  { bucket: "6–9 months", title: "Book the officiant" },
  { bucket: "6–9 months", title: "Book hotel block for guests" },

  // 3-6 months
  { bucket: "3–6 months", title: "Send invitations" },
  { bucket: "3–6 months", title: "Book hair & makeup artist" },
  { bucket: "3–6 months", title: "Plan the honeymoon" },
  { bucket: "3–6 months", title: "Finalize ceremony script" },
  { bucket: "3–6 months", title: "Order wedding rings" },

  // 1-3 months
  { bucket: "1–3 months", title: "Final attire fittings" },
  { bucket: "1–3 months", title: "Apply for marriage license" },
  { bucket: "1–3 months", title: "Build seating chart" },
  { bucket: "1–3 months", title: "Build day-of timeline" },
  { bucket: "1–3 months", title: "Confirm all vendors" },

  // 1 month
  { bucket: "Final month", title: "Final headcount to caterer" },
  { bucket: "Final month", title: "Pay vendor balances" },
  { bucket: "Final month", title: "Rehearsal dinner planning" },
  { bucket: "Final month", title: "Pack honeymoon bags" },

  // Day before / of
  { bucket: "Day before", title: "Rehearsal" },
  { bucket: "Day before", title: "Drop welcome bags at hotel" },
  { bucket: "Day before", title: "Get a great night's sleep" },
];

export const cultureTaskExtras = {
  "south-asian": [
    { bucket: "3–6 months", title: "Book mehndi artist for bridal night" },
    { bucket: "3–6 months", title: "Book dhol player for baraat" },
    { bucket: "3–6 months", title: "Order pheras / mandap puja samagri" },
    { bucket: "1–3 months", title: "Sangeet rehearsals" },
    { bucket: "1–3 months", title: "Confirm priest / pandit / granthi / imam" },
  ],
  "east-asian": [
    { bucket: "3–6 months", title: "Plan tea ceremony order & participants" },
    { bucket: "1–3 months", title: "Order tea set & lai see envelopes" },
  ],
  jewish: [
    { bucket: "3–6 months", title: "Commission ketubah" },
    { bucket: "1–3 months", title: "Confirm chuppah holders" },
    { bucket: "1–3 months", title: "Plan tisch / bedeken & hora" },
  ],
  "middle-eastern-persian": [
    { bucket: "3–6 months", title: "Source sofreh aghd items" },
    { bucket: "1–3 months", title: "Confirm zaffa / dabke crew" },
  ],
  filipino: [
    { bucket: "3–6 months", title: "Choose principal sponsors & secondary sponsors" },
    { bucket: "1–3 months", title: "Order cord, veil, arras & coins" },
  ],
  "latin-american": [
    { bucket: "3–6 months", title: "Choose padrinos and madrinas" },
    { bucket: "1–3 months", title: "Plan hora loca timeline" },
  ],
  "african-caribbean": [
    { bucket: "3–6 months", title: "Order aso ebi for the bridal party" },
    { bucket: "1–3 months", title: "Confirm gele tier" },
  ],
};

export const dayOfTemplate = [
  { time: "08:00", title: "Hair & makeup begins", location: "Bridal suite" },
  { time: "11:00", title: "Photographer arrives" },
  { time: "12:30", title: "First look" },
  { time: "14:00", title: "Wedding party photos" },
  { time: "15:30", title: "Guests arrive" },
  { time: "16:00", title: "Ceremony" },
  { time: "16:45", title: "Family photos" },
  { time: "17:00", title: "Cocktail hour" },
  { time: "18:00", title: "Grand entrance & first dance" },
  { time: "18:30", title: "Dinner & toasts" },
  { time: "20:00", title: "Cake cutting" },
  { time: "20:30", title: "Open dance floor" },
  { time: "23:00", title: "Send-off" },
];

export const cultureDayOfExtras = {
  "south-asian": [
    { time: "14:30", title: "Baraat (groom's procession with dhol)" },
    { time: "15:00", title: "Milni & jaimala (garland exchange)" },
    { time: "15:30", title: "Mandap pheras (sacred fire vows)" },
    { time: "16:30", title: "Vidaai (bride's farewell)" },
  ],
  "east-asian": [
    { time: "11:00", title: "Tea ceremony with elders" },
  ],
  jewish: [
    { time: "15:00", title: "Tisch & ketubah signing" },
    { time: "15:30", title: "Bedeken (veiling)" },
    { time: "19:00", title: "The hora" },
  ],
  "middle-eastern-persian": [
    { time: "15:30", title: "Zaffa (musical procession)" },
    { time: "16:00", title: "Sofreh aghd ceremony" },
  ],
  filipino: [
    { time: "16:30", title: "Cord, veil & arras rites" },
    { time: "21:00", title: "Money dance" },
  ],
  "latin-american": [
    { time: "16:30", title: "Lazo & arras" },
    { time: "22:00", title: "Hora loca" },
  ],
  "african-caribbean": [
    { time: "11:30", title: "Gele tying & traditional attire" },
    { time: "21:30", title: "Money spray on the dance floor" },
  ],
};

export function buildBudget(totalBudget, culture) {
  const total = Number(totalBudget) || 0;
  const items = [
    ...budgetTemplate,
    ...(cultureBudgetExtras[culture] || []),
  ];
  const sumShares = items.reduce((acc, i) => acc + i.share, 0);
  return items.map((i, idx) => ({
    id: `bud_${idx}`,
    category: i.category,
    label: i.label,
    planned: total ? Math.round((i.share / sumShares) * total) : 0,
    actual: 0,
    notes: "",
  }));
}

export function buildTasks(culture) {
  const items = [...taskTemplate, ...(cultureTaskExtras[culture] || [])];
  return items.map((i, idx) => ({
    id: `tsk_${idx}`,
    bucket: i.bucket,
    title: i.title,
    done: false,
  }));
}

export function buildDayOf(culture) {
  const items = [...dayOfTemplate, ...(cultureDayOfExtras[culture] || [])]
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));
  return items.map((i, idx) => ({
    id: `evt_${idx}`,
    time: i.time,
    title: i.title,
    location: i.location || "",
    notes: "",
  }));
}

export const taskBuckets = [
  "12+ months",
  "9–12 months",
  "6–9 months",
  "3–6 months",
  "1–3 months",
  "Final month",
  "Day before",
];
