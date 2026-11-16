---
title: From an idea to animation
eyebrow: Our development process
description: "How we used AI to research an idea, make a production plan, generate the visual library, and build toward animated characters in Unreal."
---

## 01 / Start with an idea, then research it

We wanted a high fantasy RTS with Humans, Elves, and Goblins. We gave that idea to AI and used the research to work through the roster, faction identities, architecture, equipment, and animation requirements. The research made the idea specific enough to build from: shared tactical roles, distinct silhouettes, and a consistent visual language.

The Humans became the blue, ivory, and gold Dawncrest Alliance. The Elves became the green, pearl, and lilac Verdant Star Court. The Goblins became the brass, coral, and teal Brightgear League. Each faction uses the same nine combat classes, with male and female variants, plus workers.

## 02 / Turn the research into a plan for AI

We used the research to write production plans and character descriptions. Those plans defined what to make, which references to use, how to keep the views consistent, and what the next stage would need. Instead of asking for an unspecified fantasy character, a brief could name the faction, role, hairstyle, costume, equipment, proportions, and required views.

We kept separate plans for character, building, equipment, and animation production. They gave subsequent AI work a shared source of direction rather than requiring each task to invent its own interpretation.

## 03 / Use the plans to generate sprite sheets

Imagegen turned the written descriptions into visual roster sheets: characters, class outfits and gear, mounts and companions, and buildings. Seeing the designs together helped establish the faction palettes and compare the class silhouettes. These are concept sprite sheets; the later action sheets serve a different job, showing a timed performance.

[Browse all 12 faction sprite sheets]({{base}}/sprite-sheets/).

## 04 / Generate four images for Tripo

For each character, building, and equipment design, we produced separate **front, left, back, and right** images with imagegen. The views needed to describe the same object: matching clothing, hair, proportions, construction, and equipment details. Dressed character sets include the class appearance, while held equipment and animal tack also have their own references.

Those images became the multiview inputs in Tripo Studio. We generated the 3D sources, textured them, rigged the humanoids, and exported the results for preparation and import. Characters use the UE5 Mannequin rigging option. Buildings and equipment follow static-model workflows. Our saved worker profile records mesh generation, 2K texturing, UE5 rigging, and GLB export as separate steps.

[Watch the Tripo recording and explore the four-view library]({{base}}/tripo/).

## 05 / Import the Tripo models and connect Unreal animation

We inspected the exported models, prepared their materials, established scale and orientation, and imported the character meshes and skeletons. Unreal's IK Rig and IK Retargeter tools helped transfer mannequin idle and walk animation onto compatible imported rigs. We baked those animations onto each target skeleton and connected them through animation Blueprints.

One practical lesson was scale: a retarget setup could map the chains successfully while a scaled imported rest skeleton still produced a collapsed body. Normalizing the mesh and armature before retargeting fixed that pilot. Matching UE5 bone names also did not mean every character could share one Unreal Skeleton asset; we retained skeleton-specific animation assets.

## 06 / Ask imagegen for the performance

We used character and equipment references to ask imagegen for **12 key poses in a 4 × 3 grid**. The brief specified a fixed camera, consistent character size and ground baseline, transparent space around each cell, and an ordered progression: ready, anticipation, acceleration, contact or release, follow-through, and recovery.

The [Elf assassin]({{base}}/examples/elf-assassin/) shows the weapon path and a single contact beat. The [Elf female mage]({{base}}/examples/elf-female-mage/) shows Starseed Lance and Constellation Garden studies. The [Human male mage]({{base}}/examples/human-male-mage/) shows a fireball cast and Prism Field. Companion sheets describe target contact, projectile flight and impact, or a separate field lifecycle.

## 07 / Make the flipbook, then build the animation

The HTML player crops each cell from its sheet and plays it using the saved keyframe timestamps. Those intervals are not necessarily equal: anticipation can hold longer than contact. We can step through the poses, scrub the timeline, slow the motion, and inspect the effects on light and dark backgrounds before handing the choreography onward.

The sheets and flipbooks guide 3D animation authoring. We use the poses, contact requirements, and event times to author and bake skeletal action clips for the imported Tripo characters, then connect the clips to Unreal animation graphs and gameplay action timing. The 2D pictures are visual references; skeletal animation requires the 3D posing, equipment contact, and per-rig adaptation work.

[Open the flipbook library]({{base}}/animations/). The published images and HTML previews show our generated visual references. They are not recordings of the final Unreal animation. Saved skeletal production and visual review are tracked separately; the production report does not include a final rendered gameplay capture.
