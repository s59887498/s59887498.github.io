# Itinerary Data Schema

Use one top-level object named `tripData`.

Core fields:

```js
{
  title: "台南兩天一夜",
  dateRange: "2026.07.18 - 2026.07.19",
  note: "Short current-plan summary.",
  summary: "Route logic and trip intent.",
  reminders: ["Concrete reminders"],
  days: [{ id, date, weekday, title, items }]
}
```

Stop item:

```js
{
  type: "stop",
  time: "16:20",
  durationMins: 75,
  title: "Place name",
  category: "漢堡",
  status: "建議安排",
  address: "Full address or uncertainty",
  mapUrl: "https://...",
  image: "assets/thumb-burger.svg",
  imageAlt: "Image description",
  businessStatus: "營業待確認",
  businessNote: "Optional source or caveat.",
  note: "Why this stop belongs here.",
  tags: ["早晚餐", "國華街"]
}
```

Movement item:

```js
{
  type: "drive",
  mode: "開車", // 開車, 步行, 步行/叫車, 計程車
  time: "13:55",
  from: "A",
  to: "B",
  travelMins: 20,
  parkingMins: 10,
  note: "Buffer logic."
}
```

Rules:

- Use `travelMins` for all movement modes so walking, taxis, and driving can share totals.
- Use `parkingMins: 0` for walking legs.
- Keep optional or uncertain places as normal stop items with `status` showing the uncertainty.
- For timed stops, include `businessStatus`: `營業中`, `營業待確認`, `戶外全天`, `未營業`, or a concise equivalent.
- Do not keep `未營業` places in the primary timeline. Move them to reminders, notes, or an optional backup section.
- Prefer original Google Maps short links for user-provided places; use search or direction URLs for generated route links.
