---
title: "Mega Man 2 Quality of Life Fixes"
type: "detailed"
date: 2020-10-19T20:49:00-04:00
draft: false
caption: "A romhack I made for Mega Man 2 that adds a few quality of life improvements, including a recreation of the Energy Balancer feature, a fix for Quick Man's AI, an increased E-Tank cap, and more."
caption_mainpage: ""
thumbnail: "mega-man-qol-fixes/img/5477screenshot1.png"
thumbnail_alt: "Mega Man 2. Notice how many more E-Tanks I have (the original was limited to 4 and displayed them differently)."
thumbnail_mainpage: "img/5477screenshot1.png"
categories:
- blog
- projects
tags:
- mega-man
- romhack
---

This is a small set of quality-of-life fixes for Mega Man 2, incorporating some of the gameplay improvements found in later entries in the series.  

This hack makes the following changes to the game:

* Attempting to use an E-Tank when your health is full does not deplete your E-Tanks.
* E-Tanks are preserved on game over.
* When you have no weapon selected (or your current weapon has full energy), any energy pickups you collect will automatically be spent on your lowest weapon. (One of the Atomic Fire charging sounds is used to indicate that a weapon has been fully charged, similar to some of the later Mega Man games.)
* *1.1*: Redesigned the E-Tank display on the pause screen to match the lives display, and increased the E-Tank limit from 4 to 99.
* *1.1*: Collecting an E-Tank while you already have the max amount will no longer cause the collect sound to play.
* *1.1*: Fixed an issue with the original game causing lives to be capped at 98 instead of 99.
* *1.1*: Increased the ceiling height on a screen in Wily 4 where it was too low to dodge a Sniper Joe’s attacks.
* *1.1*: Fixed an issue with Quick Man’s behavior that caused him to get stuck in walls, making his movements more unpredictable than intended.
* *1.1*: Increased the text scroll speed on the “get equipped” screen.
* *1.2*: Updated password generator to cap E-Tanks at 4, due to issues with 4 E-Tanks.
* *1.2*: Sped up more UI elements (Mega Man flashing when receiving upgrades, screen flashing before Dr. Light’s messages).
* *1.2*: Added separate patches per feature, more documentation.

I've also begun writing a series of devlogs outlining my hack and how it works:
* [Making my Mega Man 2 ROM Hack, Part 1: The Energy Balancer](/thoughts/devlogs/romhacks/mm2_1/)

## Version History

- [1.2 (October 15, 2021)](zip/megaman2_qol_1_2.zip)
  - Updated password generator to cap E-Tanks at 4, due to issues with >4 E-Tanks.
  - Sped up more UI elements (Mega Man flashing when receiving upgrades, screen flashing before Dr. Light's messages).
  - Added separate patches per feature, more documentation.
- [1.1 (October 30, 2020)](zip/megaman2_qol_1_1.zip)
  - Redesigned the E-Tank display on the pause screen to match the lives display, and increased the E-Tank limit from 4 to 99.
  - Collecting an E-Tank while you already have the max amount will no longer cause the collect sound to play.
  - Fixed an issue with the original game causing lives to be capped at 98 instead of 99.
  - Increased the ceiling height on a screen in Wily 4 where it was too low to dodge a Sniper Joe’s attacks.
  - Fixed an issue with Quick Man’s behavior that caused him to get stuck in walls, making his movements more unpredictable than intended.
  - Increased the text scroll speed on the “get equipped” screen.
- 1.0 (October 19, 2020)
  - Attempting to use an E-Tank when your health is full does not deplete your E-Tanks.
  - E-Tanks are preserved on game over.
  - When you have no weapon selected (or your current weapon has full energy), any energy pickups you collect will automatically be spent on your lowest weapon. (One of the Atomic Fire charging sounds is used to indicate that a weapon has been fully charged, similar to some of the later Mega Man games.)
