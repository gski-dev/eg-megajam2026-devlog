---
title: "Pinewatch Vale: a battlefield before a match"
date: "2026-11-15T12:00:00-05:00"
category: World & systems
description: "A saved woodland map gives the project a place to come together. Connecting the gameplay is the next step."
---

Pinewatch Vale now exists as a saved Unreal level. It brings the authored woodland layout into the editor: ground modules, home reservations, building sites, route markers, trees, granite spurs, and a perimeter of mountains.

That is a useful milestone. It is also a specific one: the map is implemented, while the complete 1v1 match still needs integration.

## Give every route a purpose

The design uses a 400 × 400 metre battlefield. Two opposing homes connect through a central road and a pair of longer woodland routes. Two guarded neutral settlements create expansion opportunities away from the home bases.

We author the layout as data so that sites, routes, and reservations have stable identities. The 50 metre authoring grid helps organize the terrain; it is not a grid that players must build or move on.

<figure class="article-figure">
  <a href="{{base}}/assets/images/pinewatch-vale-overhead.svg"><img src="{{base}}/assets/images/pinewatch-vale-overhead.svg" alt="The authored Pinewatch Vale layout, with opposing homes, two neutral settlements, and three connecting routes." width="1600" height="1300" loading="lazy"></a>
  <figcaption>Authored layout diagram. Candidate cache locations are shown, rather than a simultaneous set of spawned rewards. This is not a saved-level export or a navigation result.</figcaption>
</figure>

## Reserve the space before filling it

Home layouts need to accommodate their later tiers from the beginning. Scenery placement preserves the building reservations and the authored route corridors. Visual dressing and gameplay collision have separate responsibilities: a tree that fills the view should not quietly become an unplanned traffic rule.

The map uses faction base art for the home pads and keeps future sites available. Camera bounds and minimap framing are scoped to this battlefield.

## What is checked

The development handoff records a successful native target check, compiled map-specific Blueprints and materials, saved map assets, 64 ground cells, and 30 distinct native site IDs.

The starting building and troop previews are editor-only placement guides. They are hidden in game and are not bound gameplay actors. Automatic simulation and economic AI remain disabled in this saved-map configuration.

No new play session, navigation sampling, or gameplay review was part of that map handoff. Route reachability, visual fit, and the feel of moving an army through the level remain open review items.

## What comes next

The economy, vision, and AI have source implementations and focused checks. The next step is to connect the saved level and world actors to those systems, then exercise the complete loop in Unreal.

The question changes from “do the pieces exist?” to “do they work together in a match?” That is the next useful entry to earn.
