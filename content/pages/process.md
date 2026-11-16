---
title: How we build
eyebrow: The development process
description: "A practical path from a design constraint to an asset, a system, and something we can review in the game."
---

## Start with the battlefield

A unit needs to be readable at strategy-camera distance. A base needs room for buildings and moving troops. A map needs routes that create choices. Those constraints come before extra detail.

We develop Humans, Elves, and Goblins around shared class roles. A consistent gameplay vocabulary lets the factions have distinct silhouettes and equipment without making every system a separate implementation.

## Move from references to game assets

The character pipeline connects visual reference work, generated 3D sources, preparation in Blender, and import into Unreal Engine. We preserve the source and make revisions alongside it.

1. **Define the role and reference.** Establish body proportions, equipment, faction identity, and the silhouette we want to read on the battlefield.
2. **Inspect the source.** Check the model, skeleton, materials, dimensions, and orientation before treating a generated asset as usable.
3. **Prepare the asset.** Consolidate supported materials into atlases, separate components where needed, and fit equipment to the actual body and rig.
4. **Import and connect.** Set up Unreal assets, animation, presentation components, and editable configuration.
5. **Review it in context.** Check scale, contact, motion, and clarity from the camera that players will use. Record corrections as a new iteration.

Generated assets are inputs to the process. Preparation, integration, and review determine whether they work in the game.

## Keep rules separate from presentation

Native C++ owns gameplay rules and action timing. Unreal assets provide models, materials, animation graphs, and editable presentation data. Python tools handle repeatable preparation and editor authoring.

This matters when an animation is interrupted or a frame takes longer than expected. A visual cue should reflect the gameplay state; it should not accidentally award damage twice or complete work that was canceled.

## Test pieces in focused sandboxes

The combat sandbox isolates selection, placement, squad orders, and class mechanics on open ground. The building sandboxes isolate faction layouts, construction stages, damage states, and footprint comparisons.

These spaces give a correction a smaller surface area. A new building state can be inspected without first finishing an economy, an opponent, and a complete match.

## Record what the evidence supports

| Evidence | What it establishes |
| --- | --- |
| Source or data check | The checked rules or records satisfy the specific assertions. |
| Native build | The changed source compiles for the target that was built. |
| Asset compile and save | The checked assets and references compile and persist. |
| Visual review | A person has inspected the stated appearance or motion. |
| Gameplay review | The stated interaction has been exercised in play. |

We keep technical completion and visual or gameplay acceptance separate. A saved animation set does not establish a convincing charge. A saved map does not establish a playable match.

## Publish the useful part

Each journal entry explains the problem, the decision, the evidence, and the next step. This site is a curated overview of the development work. Screenshots, clips, or diagrams should say what they show and which revision they belong to.

[Read the journal]({{base}}/journal/) to see that process applied to the project.
