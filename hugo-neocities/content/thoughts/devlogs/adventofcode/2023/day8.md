---
title: "Advent of Code 2023 - Day 8"
date: 2023-12-08T14:00:00-04:00
draft: false
categories:
- blog
tags:
- advent-of-code
- devlog
- aoc2023
---

Interesting one today. The kind of problem where your options are either spending an unimaginable amount of time brute-forcing a bunch of calculation, or dig deep enough to figure out what's actually going on.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-8.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

Today we're given one of the old AoC mainstays, a massive interconnected graph. Starting from room `AAA`, we need to find out how many steps it takes to reach room `ZZZ`. Each room has two neighbors, and we navigate them following a static pattern that repeats infinitely.

For example:

```
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
```

In this sample, we have three rooms, and our path is left twice, then right once, then left twice and right once again, and so on.

Fairly simple implementation for this one. I stored the path as a string, and the room graph as a dictionary of `room_ID -> room_destinations`.

```python
path: str
rooms: dict[str, tuple[str, str]]
```

Then, to get our answer:

```python
def follow_path(self, starting_room):
    navigations = 0
    current_room = starting_room

    while current_room[-1] != 'Z':
        next_dir = self.path[navigations % len(self.path)]
        current_room = self.rooms[current_room][0 if next_dir == 'L' else 1]
        navigations += 1

    return navigations
```

Starting from `AAA`, this would have us go `AAA -> BBB -> AAA -> BBB -> AAA -> BBB -> ZZZ`, for a total of **`6`** steps.

## Part 2

As usual, things are never that simple. Now we need to look at all rooms ending with `A`, and determine how many steps until each of them reaches a room ending with `Z` simultaneously.

We're given new sample data for part 2, which looks like this:

```
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
```

Here, our two starting rooms are `11A` and `22A`, and our goals are `11Z` and `22Z`.

Tracking the input manually is fairly trivial:

```
11A -> 11B -> 11Z -> 11B -> 11Z -> 11B -> 11Z
22A -> 22B -> 22C -> 22Z -> 22B -> 22C -> 22Z
```

Both paths reach Z rooms on step **`6`**, though they both pass their respective Z rooms at least once before arriving there simultaneously.

Unfortunately, because our real input is much, much bigger, calculating this value using the same method would take an inordinate amount of time, especially without any optimizations.

Knowing how these puzzles are structured, I assumed there was a simpler answer but I had some trouble figuring out what that might be. After spending some studying the makeup of the input, though, I made some observations:

* Each `A` room has access to only a small subset of the full graph, and only one `Z` room.
* There are very few rooms with more than two paths to them, and the duplicates tend to only be in the form of `AAA = (111, 112)` and `AAB = (112, 111)`.
* Each `A` path reaches its respective `Z` on a consistent pattern.

All of this led me to believe that there was a much simpler pattern that I needed to target to solve this: If each loop reaches its goal after a repeating interval, then to find the point at which they all sync up, all I need to do is find the least common multiple of each loop.

And here's how I did that:

```python
def find_sync_period(self):
    visit_times = [self.follow_path(r) for r in self.rooms if r[-1] == 'A']

    return math.lcm(*visit_times)
```

You may have noticed in part 1 that I checked for goal rooms by just checking the last character of the room ID. That means I can just use the same function here to determine the loop point for each starting room. Then, I just take those values and throw them into `math.lcm` to get my answer.

For the sample data, `11A` reaches `11Z` in 2 steps and `22A` reaches `22Z` in 3. The LCM of 2 and 3 is **6**, so that's our answer.

## Closing Thoughts

This is maybe the first 2023 puzzle that expects you to derive the actual puzzle by analyzing the makeup of the input rather than just reading the prompt, which is a style of AoC puzzle that always trips me up. I had suspected the answer would be something along these lines, but it's not immediately obvious from simply looking at what we're given.