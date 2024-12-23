---
title: "Advent of Code 2024 - Day 6"
date: 2024-12-23T04:00:43-05:00
draft: true
tags:
- advent-of-code
- devlog
- aoc2024
---

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-6.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

Boy, this one was rough.

## Part 1

On paper, this doesn't seem too bad. We're given a grid (as is tradition) containing two different things: a guard represented by directional arrows (``<>^v``), and obstacles (``#``). The guard moves forward until hitting an obstacle, then turns clockwise right and continues, until eventually exiting the grid.

The sample grid looks like this:

```
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
```

After the guard finishes moving, their trail looks like this:

```
....#.....
....>>>>>#
....^...v.
..#.^...v.
..^>>>>#v.
..^.^.v.v.
.#<<<<v<v.
.^>>>>>>#.
#<<<<<vv..
......#v..
```

This might be a bit hard to follow, but the guard ends up making a few loops before exiting the grid on the south side. The goal for part 1 is to find the total number of tiles the guard visits, which for the sample puzzle is ``41``.

My solution went though quite a few iterations, and by the end became pretty unwieldy. I'll try to explain it as clearly as possible but it's rough.

First, I loop through and find the guard's starting position, using my tried and true ``Grid`` helper code.

```python
def find_guard(self) -> Point:
    guard_pos = Point(-1, -1)

    for y in range(self.grid.height):
        for x in range(self.grid.width):
            if self.grid[(x, y)] in 'v^<>':
                guard_pos = Point(x, y)

                break

    return guard_pos
```

I also introduced a couple types and constants for easy reference.

```python
PathStep = tuple[str, Point]


ROTATIONS = {
    '^': '>',
    'v': '<',
    '<': '^',
    '>': 'v'
}


OFFSETS = {
    '^': Point(0, -1),
    'v': Point(0, 1),
    '<': Point(-1, 0),
    '>': Point(1, 0)
}
```

```python
def step_grid(self, guard_pos: Point, direction: str):
    next_pos = guard_pos + OFFSETS[direction]

    if (self.grid[next_pos] is None or self.grid[next_pos] in '.X<>^v'):
        return next_pos
    else:
        return guard_pos

def simulate_guard_path(self, guard_pos: Point, guard_dir: str) -> tuple[list[PathStep], bool]:
    visited_tiles: list[PathStep] = [(guard_dir, guard_pos)]
    looped = False

    while True:
        guard_pos = self.step_grid(guard_pos, guard_dir, obstacle_pos)

        if self.grid[guard_pos + OFFSETS[guard_dir]] and self.grid[guard_pos + OFFSETS[guard_dir]] in '#O':
            guard_dir = ROTATIONS[guard_dir]

        if self.grid[guard_pos + OFFSETS[guard_dir]] is None:
            # At the edge of the grid, unable to continue (i.e. exited the grid)
            visited_tiles.append((guard_dir, guard_pos))
            break

        if (guard_dir, guard_pos) in visited_tiles:
            # Loop detected.
            looped = True
            visited_tiles.append((guard_dir, guard_pos))
            break

        visited_tiles.append((guard_dir, guard_pos))

    return visited_tiles, looped
```

This code advances the guard step by step until they exit the map or encounter a loop (more on that later). ``step_grid()`` calculates the next point in the guard's current direction, taking into account if the space in front is free.

Then in ``simulate_guard_path()`` we process the guard's path step by step, rotating them when an obstacle is reached, keeping a record of visited tiles, and detecting when the guard simulation is done.

Then, to get the number of visited tiles along that path:

```python
def get_part_1_answer(self, use_sample=False):
    guard_pos = self.find_guard()

    visited_tiles = self.simulate_guard_path(guard_pos, self.grid[guard_pos])[0]
    unique_tiles = set([tile[1] for tile in visited_tiles])

    return len(unique_tiles)
```

Since the path will often visit tiles multiple times, we just need to eliminate duplicates first by converting the list to a set. My code for part 1 takes ~3 seconds to run, not a good omen for things to come.

## Part 2

Now, the goal is to find all the points on the grid where, if a new obstacle were placed at the beginning of the guard's cycle, it would introduce an infinite loop.

Like so (the new obstacle is represented by ``O``):

```
....#.....
....+---+#
....|...|.
..#.|...|.
....|..#|.
....|...|.
.#.O^---+.
........#.
#.........
......#...
```

In total, there are ``6`` places where loops can be created along the guard's path.

This required a *ton* of rewrites to my code, including a few attempts to optimize it which now allow the code to run in a nice, breezy 10-ish minutes. Very efficient, of course.

The first optimization, based on discussions on the subreddit, was to add a dictionary encoding the furthest points reachable from each point, in each direction. I decided to hard-code that table once at the beginning:

```python
def init_jumps(self):
    self.jumps = {}

    for y in range(self.grid.height):
        for x in range(self.grid.width):
            self.calculate_jumps(x, y)

def calculate_jumps(self, x: int, y: int):
    pos = Point(x, y)
    neighbors = self.grid.neighbors(Point(x, y), True)

    if x == 0 or x == self.grid.width - 1 \
            or y == 0 or y == self.grid.height - 1 \
            or self.grid[pos] in '<>^v' \
            or any([n[1] in '#O' for n in neighbors]):
        for direction in OFFSETS.keys():
            offset_pos = Point(x, y)

            while self.grid[offset_pos + OFFSETS[direction]] and self.grid[offset_pos + OFFSETS[direction]] in '.><^v':
                offset_pos += OFFSETS[direction]

            self.jumps[(direction, pos)] = offset_pos
```

Then at the beginning of ``step_grid()``, I implemented a check to see if the jump dictionary can be used.

```python
def step_grid(self, guard_pos: Point, direction: str, obstacle_pos: Point | None = None):
    if (direction, guard_pos) in self.jumps:
        may_hit_obstacle = False

        if obstacle_pos:
            offset = OFFSETS[direction]
            if (offset.x != 0 and guard_pos.y == obstacle_pos.y) or \
                    (offset.y != 0 and guard_pos.x == obstacle_pos.x):
                may_hit_obstacle = True

        if not may_hit_obstacle:
            return self.jumps[(direction, guard_pos)]
```

At this point I also started passing the position of the new obstacle around. Here, we deliberately ignore the jump dictionary when we're moving in the obstacle's row or column, since that data is now inaccurate. (Likewise, I had to update ``simulate_guard_path()`` to rotate the guard when encountering this new obstacle).

Lastly, to try and speed things along, I introduced parallel processing using ``multiprocessing.Pool``, which required some minor rewrites to ensure that data wasn't getting mishandled between concurrent subprocesses.

And here's the code that determines the number of possible loop points:

```python
def test_for_loop(self, step: PathStep) -> tuple[bool, Point]:
    start_pos = self.find_guard()
    start_dir = self.grid[start_pos]

    direction, position = step
    obstacle_pos = position + OFFSETS[direction]

    if obstacle_pos == start_pos or self.grid[obstacle_pos] != '.':
        return False, Point(-1, -1)

    alternate_path, looped = self.simulate_guard_path(start_pos, start_dir, obstacle_pos)

    return looped, obstacle_pos

def get_loop_count(self) -> int:
    start_pos = self.find_guard()
    start_dir = self.grid[start_pos]
    canonical_path = self.simulate_guard_path(start_pos, start_dir)[0]

    with Pool(5) as pool:
        loop_results = pool.map(self.test_for_loop, canonical_path)

    return len(set([l[1] for l in loop_results if l[0]]))
```

I begin by calculating the full path as normal. Then, for each point on that path, I kick of a subprocess which tests to see if a loop is now present.

I ran with 5 subprocess threads as a reasonable minimum, because anything more than that just took way too much memory, for seemingly little improvement. That being said, even with 5 it's still horribly inefficient, so there's probably quite a bit of fundamental work my algorithm needs to run efficiently.

## Closing Thoughts

This one took me a while! Since this is the 10-year anniversary of Advent of Code, I think a lot of these puzzles were designed with the viewpoint of being a celebration of all the different types of puzzles and skillsets introduced over the years. And because of that, I think it's safe to say this is nothing compared to what's to come.

It's going to be an absolute nightmare year, I can't wait.