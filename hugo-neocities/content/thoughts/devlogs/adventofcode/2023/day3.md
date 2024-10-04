---
title: "Advent of Code 2023 - Day 3"
date: 2023-12-03T01:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

Well, here we are, the first grid-based puzzle of 2023. Luckily I've been working on a nice set of helper functions for these sorts of puzzles, so that took care of a lot of the work I'd otherwise have to repeat today (although I may have forgotten how it worked a bit and wasted a good 10 or 20 minutes debugging for nothing, oh well).

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-3.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## The Grid Helper Function

Before I get into the puzzle itself, I should probably briefly cover my helper functions for grid puzzles. They're adapted from code posted to the [/r/AdventofCode subreddit by /u/TheRestIsCommentary](https://www.reddit.com/r/adventofcode/comments/zkc974/python_data_structures_for_2d_grids/), with plenty of additions along the way, as well as a variant for 3D grids (we'll be seeing those soon enough, I'm sure...).

The idea behind /u/TheRestIsCommentary's code was to allow arbitrarily large grids without needing to initialize the entire region: You can place a single point at ``(0, 0)`` and another at ``(1000, 1000)``, and since the grid is stored internally as just a dictionary, you can represent this grid with only the relevant points actually existing in memory, the getter function just returning a default value for any point that hasn't been defined. I've also added a variable for the grid's extents which are automatically re-calculated whenever new points are added, to make iterating over the grid easier.

## Creating the Grid

To create the grid, I have a few helper functions that are tailored to the kinds of inputs AoC typically gives players:

```python
@staticmethod
def create_empty(width: int, height: int, default_value='.'):
    grid = Grid({(x, y): default_value for y, line in enumerate(range(height))
                    for x, _ in enumerate(range(width))}, default_value)

    return grid

@staticmethod
def from_strings(strings: List[str], default_value='.'):
    grid = Grid({(x, y): val for y, line in enumerate(strings)
                    for x, val in enumerate(line)}, default_value)

    return grid

@staticmethod
def from_number_strings(strings: List[str], default_value='.'):
    grid = Grid({(x, y): int(val) for y, line in enumerate(strings)
                    for x, val in enumerate(line)}, default_value)

    return grid

@staticmethod
def from_array(rows: List[List[Union[any]]], default_value='.'):
    grid = Grid({(x, y): val for y, line in enumerate(rows)
                    for x, val in enumerate(line)}, default_value)

    return grid

@staticmethod
def from_dict(grid_dict):
    grid = Grid(grid_dict)

    grid._calculate_extents()

    return grid
```

For today's puzzle, it was just a simple matter of throwing the entire input string into `from_strings()` and storing the resulting grid.

### Neighbors


```python
def neighbors(self, pos: Point, include_diagonals=False):
    x0, y0 = pos

    candidates = [(x0 - 1, y0), (x0 + 1, y0), (x0, y0 - 1), (x0, y0 + 1)]
    if include_diagonals:
        candidates += [(x0 - 1, y0 - 1), (x0 - 1, y0 + 1), (x0 + 1, y0 - 1), (x0 + 1, y0 + 1)]
    return [(p, self[p]) for p in candidates if self[p] is not None]
```

Getting the neighbors of a grid tile is one of the most common tasks required for grid puzzles, so naturally I have a helper function for it, with the option of including or excluding diagonal neighbors. This function looks at all possible neighbors, excluding any that do not exist or would exceed the bounds of the grid (i.e. if the value at `(x, y)` is `None`), and then returns a list of neighbor points and their values as tuples.

### Other Classes

I also have a handful of other classes defined which come up from time to time:

```python
class Point:
    x: Union[int, float]
    y: Union[int, float]

    _base_type = Union[int, float]

    def scale(self, scalar: Union[int, float]):
        return Point(self.x * scalar, self.y * scalar)

    def __init__(self, x: _base_type, y: _base_type):
        self.x = x
        self.y = y
    ...
class Point3D(Point):
    z: Union[int, float]

    _base_type = Union[int, float]

    def scale(self, scalar: Union[int, float]):
        return Point3D(self.x * scalar, self.y * scalar, self.z * scalar)

    def __init__(self, x: _base_type, y: _base_type, z: _base_type):
        super().__init__(x, y)
        self.z = z
    ...
Line = Tuple[Point, Point]
```

The `Point` class can be used interchangably with `(x, y)` tuples to index grids, depending on your preference.

