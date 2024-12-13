---
title: "Advent of Code 2023 - Day 10"
date: 2023-12-10T01:00:00-04:00
draft: false
categories:
- blog
tags:
- advent-of-code
- devlog
- aoc2023
---

I did evil things today. Evil, unspeakable things. My solution for part 2 today is insane, entirely not the intended solution, and takes over a minute to run.

***But it works.***

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-10.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

Another grid problem! Once again it's time for my helper function to step into action.

So, we're given a pipe maze:

```
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
```

A bit hard to parse, but we'll deal with that later on. So, for the different parts we're given, they connect in the following ways:

* `|` connects up and down.
* `-` connects left and right.
* `L` connects up and right.
* `J` connects up and left.
* `7` Connects down and left.
* `F` connects down and right.
* `.` is an empty tile.
* `S` is the starting position, which can take the form of any pipe tile above (aside from `.`).

Somewhere in the tile maze, there's a single fully connected loop. The other tiles can be safely ignored.

Here's the same graph with those tiles treated as empty:

```
.....
.S-7.
.|.|.
.L-J.
.....
```

And to make this even easier on the eyes, I've also written a function that makes the output nicer using some different characters:

```
.....
.S═╗.
.║.║.
.╚═╝.
.....
```

The sample input I tested against looked like this:

```
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
```

Or:

```
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
```

Or:

```
..╔╗.
.╔╝║.
S╝.╚╗
║╔══╝
╚╝...
```

To start, I added a dictionary that maps each pipe to the offset positions it connects to.

```python
PIPE_NEIGHBOR_OFFSETS = {
    '|': [Point(0, -1), Point(0,  1)],
    '-': [Point(-1, 0), Point(1,  0)],
    'L': [Point(0, -1), Point(1,  0)],
    'J': [Point(0, -1), Point(-1, 0)],
    '7': [Point(0,  1), Point(-1, 0)],
    'F': [Point(0,  1), Point(1,  0)],
    'S': [Point(0, -1), Point(0,  1), Point(-1, 0), Point(1,  0)],
    '.': []
}
```

Since S can be any of the other pipe tiles, I handle it specially.

To find the loop, I do something like this:

```python
def locate_loop(self):
    x, y = [pos for pos in self.grid.grid if self.grid[pos] == 'S'][0]

    loop_segments = set()
    loop_segments.add(Point(x, y))

    loop_finished = False

    while not loop_finished:
        pipe_neighbors = self.get_pipe_neighbors(Point(x, y))

        new_neighbors = [n for n in pipe_neighbors if n not in loop_segments]
        if len(new_neighbors):
            x, y = new_neighbors[0]
        else:
            loop_finished = True

        for neighbor in pipe_neighbors:
            loop_segments.add(neighbor)

    self.loop = [l for l in loop_segments]
```

