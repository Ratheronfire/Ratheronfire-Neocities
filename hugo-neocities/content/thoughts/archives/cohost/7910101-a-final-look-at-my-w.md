---
title: "[Cohost Archive] A Final Look at My Work Part 1: Stinkoman 20X6 Remake"
date: 2024-10-18T12:00:00-04:00
type: cohost
original_date: 2024-09-30T15:12:47.387Z
categories:
- archived-posts
- blog
tags:
- cohost
- stinkoman
- homestar-runner
- godot
- gaming
original-tags:
- homestarrunner
- stinkoman
- godot
- gamedev
- Goodbye cohost
draft: false
---

{{< load-photoswipe >}}

Well, here we are at Cohost's grand finale. I figured now might be my last chance to do this, so while I still can I'd like to make a few posts highlighting what I've been up to these past few years.

First off is [Stinkoman 20X6](/projects/stinkoman/), my fanmade remake of the [Homestar Runner Flash game classic](https://homestarrunner.com/stinkogame), remade from the ground up in Godot.

I put out the 1.0 update just about a year ago today, alongside this trailer:

{{< youtube id="MitDNlfcgeM" class="yt yt-medium" >}}

---

When I first started working on my remake, the initial idea was to write a script that could read the orignal level data (stored in XML) and translate them into the new game's format automatically. Back in the days of the Homestar Runner Fanstuff Wiki [\(if you know, you know\)](/thoughts/archives/cohost/4024711-my-history-with-the) it was pretty common to make custom levels using this same format (alongside a bunch of level editor tools that are sadly lost to time now), and I wanted to be able to support those creation in some way.

Unfortunately I quickly realized that was just not going to happen. The original game played *very* fast and loose with its NES-based art assets, and made virtually zero attempt to conform to any sort of tilemap-based grid. As a result, I ended up having to restructure just about every level in the game, as well as all the level assets themselves.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/javaw_8Sh0GuewVR.png"
    alt="The background for the Z-Sabre fight in JPEXS, the tool I used to extract various assets from the Flash game."
>}}

Incidentally, extracting raw assets proved to be quite a pain. While [The Spriter's Resource](https://www.spriters-resource.com/browser_games/stinkoman20x6/) had a lot of what I needed, the vast majority of the assets hadn't yet been extracted. In addition, the SVG format used to encode most of the assets made it extremely difficult to directly export images 1:1, so I ended up having to painstakingly redraw so many assets by sight, including basically the entirety of the Z-Sabre boss arena.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/stinko_2.png"
    alt="My tileset for level 1. I took the original grass tiles and expanded on them to allow them to smoothly connect in a variety of configurations."
>}}

Since I was working in an engine with a bespoke solution for tile-based level making, I decided to redesign most of the original assets to make proper use of the engine's tools. Luckily, most of the assets were either based directly on sprites/tiles that conformed to powers of 2, or otherwise didn't require too much work to redesign.

Well, except for level 9.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/javaw_sGDejlK2Oj.png"
    alt="Level 9's orignal tiles as viewed in JPEXS. They exist in a handful of configurations (large blocks, small blocks, and rounded blocks) but offer very little flexibility for placing them."
>}}

The original level 9 assets were... very rough. The tiles the original game used were fairly basic, and were placed with very little concern for aesthetics.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/mpc-hc64_h55WypP2qY.png"
    alt="The original appearance of level 9. Level geometry seems to be randomly strewn about and the \"tiles\" do not connect."
>}}

There's a segment towards the end of 9-2 that really shows what I mean. I get what they were going for, but I never liked the look of these levels personally.

Interestingly, though, when the trailer for level 10 finally dropped, years and years after the game was assumed to be long dead, me and a friend briefly noticed some different tiles for level 9, which were never used in any version of the game.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/firefox_ag9Zg6MUCg.png"
    alt="The level 9 assets from the trailer. Although they're more detailed, they share the same basic shapes as the originals."
>}}

