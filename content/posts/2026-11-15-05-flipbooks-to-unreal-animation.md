---
title: "Using the references to author Unreal animation"
description: "Tripo character rigs, mannequin retargeting, and pose-sheet choreography meet in the skeletal animation pipeline."
date: "2026-11-15T18:00:00-05:00"
category: "Unreal animation"
---

## Establish the character's motion

After preparing and importing the Tripo characters, we used Unreal IK retargeting to bake mannequin idle and walk motion onto compatible imported skeletons. We kept the character-specific scale, rig, and equipment requirements explicit.

## Turn choreography into skeletal clips

The action sheets and timed flipbooks provide the poses, weight shifts, release moments, and recovery pattern for authored skeletal actions. Those actions are baked for each target rig and connected to Unreal animation graphs. Gameplay timing owns damage and other action results; a visual effect does not independently apply them.

The saved production report records authored animation assets and integration. The artwork published here is the generated visual reference, with browser playback, rather than a render of the completed Unreal animation.

[Read the animation workflow and explore the flipbooks]({{base}}/animations/).