There's a lot more I haven't touched on with these classes, but most of that is just overriding methods and operators so if you're interested you can see the full code for my grid helpers [here](https://github.com/Ratheronfire/advent-of-code/blob/master/helpers/grid.py).

## Part 1

So, we're given a grid full of numbers, as well as a bunch of symbols strewn about.

```
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
```

We're told we need to find all the numbers which are adjacent to any symbol in any direction, and add them all up. For my first pass at this problem, I wrote a function which takes the start of a number somewhere on the grid, steps to the right until we hit the end, accumulates the neighbors along the way, and then returns `True` if any neighbors were symbols, as well as the number itself.

```python
def is_part_number(self, number_pos: Point):
    neighbors = []
    num_str = ''

    x, y = number_pos

    while x < self.schematic.extents[0][1] + 1:
        if not self.schematic[(x, y)].isnumeric():
            break

        neighbors += self.schematic.neighbors(Point(x, y), include_diagonals=True)
        num_str += self.schematic[(x, y)]
        x += 1

    return (int(num_str) if num_str.isnumeric() else -1), \
        any([n for n in neighbors if not n[1].isnumeric() and n != '.'])
```

And here's the code that ran ran through the grid from `(0, 0)` to the bottom-right corner. Note that I had to exclude any numbers I found if the position to its left was also a number (because this was a number we'd already processed).

```python
total = 0

for y in range(self.schematic.extents[1][1] + 1):
    for x in range(self.schematic.extents[0][1] + 1):
        if self.schematic[(x, y)] == '.':
            continue

        if x > 0 and self.schematic[(x - 1, y)].isnumeric():
            continue  # this is part of a number we already saw

        num, is_part_number = self.is_part_number(Point(x, y))

        if is_part_number:
            total += num
```

This worked fine for part 1, but the second part forced me to rethink things slightly.

## Part 2

Now for the twist, we're told to only focus on `*` symbols, and specifically those neighboring exactly two numbers. Because we were now forced to consider multiple numbers attached to the same symbol, I rewrote my test function to instead return the list of all adjacent symbols to the given number, rather than a `True`/`False` value.

```python
def get_number_and_parts(self, number_pos: Point):
    neighbors = []
    num_str = ''

    x, y = number_pos

    while x < self.schematic.extents[0][1] + 1:
        if not self.schematic[(x, y)].isnumeric():
            break

        for neighbor in self.schematic.neighbors(Point(x, y), include_diagonals=True):
            if not neighbor[0] in [n[0] for n in neighbors]:
                neighbors.append(neighbor)
        num_str += self.schematic[(x, y)]
        x += 1

    return (int(num_str) if num_str.isnumeric() else -1), \
        [n for n in neighbors if not n[1].isnumeric() and n[1] != '.']
```

Then, like in part 1, I iterated across the grid and tested each number, but now I stored the results into a dictionary where the key was the coordinate of the adjacent symbol, and the value was a list of all numbers adjacent to that point.


```python
part_adjacencies = {}

for y in range(self.schematic.extents[1][1] + 1):
    for x in range(self.schematic.extents[0][1] + 1):
        if self.schematic[(x, y)] == '.':
            continue

        if x > 0 and self.schematic[(x - 1, y)].isnumeric():
            continue  # this is part of a number we already saw

        num, adjacent_parts = self.get_number_and_parts(Point(x, y))

        for part in adjacent_parts:
            if part[1] == '*':
                if part[0] in part_adjacencies:
                    part_adjacencies[part[0]].append(num)
                else:
                    part_adjacencies[part[0]] = [num]
```

Now, ``part_adjacencies`` contains all of the `*` symbols with adjacent numbers, so we just have to find all the symbols with exactly two neighbors, multiply the two together, and sum up the lot of them.

```python
total = 0

for adjacency in part_adjacencies.values():
    if len(adjacency) == 2:
        total += adjacency[0] * adjacency[1]
```

For the sample, that gives us `467 * 35` and `755 * 598`, or `16345 + 451490`, for a final total of `467835`.

## Closing Thoughts

This was the first puzzle of 2023 that took me over an hour to finish. I knew I'd reach this point eventually, but it's a bit of a shame I got here so quickly. Overall this one wasn't too complicated, but any time I start working with grid-based stuff for the first time in a little bit, I tend to forget all the troublesome off-by-one errors I can run into. At least it wasn't so bad as the one from last year with the 3D cube represented in 2D space, though...

I still have nighmares about [2022 day 22](https://adventofcode.com/2022/day/22).