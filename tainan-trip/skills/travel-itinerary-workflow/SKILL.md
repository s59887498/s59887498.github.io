---
name: travel-itinerary-workflow
description: Build or update responsive static travel-itinerary websites from messy trip notes. Use when the user provides destinations, Google Maps links, lodging, travel dates, meal ideas, driving/walking legs, parking buffers, or asks to reuse the same workflow for another trip; includes itinerary ordering, data normalization, Apple-inspired UI guidance, and verification steps.
---

# Travel Itinerary Workflow

## Workflow

1. Resolve every place into `name`, `address`, `mapUrl`, rough area, and role in the trip.
2. Cluster stops geographically before choosing times. Prefer entering the city through outer stops, then parking once and walking dense city clusters.
3. Separate destination cards from movement legs. Movement legs should include travel mode, travel minutes, and parking or buffer minutes.
4. Add explicit uncertainty labels such as `待約地點`, `粗估`, `備案`, or `建議安排`; do not hide unknowns.
5. Keep all editable trip data in one top-level JS object named `tripData` when building a static HTML/CSS/JS site.
6. Render totals from data, not hand-written numbers.
7. Verify desktop and mobile layouts with a browser screenshot check before delivery.

## References

- Read `references/itinerary-data-schema.md` when creating or changing the `tripData` structure.
- Read `references/apple-inspired-ui.md` when the user asks for Apple-like, clean, premium, minimal, glass, or iOS-style presentation.

## Timing Heuristics

- Long intercity driving: add at least 20-40 minutes for rest stops and arrival friction.
- Dense old-city areas: avoid re-parking for nearby food and dessert stops; convert them into walking legs.
- Meals: beef soup 45-60 minutes, burger meals 60-80 minutes, dessert/ice 35-55 minutes, bars 120-180 minutes.
- Handoffs or errands: schedule the task duration plus 10 minutes before and after for finding the person, parking, or message delays.
- Late-night backup stops should be marked optional and depend on current opening hours.

## Output Checklist

- The website has per-day timeline sections, stop cards, movement legs, Google Maps links, addresses, thumbnails, and responsive behavior.
- The summary explains what is actually happening in the trip, not how the website works.
- The route notes say why the order is sensible.
- The final response names unresolved assumptions and what input would improve the next pass.