First I find the `S` pipe, then I begin looking for the two pipes which connect back to it. (I made an assumption here that `S` wouldn't have any connecting neighbors that were not part of the loop, and fortunately I was correct.)

I use this function to find all the neighbors of a pipe tile which connect back to it:

```python
def get_pipe_neighbors(self, pipe_pos: Point):
    neighbors = []

    for neighbor_offset in PIPE_NEIGHBOR_OFFSETS[self.grid[pipe_pos]]:
        neighbor_value = self.grid[pipe_pos + neighbor_offset]
        if neighbor_value and neighbor_offset * -1 in PIPE_NEIGHBOR_OFFSETS[neighbor_value]:
            neighbors.append(pipe_pos + neighbor_offset)

    return neighbors
```

For each valid offset of the starting pipe, I check to see if a pipe exists on that tile. Then, I just need to verify that the reverse of that offset exists for that pipe, meaning they both connect to each other.

Once I have a list of pipe neighbors, I check to see if any are newly discovered, and add all of them to the set of discovered pipes. If there are new pipes, we pick one to continue the loop from. If not, we've looped back to the start and we're done.

For part 1, our goal is to find the furthest point on the loop from our starting point. In our case, it looks like:

```
..45.
.236.
01.78
14567
23...
```

Where **8** is the greatest distance. Since the loop is always an even number of tiles, we can just divide the length of the pipe by 2. This pipe is 16 tiles long, so there's our answer.

## Part 2

Hokay, now it's time for the real puzzle to start. We need to figure out how many tiles are contained within the inner surface of our loop. The examples we're given demonstrate one important wrinkle in finding the solution:

```
..........
.╔══════╗.
.║╔════╗║.
.║║OOOO║║.
.║║OOOO║║.
.║╚═╗╔═╝║.
.║II║║II║.
.╚══╝╚══╝.
..........
```

In the example above, only the four `I` tiles are actually inside the loop. The `O` tiles may appear to be, but they're technically touching the outside of the loop, but enclosed within a pocket.

I'm sure the actual solution involves following the loop to determine which side is inside/outside, but after thinking about it for a while I came to the brilliant/stupid realization of "what if I just make the graph bigger so all the gaps were opened?"

It's a terrible, inefficient, lazy, and nasty solution, so naturally I went right for it.

```python
def scale_grid(self):
    scaled_grid = Grid.create_empty(self.grid.width * 2, self.grid.height * 2, '.')

    for x in range(self.grid.extents[0][1] + 1):
        for y in range(self.grid.extents[1][1] + 1):
            grid_val = self.grid[(x, y)]

            scaled_grid[(x * 2, y * 2)] = self.grid[(x, y)]

            if grid_val != 'S':
                for neighbor_offset in PIPE_NEIGHBOR_OFFSETS[grid_val]:
                    nx, ny = neighbor_offset
                    scaled_grid[((x * 2) + nx, (y * 2) + ny)] = '-' if ny == 0 else '|'

    return scaled_grid
```

So, I make a new grid 2x the size of the original, and copy all the pipe tiles over to it. I also insert new `|` and `-` pipes wherever they fit, to keep the loop solid.

So, this:

```
..........
.S══════╗.
.║╔════╗║.
.║║....║║.
.║║....║║.
.║╚═╗╔═╝║.
.║..║║..║.
.╚══╝╚══╝.
..........
```

Becomes this:

```
....................
....................
..S═════════════╗...
..║.............║...
..║.╔═════════╗.║...
..║.║.........║.║...
..║.║.........║.║...
..║.║.........║.║...
..║.║.........║.║...
..║.║.........║.║...
..║.╚═══╗.╔═══╝.║...
..║.....║.║.....║...
..║.....║.║.....║...
..║.....║.║.....║...
..╚═════╝.╚═════╝...
....................
....................
....................
```

Absolutely evil.

Of course, now that the graph has been redrawn, I'll have to re-acquire the loop. Once that's done, it's time for an old classic, the flood fill algorithm!

I'll hold for your applause.

Okay, this is another big function, so I'm going to try and break it down:

```python
def flood_fill(self):
    univisited_points = [p for p in self.grid.grid if self.grid[p] == self.grid.default_value]
    point_queue = []
    pending_points = []

    inside_points = 0

    while len(univisited_points):
        hit_extents = False

        point_queue.append(univisited_points[0])

        while len(point_queue):
            x, y = point = point_queue.pop()
            pending_points.append((x, y))

            if point in univisited_points:
                univisited_points.remove(point)

            if x in self.grid.extents[0] or y in self.grid.extents[1]:
                hit_extents = True

            for neighbor in self.grid.neighbors((x, y)):
                nx, ny = neighbor[0]
                if (nx, ny) in univisited_points:
                    point_queue.append((nx, ny))

        for p in pending_points:
            self.grid[p] = 'O' if hit_extents else 'I'

        if not hit_extents:
            inside_points += len(pending_points)
        pending_points.clear()

    return inside_points
```

```python
univisited_points = [p for p in self.grid.grid if self.grid[p] == self.grid.default_value]
point_queue = []
pending_points = []

inside_points = 0
```

To start, I create a bunch of lists we're going to use throughout the job. `univisited_points` contains all of the empty tiles we're going to be testing.

```python
while len(univisited_points):
    hit_extents = False

    point_queue.append(univisited_points[0])
```

To start, we queue up the first unvisited point, and we'll continue this loop until they've all been visited.

```python
while len(point_queue):
    x, y = point = point_queue.pop()
    pending_points.append((x, y))

    if point in univisited_points:
        univisited_points.remove(point)

    if x in self.grid.extents[0] or y in self.grid.extents[1]:
        hit_extents = True

    for neighbor in self.grid.neighbors((x, y)):
        nx, ny = neighbor[0]
        if (nx, ny) in univisited_points:
            point_queue.append((nx, ny))
```

Now, we're going to process the queue until it's emptied. This most likely won't use up all of the unvisited points, but all of the points connected to a specific segment of the grid.

For each member of the queue, we remove it from the unvisited pool, then test to see if we're at the borders of the grid. If we are, then we know for sure we're outside.

Here's how our grid looks after the first queue is exhausted:

```
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
OOS═════════════╗OOO
OO║.............║OOO
OO║.╔═════════╗.║OOO
OO║.║OOOOOOOOO║.║OOO
OO║.║OOOOOOOOO║.║OOO
OO║.║OOOOOOOOO║.║OOO
OO║.║OOOOOOOOO║.║OOO
OO║.║OOOOOOOOO║.║OOO
OO║.╚═══╗O╔═══╝.║OOO
OO║.....║O║.....║OOO
OO║.....║O║.....║OOO
OO║.....║O║.....║OOO
OO╚═════╝O╚═════╝OOO
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
```

And after the second:

```
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
OOS═════════════╗OOO
OO║IIIIIIIIIIIII║OOO
OO║I╔═════════╗I║OOO
OO║I║OOOOOOOOO║I║OOO
OO║I║OOOOOOOOO║I║OOO
OO║I║OOOOOOOOO║I║OOO
OO║I║OOOOOOOOO║I║OOO
OO║I║OOOOOOOOO║I║OOO
OO║I╚═══╗O╔═══╝I║OOO
OO║IIIII║O║IIIII║OOO
OO║IIIII║O║IIIII║OOO
OO║IIIII║O║IIIII║OOO
OO╚═════╝O╚═════╝OOO
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOOOOOO
```

Then, we look at all the neighboring tiles. If any of them are also unvisited, we'll add them to the queue.

```python
for p in pending_points:
    self.grid[p] = 'O' if hit_extents else 'I'

if not hit_extents:
    inside_points += len(pending_points)
pending_points.clear()
```

Now that we've exhausted the points queue, it's time to mark off the points we've found as either inside or outside.

Then, we tally up the number of inside points, reset our pending list, and return to the top once more.

```python
return inside_points
```

Finally, once we're done, we have the total number of points inside the grid.

---

...Is what I would have said, if not for the fact that the grid is two times as large now.

We still have one more step to do, which is to calculate how many inside points *really* exist.

For that, I wrote an aptly named function which searches the grid at every other interval, and checks for 2x2 grids of inside tiles.

```python
def get_inside_points_cheaty(self):
    total = 0

    for x in range(0, self.grid.extents[0][1] + 1, 2):
        for y in range(0, self.grid.extents[1][1] + 1, 2):
            if self.grid[(x, y)] == 'I' and self.grid[(x + 1, y)] == 'I' and \
                self.grid[(x, y + 1)] == 'I' and self.grid[(x + 1, y + 1)] == 'I':
                total += 1

    return total
```

And with that, we finally get the real total of **4** inside tiles.

## Closing Thoughts

I feel dirty about my solution to this problem. I really should go back and solve this one the quote-unquote proper way but I'm also really proud of the hacky solution I wrote.

Judging by the talk I've seen from other people who've solved it, I'm not the only one to take this route.

## Addendum

Alright, I had to go back and solve this for real.

First, as a maybe overzealous bit of optimizations, I replaced all instances of the Point helper class with plan old tuples.

Then, I added a big ol' dictionary for various pipe directions.

```python
LOOP_SIDES = {
    # Right
    ('-', (1, 0)): [
        [(0, -1)],
        [(0, 1)]

    ],
    # Left
    ('-', (-1, 0)): [
        [(0, 1)],
        [(0, -1)]
    ],
    # Down
    ('|', (0, 1)): [
        [(1, 0)],
        [(-1, 0)]
    ],
    # Up
    ('|', (0, -1)): [
        [(-1, 0)],
        [(1, 0)]
    ],
    # Right Up
    ('J', (0, -1)): [
        [(-1, -1)],
        [(1, 0), (1, -1), (0, -1)]
    ],
    # Down Left
    ('J', (-1, 0)): [
        [(1, 0), (1, -1), (0, -1)],
        [(-1, -1)]
    ],
    # Right Down
    ('7', (0, 1)): [
        [(1, 0), (1, 1), (0, 1)],
        [(-1, 1)]
    ],
    # Up Left
    ('7', (-1, 0)): [
        [(-1, 1)],
        [(1, 0), (1, 1), (0, 1)]
    ],
    # Left Up
    ('L', (0, -1)): [
        [(-1, 0), (-1, 1), (0, 1)],
        [(1, -1)]
    ],
    # Down Right
    ('L', (1, 0)): [
        [(1, -1)],
        [(-1, 0), (-1, 1), (0, 1)]
    ],
    # Up Right
    ('F', (1, 0)): [
        [(0, -1), (-1, -1), (-1, 0)],
        [(1, 1)]
    ],
    # Left Down
    ('F', (0, 1)): [
        [(1, 1)],
        [(0, -1), (-1, -1), (-1, 0)]

    ]
}
```

Let me explain.

For each entry, the key is a tuple containing (1) the pipe character, and (2) the outgoing direction.

Then, the values for each consist of two arrays. The first array contains all of the neighboring points on the lefthand side of the pipe, and the second is all the righthand points.

---

Now, after finding the loop and removing the extra pipe bits, I call my new function, `scan_loop_edges`.

```python
def scan_loop_edges(self):
    x, y = [pos for pos in self.grid.grid if self.grid[pos] == 'S'][0]

    loop_segments = set()
    loop_segments.add((x, y))

    loop_finished = False

    found_out_side = False
    a_is_outside = False

    while not loop_finished:
        pipe_neighbors = self.get_pipe_neighbors(Point(x, y))

        new_neighbors = [n for n in pipe_neighbors if n not in loop_segments]
        if len(new_neighbors):
            direction = (new_neighbors[0][0] - x, new_neighbors[0][1] - y)

            if self.grid[(x, y)] == 'S':
                pipe = self.get_start_replacement()
            else:
                pipe = self.grid[(x, y)]

            side_checks = LOOP_SIDES[(pipe, direction)]

            left_is_out = self.check_side(x, y, side_checks[0], found_out_side, True)
            right_is_out = self.check_side(x, y, side_checks[1], found_out_side, False)

            if not found_out_side and left_is_out:
                a_is_outside = True
                found_out_side = True
            if not found_out_side and right_is_out:
                a_is_outside = False
                found_out_side = True

            x, y = new_neighbors[0]
        else:
            loop_finished = True

        for neighbor in pipe_neighbors:
            loop_segments.add(neighbor)

    return a_is_outside
```

This function is a heavily modified version of `locate_loop` that takes my existing loop and steps through it, marking down any adjacent edges it finds along the way.

Note that in order to search from the start of my loop, I also wrote a function `get_start_replacement` that simply returns whatever pipe tile the start tile functions as.

```python
def get_start_replacement(self):
    x, y = start = [pos for pos in self.grid.grid if self.grid[pos] == 'S'][0]

    pipe_neighbors = self.get_pipe_neighbors(start)

    if pipe_neighbors[0][0] == x and pipe_neighbors[1][0] == x:
        return '-'
    if pipe_neighbors[0][1] == y and pipe_neighbors[1][1] == y:
        return '|'
    if any([p[0] - x == 1 for p in pipe_neighbors]) and any([p[1] - y == 1 for p in pipe_neighbors]):
        return '7'
    if any([p[0] - x == 1 for p in pipe_neighbors]) and any([p[1] - y == -1 for p in pipe_neighbors]):
        return 'J'
    if any([p[0] - x == -1 for p in pipe_neighbors]) and any([p[1] - y == 1 for p in pipe_neighbors]):
        return 'F'
    if any([p[0] - x == -1 for p in pipe_neighbors]) and any([p[1] - y == -1 for p in pipe_neighbors]):
        return 'L'

    return 'S'
```

Revisiting `scan_loop_edges` again, here is the relevant portion:

```python
side_checks = LOOP_SIDES[(pipe, direction)]

left_is_out = self.check_side(x, y, side_checks[0], found_out_side, True)
right_is_out = self.check_side(x, y, side_checks[1], found_out_side, False)

if not found_out_side and left_is_out:
    a_is_outside = True
    found_out_side = True
if not found_out_side and right_is_out:
    a_is_outside = False
    found_out_side = True
```

After we determine which pipe we're on and which direction we're going towards the next pipe, we look them up in `LOOP_SIDES` to get the lefthand and righthand points.

Then, we send both into another function, `check_side`.

```python
def check_side(self, x, y, side_checks, found_out_side, is_lefthand):
    is_out_side = False

    for check in side_checks:
        cx, cy = check
        edge = (x + cx, y + cy)

        if self.grid[edge] == '.':
            if not found_out_side:
                is_out_side = self.is_point_outside(edge)
            self.grid[edge] = 'A' if is_lefthand else 'B'

    return is_out_side
```

This function does two things:

1. It checks to see if each edge on the left/right side of a pipe is an empty space, and if so marks it off as `A` for left or `B` for right.{{< sup down 1 >}}
2. It looks in the four cardinal directions to see if any of them has an unobstructed path to the extents of the grid (i.e. not touching the loop). If so, then we know that this is the outer side, which is important for later.

After marking all the relevant points, it returns `True` if we determined that this is the outside of the loop. If so, we'll record that fact up in `scan_loop_edges` and stop running that test, since we've determined the answer.

```python
return a_is_outside
```

After we've finished cycling the loop, we return to the main function with `True` if the lefthand side (`A`) is the outside half, otherwise `False` for righthand (`B`).

Now, one more step: We need to run `flood_fill` to find all of the interior points (remember that we've only scanned the edges adjacent to the loop at the moment).

I run flood fill for both `A` and `B` in my code, not because I need to but simply to make the visual output a bit prettier.

I've also modified and simplified my flood fill algorithm a bit:

```python
def flood_fill(self, char_to_target):
    univisited_points = [p for p in self.grid.grid if self.grid[p] == char_to_target]
    point_queue = []

    while len(univisited_points):
        point_queue.append(univisited_points[0])

        while len(point_queue):
            x, y = point = point_queue.pop()

            if point in univisited_points:
                univisited_points.remove(point)

            for neighbor in self.grid.neighbors((x, y)):
                nx, ny = neighbor[0]
                neighbor_val = self.grid[neighbor[0]]

                if neighbor_val != char_to_target and neighbor_val != self.grid.default_value:
                    continue

                if (nx, ny) in univisited_points or neighbor_val == self.grid.default_value:
                    self.grid[neighbor[0]] = char_to_target
                    point_queue.append((nx, ny))
```

Since we don't care about determining the total number of points filled anymore (we'll just calculate that later), I've removed those parts of the function. I've also modified it to allow me to target specific characters. So now it'll take an input character, `A` or `B`, scan for any empty tiles around it, and fill them all with the same character.

That gives us something like this:

```
BBBBBBBBBB
BS══════╗B
B║╔════╗║B
B║║BBBB║║B
B║║BBBB║║B
B║╚═╗╔═╝║B
B║AA║║AA║B
B╚══╝╚══╝B
BBBBBBBBBB
```

Then, we just need to determine which character we're looking for, and return the number of tiles equal to that character.

```python
matching_char = 'B' if a_is_outside else 'A'

return len([p for p in self.grid.grid if self.grid[p] == matching_char])
```

---

As opposed to my first iteration taking over a minute, this version takes roughly two seconds.

All in all, I can't argue with that.

---

{{< sup up 1 >}}
I wanted to use `L` and `R` for clarity, but of course `L` is already used as one of the pipe tiles. Oh, well.
