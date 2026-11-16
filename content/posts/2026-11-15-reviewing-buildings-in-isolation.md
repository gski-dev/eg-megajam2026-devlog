---
title: "A smaller stage for bigger bases"
date: "2026-11-15T10:00:00-05:00"
category: Buildings & iteration
description: "Three faction sandboxes make construction states, shared footprints, and base progression easier to inspect."
---

A building is more than its completed model. It has to make sense while it is being constructed, damaged, repaired, and destroyed. It also has to fit the base around it.

We now have a dedicated building review level for each of the three factions. These sandboxes put the presentation states and the base layout in one place without requiring a full match to inspect them.

## One family, five states

The imported catalog contains 33 building families across Humans, Elves, and Goblins. Each family has five presentation states: early construction, late construction, complete, damaged, and destroyed.

A shared native sandbox implementation controls the review sequence and supports pausing, replaying, and changing a site’s state. Keeping that behavior shared makes a faction comparison more useful: the architecture changes, while the review controls remain consistent.

## Make the footprint explicit

The current layout uses 15 × 15 metre HQ footprints and 12 × 12 metre footprints for other buildings and pads. Home progression opens three, then five, then seven general pads. Retained sites keep their positions as tiers change.

That constraint forces a practical question early: can the building, foundation, paths, and adjacent troops occupy the space together? A pleasing model in isolation is only part of the answer.

The revised sandboxes scale pads and buildings together. This makes scale comparisons correspond to the whole site rather than changing the building and foundation independently.

## What is checked—and what still needs eyes

The development record reports a successful native build, saved map and asset references, and the expected tier assignments. Focused cadence checks cover construction boundaries, pause and resume, cancellation, and independent sites.

Those checks establish the technical setup. They do not establish that a doorway looks right, that every transition reads clearly, or that troops feel comfortable moving through the base. Visual and gameplay review remain pending.

## The next review

Inspect the complete faction layouts from the strategy camera, compare all five states, and check the same footprint with representative troops. Corrections from that review should feed back into the family and its shared constraints.