These tiles were a noted upgrade over the original, but still they felt out of place. Because they were redraws of tiles that were never properly designed to flow together, the new tiles made all the gaps that much more apparent. Still though, I felt there was enough there to work with, and so with help from my friend, I was able to convert these tiles into a format I was able to do much more with.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/stinkoman_W4xWFBDvui.png"
    alt="My take on level 9, in roughly the same area as the first screenshot of this level. This time, however, the tiles connect together more logically. resembling a wall of stone with overgrown roots and vines."
>}}

I tried to keep the same general layout as much as possible, but my version, in my opinion at least, looks much better than the original.

---

When I started working on this project, I never wanted to give the impression that I was trying to make an objectively superior version or anything like that. Really, my main concern was the fact that this game could easily have been lost to time with the eventual [death of Flash](https://homestarrunner.com/toons/flash-is-dead). I have a ton of respect for the original game, and so I wanted to make sure I was developing it in a way that respected the original developers' work.

In fact, I managed to catch their attention pretty early on.

https://twitter.com/StrongBadActual/status/1364058243807461376

Getting acknowledged publicly by the real, actual, canonical Strong Bad was one of the highlights of my life.

I've talked with Matt a couple times about the project (which, again, was very surreal), and while the door was left open to making my project more official, for the foreseeable future my project is entirely fan-made, and out of respect for the creators I'm hosting it directly on my website, as opposed to any marketplace where official Homestar games exist such as itch.io.

I haven't heard from Matt in a few years, but believe me when I say I'm just as open to discussing this project as I was on day 1.

---

For my remake I decided to add a handful of new features, most notably a time attack mode, allowing players to replay any level as Stinkoman or 1-Up. (Of course, this meant having to create a bunch of alternate character variants for all the different level configurations you can run into.)

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/stinkoman_u8U1FXrZ4O.png"
    alt="1-Up in level 4's time attack mode. Because 1-Up is the player character, his escort version is replaced with a new character 2-Up, loosely based on Homeschool Winner."
    caption="I was going to make this a palette swap of 1-Up originally, then inspiration struck."
>}}

Had to make this guy to replace 1-Up when playing level 4 as 1-Up.

I call him 2-Up.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/Godot_v3.5.2-stable_win64_qJwZAV3JFt.png"
    alt="The level editor with a bunch of assorted assets placed here and there, and the background set to the Z-Sabre fight arena."
>}}

I also created a level editor! ...Well, sorta. It's very buggy, and only has the bare essentials of an editor, but it's there! Someday I'll finish it, probably.

{{< youtube id="2OKvVPYtIVs" class="yt yt-medium" >}}

And I made my own custom character! Pan Pan is *mostly* finished, but I'm not sure I'm entirely happy with his controls at the moment. His controls are loosely based around the bounce shield from Sonic 3, plus the bomb bouncing mechanic for Plague Knight in the Shovel Knight DLCs and a bit of the Surge character mod for Sonic Robo Blast 2.

Basically, the idea is that by either charging an attack, or by bouncing, you enter an energized state where you move faster, bounce higher, and can unlease a burst attack that launches you higher than normal, deals damage in a large radius, and expends your energized state. In practice, though, this basically means you're at a disadvantage whenever you're not energized, so the design encourage you to bounce as often as possible, rather than doing basically anything else. Maybe that's a good thing though? I dunno.

I also have an idea kicking around for a Marzi-Mei+Cheatball character, but I haven't done basically anything on that yet. Someday!

I'd also like to give special thanks to [@Gfdgsgxgzgdrc](https://x.com/Gfdgsgxgzgdrc/status/1651421584618577931) on Twitter, who made some fantastic remastered of all the compressed music from the original version. With these versions, as well as a number of sound effects I tracked down to their original sources, the remake sounds much more crisp than the original version where the assets had to be compressed for the slower internet speeds of yesteryear.

---

I've had a history of not finishing projects I've started, so when I started working on Stinkoman I was very worried this was going to be another project that I dropped a few months in.

I still have trouble believing I actually managed to see this one through.

{{< figure
    class="center"
    src="img/cohost/7910101-a-final-look-at-my-w/Godot_v3.5.2-stable_win64_SBtFMLgdoP.png"
    alt="The end credits, featuring the long awaited fight between Stinkoman and Sticklyman."
>}}