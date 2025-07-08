---
title: "Let's Make an NES Emulator! - Part 2: A Frankly Scary Amount of Progress Edition"
description: Somehow this project is actually starting to resemble something real and it's a little crazy?
date: 2025-07-07T20:07:21.343Z
thumbnail: "/img/thoughts/devlogs/nes-emulator/part-2/donkey-kong.png"
preview: ""
draft: false
tags:
    - devlog
    - gaming
    - nes-eumlator
categories:
    - blog
---

## Intro

So, after writing up [part 1](../part-1) of my progress log of the NES emulator I've been writing with Godot, I've made a pretty significant amount of progress. To start, I've made it a bit easier to load in ROMs and cleaned up the code a bit, which allowed me to put a basic pattern table viewer together, which shows all the 8x8 tiles a game uses to build sprites and background tiles.

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-2/pattern-table.png"
    class="center"
    alt="The emulator running, with a new window showing pattern table 1 of Donkey Kong. Pretty sure the palettes were completely wrong when I took this screenshot but all the tiles look right.">}}

In the grand scheme this isn't that major, but seeing visual evidence that my code was doing *something* was a really good feeling. After that, I got to work on the nametable viewer. After a few days of head-scratching and tweaking code, I ended up with this beautuful view:

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-2/nametable.png"
    class="center"
    alt="The nametable window. Running Donkey Kong again, and for some reason it's showing the level 75m?">}}

It worked. *It worked!* ...Not quite sure why it's showing 75m instead of the title screen or the attract mode, but this was undeniable proof that my emulator was at the very least capable of rendering an entire screen's worth of nametable data; The mechanisms that power this screen require the ROM to write data to the PPU registers and feed that data into the system one byte at a time, and this is what I ended up with. Definite progress was being made, but the fact that the system is hanging on this random screen meant there was a lot more work to be done.

After doing a bit of research I discovered that NESDev has a [huge selection of testing ROMs](https://www.nesdev.org/wiki/Emulator_tests) available, including [nestest](https://www.qmtpro.com/~nes/misc/nestest.txt), which I chose to use to test my instruction implementation. This also meant I had to implement basic controller support (though I learned after the fact that the ROM also included an automated run mode starting at a different address). Once that was out of the way, I tried running some tests, and the results were, uh, let's say less than good?

It took a good amount of research and fixing to even get my emulator to a point where it could show me the results of each test, but eventually I was able to see where I was failing and why. Cue several more rounds of testing and code fixes, and finally...

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-2/nestest-results.png"
    class="center"
    alt="The nametables for nestest, showing success for all the official opcode tests.">}}

Look at that, everything is finally working! And now, running Donkey Kong shows the fruits of my labor:

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-2/donkey-kong.png"
    class="center"
    alt="The nametables for Donkey Kong. This time it's actually rendering things properly, showing gameplay on the first level as expected. No sprites though, haven't gotten to that yet. Also I haven't implemented proper palette display yet. Baby steps!">}}

At this point the emulator seems to be able to boot into the title screen, enter gameplay, and run though all of ~Mario~**Jumpman's** lives, until game overing and returining to the title screen. There's still a lot to fix though unfortunately: Every now and then the nametable and palettes will get destroyed by garbage data which I suspect is due to PPU writes getting desynced, and it's very, *very* slow. Like, 5-7 frames per second slow. And that brings me to...

## Making the Thing Run Good

Yeah this has been far and away the most difficult part of this process so far. My emulator currently has extremely poor performance, to the point where even when the emulation thread is allowed to run full steam ahead without yielding to allow the Godot update loop to proceed, it still caps out at roughly 10% of the base NTSC refresh rate. I've tried all sorts of optimizations, I spent a good amount of time trying to make the logic for displaying the pattern/nametables more performant (I'm currently using a pretty hacky method of treating each 8x8 pixel region as its own bespoke texture and updating them as needed), I've tried to reduce the number of object creations and function calls per emulated instruction, but I'm still too far from my target of realtime emulation.

I'm also trying to figure out an optimization where, whenever an emulated frame is generated, I would have an intermediary object take the updated PPU data and maintain its own record of what bytes have changed. Then that object would pass along those changed values to the objects that display images to the screen, so that the whole thing doesn't need to be updated every frame. Of course, that fix won't be very meaningful so long as the NES emulation itself is as slow as it is.

I'm starting to think the real solution is going to be to rewite some or all of the code in C#, which should ideally give me a much higher optimization ceiling. Or maybe not!

## Next Steps

Implementing palette data for the nametables via the attribute tables is the most obvious next step, aside from more optimization. After that, maybe I'll focus on figuring out what exactly I need to do for sprites. I also want to try and run more of the test ROMs, which will probably require implementing a bunch of unofficial opcodes, as well as the more involved mappers. I have basically zero knowledge of waveforms or sample playback, so audio is still a huge longshot for me but I would like to try and tackle that eventually. Oh, and I still need to figure out why the nametable seems to get corrupted on occasion. Lots to do!