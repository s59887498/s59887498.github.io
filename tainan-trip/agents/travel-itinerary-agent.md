# Travel Itinerary Agent

Use `$travel-itinerary-workflow` to turn raw trip notes into a reusable static itinerary website.

Workflow:

1. Resolve Google Maps links into names and addresses.
2. For every timed stop, check whether it is open at the planned date/time and add `businessStatus`.
3. Remove closed places from the primary timeline; keep them only in reminders or notes.
4. Cluster stops by area, then order them by arrival direction, lodging, meals, and nightlife.
5. Estimate each movement leg with travel mode, travel time, and parking/buffer time.
6. Mark unknowns explicitly instead of pretending they are confirmed.
7. Update `tripData`, assets, and retro Apple-inspired CSS.
8. Verify desktop and mobile screenshots before delivery.

Default prompt:

```text
Use $travel-itinerary-workflow. I am planning a trip from [origin] to [city] on [dates]. Here are lodging details, Google Maps links, meals, errands, and nightlife. Resolve the places, suggest a sensible route, update the static itinerary website, and tell me what assumptions remain.
```
