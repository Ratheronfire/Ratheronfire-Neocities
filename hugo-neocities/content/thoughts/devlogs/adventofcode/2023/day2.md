---
title: "Advent of Code 2023 - Day 2"
date: 2023-12-02T01:00:00-04:00
draft: false
categories:
- blog
tags:
- advent-of-code
- devlog
- aoc2023
---

Not as bad as I was expecting today. I think the main complication was figuring out how best to structure the input data, but even that was pretty straightforward today.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-2.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

So, the setup for this one is a bit out there (as AoC problems tend to be). We're given a list of the outputs of several games, where a bag is filled with an unknown quantity of cubes of several colors, and a handful of cubes are revealed. Each game consists of about 3 or 4 sets of reveals, namely the colors of the cubes and the quantities of each color.

```
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
```

The game was played 5 times, with the results seen above. I chose to structure my representation of each game as a list of dictionaries, where each dictionary represents one set of reveals (separated by ``;``). It looked something like this:

```
[
    {'blue': 3, 'red': 4},
    {'red': 1, 'green': 2, 'blue': 6},
    {'green': 2}
]
```

Next, we're asked to determine which of these games would be possible if the bag had a total of 12 red, 13 green, and 14 blue. In other words, any game where no set of reveals exceeds the max capacity for any color.

```python
def is_game_possible(self, game: Game, max_set: Cubes):
    for cube_set in game:
        for color in cube_set.keys():
            if cube_set[color] > max_set[color]:
                return False

    return True
```

Fairly simple stuff, just iterate through each set of cubes, see if the numbers line up, and count up the games that are possible.

## Part 2

Surprisingly, even part 2 was pretty straightforward, maybe even moreso. Now, the goal is to calculate the "power" of each game, by finding the least number of cubes of each color that any one game can be played with (which is just max number of cubes revealed for each color). Then, we just multiply them all together and sum up that value for each game.

```python
def get_power(self, game: Game):
    max_set: Cubes = {}

    for cube_set in game:
        for color in cube_set.keys():
            if color not in max_set or cube_set[color] > max_set[color]:
                max_set[color] = cube_set[color]

    return reduce(lambda a, b: a * b, max_set.values())
```

Again, mostly self-explanatory here. Starting with dictionaries I think helped a bit by making the steps I needed to take pretty easy to deduce.

## Closing Thoughts

Today's problem seems like one of the ones geared towards fast completion, where the goal is to figure out how to solve part 1 in a way that makes part 2 require the least work possible. The best case scenario would be if I solved part 1 by calculating the minimun number of cubes needed for each game, since that was essentially all part 2 required. Pretty trivial either way, but naturally competition for the global leaderboards is naturally that much more intense on easier days like this.