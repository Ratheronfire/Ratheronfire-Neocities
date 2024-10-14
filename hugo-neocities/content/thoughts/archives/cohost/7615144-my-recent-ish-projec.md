---
title: "[Cohost Archive] My Recent-ish Projects"
date: 2024-11-25T00:00:00-04:00
type: cohost
hide_from_new: true
original_date: 2024-09-09T23:45:26.582Z
categories:
- archived-posts
- blog
tags:
- cohost
- stinkoman
- peasants-quest
- homestar-runner
- godot
- gaming
- romhack
- mega-man
- scenes-from-a-bot
original-tags:
- rip cohost
- godot
- gamedev
- stinkoman
- homestarrunner
- Peasant's Quest
- romhack
- mega man
- neocities
- Whose Line Is It Anyway
draft: false
---

{{< load-photoswipe >}}

Since Cohost is sadly shutting down soon, I thought I'd take this moment to quickly plug some of the projects I've been working on the past few years:

-----

# Stinkoman: Godot Remake

This is a fully playable remake of [Stinkoman 20X6](https://homestarrunner.com/stinkogame), a Mega Man styled Flash game from one of my all-time favorite sites of yesteryear, [Homestar Runner](https://homestarrunner.com).

{{< youtube MitDNlfcgeM >}}

This remake includes everything featured in the original games: All the levels, all the cutscenes, and the Stinkomanuél, as well as some quality of life improvements, a time attack mode, a boss rush, and high scores.

I also started working on adding a handful of extra characters. Pan-Pan is *mostly* finished, and I have a rough idea for a Marzi-Mei + Cheatball character that I want to try and create sometime.

Builds are available for PC/Mac/Linux/Android, as well the browser itself, naturally.

---

# Peasant's ReQuest

After finishing primary development on Stinkoman, I decided to start working on Peasant's Quest, also in Godot. While this game isn't nearly as far along as I'd like, I did post a proof-of-concept demo video to YouTube a little while back:

{{< youtube JrpGWipDNjk >}}

-----

# Age of Clicking

{{< figure
    class="center"
    src="img/cohost/7615144-my-recent-ish-projec/Godot_v4.3-stable_win64_u6gzQKnUh6.png"
    alt="A work-in-progress screenshot of Age of Clicking, with a bunch of pawns aimlessly walking around some trees."
>}}

Age of Clicking is arguably my most ambitious project, and one that I've tried to bring to fruition in three separate phases now. Honestly, the dev history of this game probably warrants its own separate post, but for now, a brief overview:

* Development started as an Angular-based browser game in summer of 2018. Initially I envisioned it as an Cookie Clicker styled take RuneScape (which, in retrospect, is basically just [Melvor Idle](https://melvoridle.com/). The game loop was fairly simple: harvesting resources (logs, ores, etc). which combined to create other resources (ingots mainly).
* The game gradually grew in scope, incorporating a world map and pawns that could be assigned to harvesting resources located in the world. Around this point, the concept started incorporating elements of games like Age of Empires and Factorio, as well as some tower defense concepts that never really coalesced.
* Eventually I realized that with my limited knowledge of Javascript, the game was simply becoming too big for its own good, so in early 2019 I reluctantly decided to restart the project from scratch in Unity. While I was able to more or less reach feature parity by the summer, I started a new job around then and my productivity on the game slowly waned. I came back to it every now and then, but never got super far with it.
* Earlier this year, I finally decided to revisit the project. Owing both to Unity becoming far more anti-consumer, my lack of exposure to Unity development in the years since, and just a general sense that the Unity version wasn't progressing how I'd like, I decided once again to restart the project, now in Godot. Since starting this version in July I think I've managed to implement just about everything the previous versions had, and then some.

I'd like to get a good bit more work done before I start posting about it more, but with Cohost nearing its end I wanted to get out at least something on the game. I've been sharing the odd screenshot of my progress on [my Discord server](https://discord.gg/M6rgZVkVuv) in lieu of a more official setting for the time being, if you're interested.

-----

# My Neocities Page

Websites! You hear about these things?

https://ratheronfire.com/

This has been a fun pet project of mine this past year. It started out as a hastily made edit of [this template](https://goblin-heart.net/sadgrl/projects/layout-builder/) (and you can totally tell, I left a lot of it as-is), and I've stapled more and more onto it since then. The pages are generated using the static site builder [Hugo](https://gohugo.io/), and the source code is publicly available [here](https://github.com/Ratheronfire/Ratheronfire-Neocities).

I've been treating the site as a repository of my projects, an archive for things I've posted elsewhere, as well as a general dumping ground for whatever isolated thoughts I have.

Some highlights include:

* [My project listing](/projects/)
* [Movie reviews](/thoughts/reviews/movies/the-lord-of-the-rings-the-two-towers/) mirrored from my [Letterboxd page](https://letterboxd.com/ratheronfire/), using a template based on [nex3](https://cohost.org/nex3)'s [Letterboxd generator](http://nex-3.com/cohost-letterboxd/).
* [My TV reviews](/thoughts/reviews/tv/star-trek-deep-space-nine/season_1/emissary/) (by which I mean my attempt to do episode-by-episode reviews of Deep Space 9 that began and ended with the first episode (I'll get back to it soon I swear))
* [My Advent of Code writeups](/thoughts/adventofcode/)
* Interactive slideshow exhibits of [me and my friends' Minecraft worlds](/projects/minecraft-worlds/castle/#0) (very work-in-progress)

-----

# Scenes From a Bot

I have... complicated feelings about Scenes From a Bot. Just to get this out of the way: this was a Twitter bot that used AI, but in my defense this was back in 2020-21, when the discussion around AI content hadn't really matured yet, and it was mostly seen as a weird and kind of bad tool to play around with.

The basic idea is similar to the Whose Line is it Anyway? game [Scenes From a Hat](https://www.youtube.com/watch?v=N21TK6V0LTs), where the host reads off a scene prompt, and the comedians have to act out short improvised skits based on it. The bot posted once every 2 hours, with a randomly generated prompt. Then, for the next hour and 45 minutes, players could respond with their own funny posts, and before the next round starts they would be randomly awarded points based on how many likes/retweets they got. The points reset at the end of the week because, of course, everything's made up and the points don't matter.

Also, on weekends the bot would switch over to Hoedown mode, where players would instead be given a random topic to write a [Hoedown](https://www.youtube.com/watch?v=hcJsYFdke1o) for. In addition to likes/retweets, for this game responses were also ranted based on syllable count and whether or not they rhymed.

Some of the prompts got pretty wild.

{{< figure
    class="center"
    src="img/cohost/7615144-my-recent-ish-projec/ElEpESfVcAAHp2O.png"
    alt="My all-time favorite prompt: \"Peanut butter and jelly sandwiches with names that sound like they'd make you grandma want to crawl out from under the couch\""
>}}

For April Fools, I prepared a couple special variants of the game. The first was Bots Form a Scene, where the bot now created responses in the style of Scenes From a Hat, and players had to come up with what they think the scene prompt might've been. The second April Fools, however was... much more ambitious.

For that event, I wrote a bunch of code to:

1. Generate an actual, working NES ROM with the prompt, complete with a Famitracker remix that I made of the Hoedown music. [Example ROM here.](https://storage.ratheronfire.com/whoseline.nes)
2. Record a video of the ROM in action.
3. Upload the video to Twitter in place of the regular image.

The bot has been dormant for about a year now (and in the wake of Twitter's whole situation, I've since moved it to both Reddit and Mastodon), and I've been a bit wary to touch it since then. I think that, if I ever do bring it back, I'm probably going to do away with the AI aspect and go back to plain, simple Markov chains, which it originally used before I started generating the posts.

We'll see.

-----

# Other Stuff

Not as much to say about these projects, but I figured they warranted at least some mention.

* [Mega Man 2 Quality of Life Fixes](/projects/mega-man-qol-fixes/) - I made a post on this ROMHack a little while back, but I figured I'd mention it again.
* [Game Maps](https://storage.ratheronfire.com/game-maps/) - One of my many, many projects in the "I swear I'm going to work on this some more eventually" folder. The basic idea was an interactive map for games, with a checklist of collectibles/bosses/objectives to help keep track of your progress.
* [Hades Run Suggester](https://storage.ratheronfire.com/hades-suggester/) - An Angular webapp that suggests random loadout options for Hades. Included lots of options for customizing desired features, including setting a maximum heat level for the Pact of Punishment.
* [Grafald](/projects/grafald/) - GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD GRAFALD
* [Gregory Quest](/projects/gregory-quest/) - This... I don't know how to explain this. Me and a few friends kind of fell backwards into writing a D&D-esque story about a fantasy realm inhabited by pro wrestlers struggling to save their kingdom from the dark lord John Cena, and also there's an ape, and the BBQ Pit Druids, and scrying rituals?

-----

Okay, that was a lot more than I thought it was going to be. Hopefully I haven't scared too many of you off, and you've found something of interest in this post.

LONG LIVE EGGBUG