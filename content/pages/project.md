---
title: A fantasy RTS, in progress
eyebrow: The project
description: "Our MegaJam 2026 development project brings a high fantasy roster, squad combat, and settlement progression into Unreal Engine."
---

## The idea

Build a strategy game around readable armies, distinct fantasy factions, and a battlefield where routes and settlements matter. Humans, Elves, and Goblins share tactical roles while expressing them through different characters, mounts, equipment, and architecture.

The roster covers nine combat archetypes—Melee, Ranged, Tank, Cavalry, Grenadier, Assassin, Scout, Healer, and Magic—plus Workers. Both male and female variants are represented across the three factions.

Pinewatch Vale is the working name of the first woodland battlefield. The planned skirmish pairs a Human player with an Elf AI. The saved map is a foundation for that match; full runtime integration is still ahead.

## Current state

Snapshot: **15 November 2026.** “Implemented” here describes saved technical work. The entries below identify review and integration still needed.

{{workstreams}}

## Pinewatch Vale

The authored layout uses a 400 × 400 metre envelope with two home bases, two guarded neutral settlements, a central road, and two woodland routes. Home sites reserve room for later building tiers.

<figure class="article-figure">
  <a href="{{base}}/assets/images/pinewatch-vale-overhead.svg"><img src="{{base}}/assets/images/pinewatch-vale-overhead.svg" alt="Pinewatch Vale design diagram showing home bases, routes, building sites, and candidate resource locations." width="1600" height="1300" loading="lazy"></a>
  <figcaption>Authored layout diagram, 15 November 2026. This is a design reference, not a gameplay capture or a measurement of navigation. Cache symbols mark candidate locations. <a href="{{base}}/assets/images/pinewatch-vale-overhead.svg">Open at full size ↗</a></figcaption>
</figure>

## The next questions

- Do squad movement and class interactions feel clear and responsive in play?
- Do the characters, equipment, animations, and building states read at gameplay distance?
- Can the map, economy, production, vision, and opponent come together as a coherent 1v1 loop?

These are development goals, rather than announced release features or dates.

## About this repository

This is the public development journal and its website source. The Unreal project is maintained separately. Posts summarize selected development work without requiring access to the game repository or its working files.

[Follow the journal]({{base}}/journal/) or [browse the public repository]({{githubUrl}}).
