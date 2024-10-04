---
title: "Advent of Code 2023 - Day 16"
date: 2023-12-18T20:00:00-04:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2023
---

griiiiiiiiiiiiiiiiiiiids

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-16.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

So, grid. 's fulla mirrors and splitters.

```
.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....
```

A laser enters from the top left corner, heading right. If it hits the flat side of a `|` or `-` tile, it splits off into two directions. If it hits a `\` or `/` tile, it gets reflected 90 degrees. Our goal is to find the total number of tiles visited by a laser at any point.

I ended up unintentionally doing a sort of [BFS](https://en.wikipedia.org/wiki/Breadth-first_search) approach, beginning by queuing up the starting tile and continuing until the queue is emptied.

```python
def advance_lasers(self):
    laser_pos, direction = self.new_lasers[0]
    self.new_lasers = self.new_lasers[1:]

    if self.can_advance_laser(laser_pos, direction):
        next_tile = self.grid[laser_pos + direction]

        if next_tile == '\\':
            self.add_laser(laser_pos + direction, Point(0, 0))

            self.add_laser(laser_pos + direction, self.reflect_laser(direction, '\\'))
        elif next_tile == '/':
            self.add_laser(laser_pos + direction, Point(0, 0))

            self.add_laser(laser_pos + direction, self.reflect_laser(direction, '/'))
        elif next_tile == '|' and direction.x != 0:
            self.add_laser(laser_pos + direction, Point(0, 0))

            self.add_laser(laser_pos + direction, Point(0, -1))
            self.add_laser(laser_pos + direction, Point(0, 1))
        elif next_tile == '-' and direction.y != 0:
            self.add_laser(laser_pos + direction, Point(0, 0))

            self.add_laser(laser_pos + direction, Point(-1, 0))
            self.add_laser(laser_pos + direction, Point(1, 0))
        else:
            self.add_laser(laser_pos + direction, direction)

def run_laser_grid(self, starting_laser: Point, starting_dir: Point):
    self.new_lasers.append((starting_laser, starting_dir))

    while len(self.new_lasers):
        self.advance_lasers()

    return self.laser_total
```

For each item in the queue, first I check if the laser can continue from that tile, and then depending on the next tile ID I queue up new laser tiles.

To detect if a laser can advance, we need to check the next tile.

In order to make logic easier on mirror and split tiles, we'll always return `True`. We also want to check if we've already recorded a laser on that tile in the same direction, and if the tile is actually a part of the grid.

```python
def can_advance_laser(self, laser_pos: Point, direction: Point):
    if direction == (0, 0):
        return False

    new_pos = laser_pos + direction

    if self.grid[new_pos] != '.':
        return True  # we'll allow overlapping on mirror/split tiles

    is_repeat = new_pos in self.filled_dirs and direction in self.filled_dirs[new_pos]

    return not is_repeat and self.grid[laser_pos + direction] is not None
```

Next, to add new lasers to the queue:

```python
def add_laser(self, laser_pos: Point, direction: Point):
    if self.grid[laser_pos] is None:
        return

    if self.dir_grid[laser_pos] and self.dir_grid[laser_pos] in '><^V':
        self.dir_grid[laser_pos] = '2'
    elif self.dir_grid[laser_pos] and self.dir_grid[laser_pos].isnumeric():
        self.dir_grid[laser_pos] = str(int(self.dir_grid[laser_pos]) + 1)
    elif self.dir_grid[laser_pos] and self.dir_grid[laser_pos] not in '<>V^|-\\/':
        self.dir_grid[laser_pos] = self.dir_to_char(direction)

    if self.active_grid[laser_pos] != '#':
        self.active_grid[laser_pos] = '#'
        self.laser_total = self.laser_total + 1

    if laser_pos in self.filled_dirs:
        self.filled_dirs[laser_pos].append(direction)
    else:
        self.filled_dirs[laser_pos] = [direction]

    if direction.x != 0 or direction.y != 0 and (laser_pos, direction) not in self.new_lasers:
        self.new_lasers.append((laser_pos, direction))
```

This function also updates two additional grids to be used for outputting different views of the grid (as well as making it easier to track the number of active tiles).

And lastly, this function rotates an incoming laser as it gets reflected by a mirror:

```python
DIR_ANGLES = [Point(1, 0), Point(0, 1), Point(-1, 0), Point(0, -1)]

def reflect_laser(self, direction: Point, mirror_char: str):
    if direction not in DIR_ANGLES:
        return Point(0, 0)

    reflected_cw = DIR_ANGLES[(DIR_ANGLES.index(direction) + 1) % len(DIR_ANGLES)]
    reflected_ccw = DIR_ANGLES[DIR_ANGLES.index(direction) - 1]

    if mirror_char == '\\':
        return reflected_cw if direction.y == 0 else reflected_ccw
    elif mirror_char == '/':
        return reflected_cw if direction.x == 0 else reflected_ccw

    return Point(0, 0)
```

Here's what the grid looks like after the laser has visited all possible tiles:

```
.|...\....  |  >|<<<\....  |  ######....
|.-.\.....  |  |V-.\^....  |  |#-.\#....
.....|-...  |  .V...|->>>  |  .#...#####
........|.  |  .V...V^.|.  |  .#...##.|.
..........  |  .V...V^...  |  .#...##...
.........\  |  .V...V^..\  |  .#...##..\
..../.\\..  |  .V../2\\..  |  .#..####..
.-.-/..|..  |  <->-/VV|..  |  ########..
.|....-|.\  |  .|<<<2-|.\  |  .#######.\
..//.|....  |  .V//.|.V..  |  .#//.#.#..
```

The leftmost view is the grid as-is, the second shows the path the laser takes (with numbers representing overlapping lasers), and the third represents every tile touched by a laser.

In this example, the laser touches `46` tiles.

## Part 2

Part 2 doesn't add much. The only big change is needing to get the number of tiles activated from each edge tile, and find the max.

```python
candidates = []

for x in range(self.grid.width):
    candidates.append(self.run_laser_grid(Point(x, -1), Point(0, 1)))
    self.reset_grids()

    candidates.append(self.run_laser_grid(Point(x, self.grid.height), Point(0, -1)))
    self.reset_grids()

for y in range(self.grid.height):
    candidates.append(self.run_laser_grid(Point(-1, y), Point(1, 0)))
    self.reset_grids()

    candidates.append(self.run_laser_grid(Point(self.grid.width, y), Point(-1, 0)))
    self.reset_grids()

return max(candidates)
```

Now, the highest value recorded is from (3, 0), moving downwards.

```
.|...\....  |  .|<2<\....  |  .#####....
|.-.\.....  |  |V-V\^....  |  |#-#\#....
.....|-...  |  .V.V.|->>>  |  .#.#.#####
........|.  |  .V.V.V^.|.  |  .#.#.##.|.
..........  |  .V.V.V^...  |  .#.#.##...
.........\  |  .V.V.V^..\  |  .#.#.##..\
..../.\\..  |  .V.V/2\\..  |  .#.#####..
.-.-/..|..  |  <-2-/VV|..  |  ########..
.|....-|.\  |  .|<<<2-|.\  |  .#######.\
..//.|....  |  .V//.|.V..  |  .#//.#.#..
```

**``51``** tiles are activated in this configuration.

## Closing Thoughts

I'm not sure if it's fatigue setting in, but this puzzle took way longer for me to solve than I think it should have. As of this writing I've skipped three days, and I'm not sure when exactly I'll get back to them, but I'd hate to leave another year unfinished.

Just gotta pace myself, I guess.