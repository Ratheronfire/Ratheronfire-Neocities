---
title: "Advent of Code 2023 - Day 5"
date: 2023-12-05T21:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

Yeah, this is about what I expected from Advent of Code.

Last year it took until about day 12 before I found myself having to put off the second part until the day after, but this year it happened on day 5. 2023's challenges are a whole different beast.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/2023/day-5.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

I can feel myself taking bigger and bigger breaths before summing up each day's main premise. So...

We're given a list of seeds, which are represented as integers. Next, we're given a series of number triplets, which represent maps between one category and the next.


```
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
```

Each of these categories can be assigned any number from 0 to an arbitrary maximum value, and they correspond to their neighboring categories based on the numbers given. The first represents the first number or the right-hand category's set of values, the second represents the left-hand category's first number, and the third represents how many numbers are mapped.

In the case of the first `seed-to-soil` set, `50 98 2`, this means that two seed numbers, 98 and 99, are mapped to soil numbers 50 and 51. If no mapping is specified, then numbers are simply directly mapped without changes.

As demonstrated on the puzzle page, this means the mapping from seed to soil values looks roughly like this:

```
seed  soil
0     0
1     1
...   ...
48    48
49    49
50    52
51    53
...   ...
96    98
97    99
98    50
99    51
```

*(For the sake of simplicity, I'm going to start referring to category numbers with subscripts, like so: 98{{< sub >}}seed{{</ sub >}} -> 50{{< sub >}}soil{{</ sub >}})*

For part 1 our goal is surprisingly simple: For our given set of seeds, determine the lowest achievable location value.

To start, I made some simple classes and consts to help describe the problem:

```python
CATEGORIES = [
    'seed',
    'soil',
    'fertilizer',
    'water',
    'light',
    'temperature',
    'humidity',
    'location'
]


class NumberMap:
    def __init__(self, source_start: int, dest_start: int, length: int):
        self.source_start = source_start
        self.dest_start = dest_start
        self.length = length


class CategoryMap:
    def __init__(self, from_category: str, to_category: str, number_maps: list[NumberMap]):
        self.from_category = from_category
        self.to_category = to_category
        self.number_maps = number_maps
```

Then I wrote a class that converts a number from one category to the next:

```python
def convert_to_category(self, from_category: str, to_category: str, num: int) -> int:
    category_map = [map for map in self.category_maps if map.to_category == to_category and map.from_category == from_category][0]

    for number_map in category_map.number_maps:
        if number_map.source_start <= num <= number_map.source_start + number_map.length:
            offset = num - number_map.source_start
            return number_map.dest_start + offset

    return num
```

First I check to see if the number is inside the bounds of any mapped portion of numbers between these two categories, and if so calculate the relative offset within the mapped portion, and shift the number into the output portion. If it's not in any region, no change is made.

I also wrote a helper function which simply brings a number through each step in turn:

```python
def convert_to_location(self, num: int) -> int:
    for i in range(len(CATEGORIES) - 1):
        num = self.convert_to_category(CATEGORIES[i], CATEGORIES[i + 1], num)

    return num
```

Running this for each of our starting seed and selecting the lowest result gives us:

13{{< sub >}}seed{{</ sub >}} -> 13{{< sub >}}soil{{</ sub >}} -> 52{{< sub >}}fertilizer{{</ sub >}} -> 41{{< sub >}}water{{</ sub >}} -> 34{{< sub >}}light{{</ sub >}} -> 34{{< sub >}}temperature{{</ sub >}} -> 35{{< sub >}}humidity{{</ sub >}} -> **35{{< sub >}}location{{</ sub >}}**

## Part 2

Well, it turns out we've been had. Our seed numbers aren't numbers, but instead they're meant to represent pairs of ranges. `79 14 55 13` doesn't mean the numbers 79, 14, 55, and 13: it means 14 numbers starting from 79, and the 13 numbers starting from 55.

Crap.

For the input, that means we're now considering 27 numbers instead of 4. For the real data...

It's a lot more. *A lot*.

So, we're gonna have to try something else. I spent a good while puzzling over this one, but the thing that I kept coming back to is the fact that most of the numbers we're dealing with aren't really relevant. The only numbers we actually need to consider are any ones which signify the beginning of a new mapping pattern.

The logic behind the solution I ended up with reminded me of how game engines like Doom optimize ray casting for displaying images: rather than considering each possible angle of the player's FOV, they save time by focusing on the specific angles between the camera and the vertices and edges of the walls and objects in front of the player.

Think of it this way: If the numbers, say, 54{{< sub >}}location{{</ sub >}} and 55{{< sub >}}location{{</ sub >}} both were mapped to the soil through the exact same maze of number maps, naturally 54{{< sub >}}location{{</ sub >}} would by definition have to be smaller, because ultimately the numbers which start mapping areas will always map to the lowest possible number of the next category (at least in terms of what that specific mapping section is able to reach).

So, we can save quite a bit of processing time by simply skipping ahead to the next "vertex" of the current category until we find the optimal path.

To start, I converted the seed numbers into pairs:

```python
seed_pairs = [(self.base_seeds[i], self.base_seeds[i+1]) for i in range(0, len(self.base_seeds), 2)]
seed_pairs = sorted(seed_pairs, key=lambda seed: seed[0])
```

Next, I wrote a recursive function to find the lowest location value:

```python
def test_vertices(self, category: str, vertex_min: int, vertex_max: int):
    if category == CATEGORIES[-1]:
        return vertex_min

    category_index = CATEGORIES.index(category)
    next_category = CATEGORIES[category_index + 1]
    category_map = self.category_maps[category_index]

    destinations = []

    if vertex_min == vertex_max:
        while next_category != CATEGORIES[-1]:
            vertex_min = self.convert_to_category(category, next_category, vertex_min)

            category_index += 1
            category = next_category
            next_category = CATEGORIES[category_index + 1]

            return vertex_min
    else:
        next_vertices = set()
        next_vertices.add(vertex_min)
        next_vertices.add(vertex_max)

        for number_map in category_map.number_maps:
            if vertex_min <= number_map.source_start <= vertex_max:
                next_vertices.add(number_map.source_start)
            if vertex_min <= number_map.source_start + number_map.length <= vertex_max:
                next_vertices.add(number_map.source_start + number_map.length)

        next_vertices = sorted(next_vertices)

        for i in range(len(next_vertices) - 1):
            destinations.append(self.test_vertices(next_category,
                                                    self.convert_to_category(category, next_category, next_vertices[i]),
                                                    self.convert_to_category(category, next_category, next_vertices[i+1])))

    return min(destinations)

return min([self.test_vertices(CATEGORIES[0], pair[0], pair[0] + pair[1]) for pair in seed_pairs])
```

Let's break this down a bit:

```python
def test_vertices(self, category: str, vertex_min: int, vertex_max: int):
```

For the arguments, I pass the current category, followed by two vertex variables, which is just the term I started using for the lowest and highest numbers of the current range we're looking at.

We start with the seed numbers given to us in the input, which translate to 79{{< sub >}}seed{{</ sub >}} and 92{{< sub >}}seed{{</ sub >}}, as well as 55{{< sub >}}seed{{</ sub >}} and 67{{< sub >}}seed{{</ sub >}}.

```python
if category == CATEGORIES[-1]:
    return vertex_min
```

Our base case, when we reach the location category. There's no more number transforming to do here, so we just return the number we've reached.

```python
category_index = CATEGORIES.index(category)
next_category = CATEGORIES[category_index + 1]
category_map = self.category_maps[category_index]

destinations = []
```

Now we need to get some basic information on where we are in the category sequence, and which category is next.

```python
if vertex_min == vertex_max:
    while next_category != CATEGORIES[-1]:
        vertex_min = self.convert_to_category(category, next_category, vertex_min)

        category_index += 1
        category = next_category
        next_category = CATEGORIES[category_index + 1]

        return vertex_min
```

Occasionally we'll end up examining a slice that happens to be a single number, so that's the only number we can test. Simple enough.

```python
next_vertices = set()
next_vertices.add(vertex_min)
next_vertices.add(vertex_max)

for number_map in category_map.number_maps:
    if vertex_min <= number_map.source_start <= vertex_max:
        next_vertices.add(number_map.source_start)
    if vertex_min <= number_map.source_start + number_map.length <= vertex_max:
        next_vertices.add(number_map.source_start + number_map.length)

next_vertices = sorted(next_vertices)
```

Otherwise, we'll need to figure out how many sub-vertices we have to deal with.

Here, we make a set (meaning, repeat values will be ignored), and for each number mapping we add the start and end points, if either is between our two vertices.

And lastly, just as a sanity check we'll also sort the list of vertices after we're done adding.

```python
for i in range(len(next_vertices) - 1):
    destinations.append(self.test_vertices(next_category,
                                            self.convert_to_category(category, next_category, next_vertices[i]),
                                            self.convert_to_category(category, next_category, next_vertices[i+1])))
```

And finally we come to the recursion. Treating the list of vertices we've gathered a pairs, we step through and test each set of numbers.

```python
return min(destinations)
```

Then each recursion ends by simply returining the lowest value encountered.

Running this function on the sample input now gives us:

82{{< sub >}}seed{{</ sub >}} -> 84{{< sub >}}soil{{</ sub >}} -> 84{{< sub >}}fertilizer{{</ sub >}} -> 84{{< sub >}}water{{</ sub >}} -> 77{{< sub >}}light{{</ sub >}} -> 45{{< sub >}}temperature{{</ sub >}} -> 46{{< sub >}}humidity{{</ sub >}} -> **46{{< sub >}}location{{</ sub >}}**

## Closing Thoughts

This one was way harder than I was prepared for this early in the month. Recursion and large numbers typically don't show up this early or at this intensity, which really has me both excited and worried about what's to come later on. I'm hoping day 6 is a bit lighter, because I could really use a less intensive problem after today.