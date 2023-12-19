---
title: "Advent of Code 2023 - Day 14"
date: 2023-12-18T14:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

Another day, another grid puzzle.

Here's some suggested music to accompany this writeup:

{{< youtube ZeAsP7JdHqU >}}

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/2023/day-14.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

This one seems to be based on the obligatory 2D RPG rock sliding puzzle, with the twist being that we need to slide an entire grid's worth of boulders in a single direction, specifically to the north.

So, this:

```
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
```

Becomes this:

```
OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....
```

Then, we need to determine the cumulative load of each boulder. Boulders in the bottom-most row are worth `1`, boulders in the row above are worth `2`, and so on.

My code for this part is fairly simple, though admittedly it could be a lot more efficient.

```python
def get_round_rocks(self) -> list[Point]:
    rock_positions = []

    for y in range(0, self.grid.height):
        for x in range(0, self.grid.width):
            if self.grid[(x, y)] == 'O':
                rock_positions.append(Point(x, y))

    return rock_positions

def get_next_position(self, rock_pos: Point, tilt_dir: Point):
    while self.grid[rock_pos + tilt_dir] == self.grid.default_value:
        rock_pos = rock_pos + tilt_dir

    return rock_pos

def tilt_grid(self, tilt_dir: Point):
    rocks_before = hash(tuple([(r.x, r.y) for r in self.get_round_rocks()] + [(tilt_dir.x, tilt_dir.y)]))

    if rocks_before in self.rock_cache:
        self.grid.import_values(self.rock_cache[rocks_before])
        return

    rocks = self.get_round_rocks()
    next_rocks = []

    while any([self.grid[r + tilt_dir] == '.' for r in rocks]):
        for rock in rocks:
            new_rock = self.get_next_position(rock, tilt_dir)

            self.grid[rock] = self.grid.default_value
            self.grid[new_rock] = 'O'

            next_rocks.append(new_rock)

        rocks = next_rocks.copy()
        next_rocks.clear()

    self.rock_cache[rocks_before] = self.grid.export_values()
```

To start, I create a hash for the grid's initial state. The idea here was to skip the tilting function if we've seen this orientation before, but in practice it doesn't help much. I think the smarter move would be to cache individual rows/columns, since there's likely to be more repetition there.

Failing the cache check, I first look through to find all of the rock positions. Then, for each rock I step forwards in the grid until I hit either a non-empty tile or the edge of the grid. Then I repeat until no more rocks have room to move.

At the end, our starting grid looks like this:

```
OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....
```

These boulder positions add up to a total load of **`136`**.

## Part 2

And now we get the big trick: Now instead of tilting once, we're tilting north -> west -> south -> east, a grand total of 1,000,000,000 times.

Naturally this would take far too long to brute force without a massive GPU cluster, but luckily there's a trick that we can use to skip to the end.

Like the [Tetris](https://adventofcode.com/2022/day/17) puzzle from last year, eventually this cycle will settle into a repeating pattern. So, once we find the start and end points of that pattern, we can just calculate where that pattern will leave us on the billionth cycle.

Not too much new code for this:

```python
def spin(self, count: int):
    rock_history = []

    i = 0
    while i < count:
        self.tilt_grid(Point(0, -1))
        self.tilt_grid(Point(-1, 0))
        self.tilt_grid(Point(0, 1))
        self.tilt_grid(Point(1, 0))

        rocks = [(r.x, r.y) for r in self.get_round_rocks()]

        for j, rock_set in enumerate(rock_history):
            if rock_set == rocks:
                loop_period = i - j
                loop_offset = (count - j) % -loop_period - 1
                return rock_history[loop_offset]

        rock_history.append(rocks)

        i += 1
```

After each spin cycle, I save a copy of the current rock positions to an array, and check to see if we've found a duplicate.

If we have, then we do some math to determine the start of the first loop (`j`), calculate the loop period using `i`, and then determine where spin # 1,000,000,000 lies within that loop, and that set of points is our final value.

At the end, our input grid looks like this:

```
.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O
```

And our total load is now **`64`**.

## Closing Thoughts

This one took a little while to work out, but after some revisions my final code is pretty minimal.

Could definitely use a lot more optimization, but my code runs in less than a minute which I can live with.