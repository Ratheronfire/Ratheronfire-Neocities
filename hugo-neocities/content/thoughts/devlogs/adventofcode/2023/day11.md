---
title: "Advent of Code 2023 - Day 11"
date: 2023-12-11T01:00:00-04:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2023
---

Clearly today's puzzle was meant to trick people like me who default to using grids to solve puzzles when grids are put in front of us.

Luckily I have a few tricks up my sleeve...

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-11.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

To start with, we're given a grid with a handful of asterisks strewn about, representing galaxies.

```
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
```

There are also a handful of empty columns and rows, which we're instructed to expand outwards to simulate the galaxies drifting apart, like so:

```
....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......
```

Then we need to get the minimum difference between each pair of galaxies, and return their sum.

To expand the grid, I used the following code:

```python
def expand(self):
    empty_xs = [x for x in range(self.grid.width) if
                '#' not in str(self.grid[(x, 0):(x, self.grid.height):(1, 1)])]
    empty_ys = [y for y in range(self.grid.height) if
                '#' not in str(self.grid[(0, y):(self.grid.width, y):(1, 1)])]

    expanded_grid = Grid.create_empty(self.grid.width + len(empty_xs), self.grid.height + len(empty_ys), '.')

    ex, ey = 0, 0

    for x in range(self.grid.extents[0][1] + 1 + len(empty_xs)):
        if x in empty_xs:
            ex += 1

        for y in range(self.grid.extents[1][1] + 1 + len(empty_ys)):
            if y in empty_ys:
                ey += 1
            expanded_grid[(ex, ey)] = self.grid[(x, y)]

            if self.grid[(x, y)] == '#':
                self.galaxies.append(Point(ex, ey))
                expanded_grid[(ex, ey)] = str(len(self.galaxies))

            ey += 1

        ex += 1
        ey = 0
```

I created a separate grid with appropriately increased size, grabbed a list of all the x and y values to expand, and then copied the galaxies over, making sure to offset my new coordinates when needed.

Then, getting the distances was just a matter of summing up the x/y distances between each pair.

```python
def get_distances(self):
    total = 0

    for i in range(len(self.galaxies)):
        for j in range(i+1, len(self.galaxies)):
            start = self.galaxies[i]
            end = self.galaxies[j]

            total += abs(start.x - end.x) + abs(start.y - end.y)

    return total
```

Adding up all the distances gives us a grand total of `374`.

## Part 2

Uh oh, now we need to make the gaps bigger. And by bigger, I mean `1000000`.

Surely there's no possible way to represent this using a grid...

Unless you happened to be using a grid helper class where the grid was represented internally using a dictionary!

Because my grid allows adding arbitrarily large coordinates without allocating memory for all the points between 0 and the given coordinate, doing part 2 with my code was painless.

I just adjusted my code to make the expansion amounts variable, and plugged a different number in.

```python
def expand(self, expansion_amount: int):
    empty_xs = [x for x in range(self.grid.width) if
                '#' not in str(self.grid[(x, 0):(x, self.grid.height):(1, 1)])]
    empty_ys = [y for y in range(self.grid.height) if
                '#' not in str(self.grid[(0, y):(self.grid.width, y):(1, 1)])]

    expanded_grid = Grid.create_empty(self.grid.width + len(empty_xs), self.grid.height + len(empty_ys), '.')

    ex, ey = 0, 0

    for x in range(self.grid.extents[0][1] + 1 + len(empty_xs)):
        if x in empty_xs:
            ex += expansion_amount

        for y in range(self.grid.extents[1][1] + 1 + len(empty_ys)):
            if y in empty_ys:
                ey += expansion_amount
            expanded_grid[(ex, ey)] = self.grid[(x, y)]

            if self.grid[(x, y)] == '#':
                self.galaxies.append(Point(ex, ey))
                expanded_grid[(ex, ey)] = str(len(self.galaxies))

            ey += 1

        ex += 1
        ey = 0

    self.grid = expanded_grid
```

For the sample inputs, that gives us `82000210`.

## Closing Thoughts

This is the kind of problem that requires you to either think through your implementation before starting, or plan ahead so you don't need to. I'm terrible at both, but luckily my planning ahead worked in my favor this time.