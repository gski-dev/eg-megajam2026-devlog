---
title: "From a roster to a squad sandbox"
date: "2026-11-14T12:00:00-05:00"
category: Combat & animation
description: "Connecting character production to shared squad rules, while keeping technical completion separate from playtest acceptance."
---

Character production has reached a useful point: all 60 canonical humanoid variants have saved action-animation assets. A dedicated combat sandbox now gives those characters a place to connect to squad selection, orders, and shared class rules.

The important next question is how those systems behave together in play.

## Keep identity separate from appearance

The three factions share nine combat archetypes and a Worker role. Runtime mechanics resolve through stable class identities. A unit’s model or asset name should not determine its balance or squad membership.

This lets us work on faction presentation without duplicating the underlying rules for each appearance. It also makes a shared class correction easier to apply consistently.

## Give timing one owner

The action runtime owns the action clock, cancellation, and once-only gameplay milestones. Animation presents those phases.

That separation matters during interruptions. A canceled reload should not silently grant a loaded weapon, and a delayed frame should not award the same action twice. The focused action-clock checks exercise those kinds of boundaries.

The saved production work includes infantry actions, weapon mechanisms, mounted coordination, companions, and defeat presentation. Their technical installation does not substitute for checking hand contact, seated posture, anticipation, or clarity at gameplay distance.

## Put the rules on open ground

The squad sandbox uses a separate 200 × 200 metre arena. It provides team staging, class-based placement, squad selection, movement and attack orders, and controls for starting or stopping combat.

The implementation includes the initial shared class mechanics, from braced melee and ranged projectiles to healing channels and cavalry charges. Open ground gives us a focused place to inspect those interactions before adding production, an economy, and a complete battlefield.

## What the current evidence says

The development reports record successful native compilation, canonical Blueprint and reference checks, saved presentation data, and passing focused combat data and rule tests. Animation production records distinguish technical completion from visual acceptance.

The recorded handoff did not include a playtest or rendered review. Actual placement, movement, fighting, animation clarity, and tuning still need to be exercised in Unreal.

## What comes next

Review a small set of opposing squads. Check the complete interaction: selection, order, movement, action timing, impact, interruption, and defeat. Then repeat with the matchups most likely to expose a problem.

The goal is a readable interaction we have observed, in addition to a system that compiles.
