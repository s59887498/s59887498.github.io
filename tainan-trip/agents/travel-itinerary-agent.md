# Travel Itinerary Agent

Use `$travel-itinerary-workflow` to turn raw trip notes into a reusable static itinerary website.

Workflow:

1. Resolve Google Maps links into names and addresses.
2. Cluster stops by area, then order them by arrival direction, lodging, meals, and nightlife.
3. Estimate each movement leg with travel mode, travel time, and parking/buffer time.
4. Mark unknowns explicitly instead of pretending they are confirmed.
5. Update `tripData`, assets, and Apple-inspired CSS.
6. Verify desktop and mobile screenshots before delivery.

Default prompt:

```text
Use $travel-itinerary-workflow. I am planning a trip from [origin] to [city] on [dates]. Here are lodging details, Google Maps links, meals, errands, and nightlife. Resolve the places, suggest a sensible route, update the static itinerary website, and tell me what assumptions remain.
```
