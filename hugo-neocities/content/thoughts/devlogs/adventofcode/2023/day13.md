---
title: "Advent of Code 2023 - Day 13"
date: 2023-12-17T22:00:01-04:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2023
---

Day 12 tanked my momentum pretty hard. I'm going to try and get back to it eventually, but for now I'm going to just make writeups for the remainder at my own pace.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-13.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

Another grid-based puzzle today. This one is fairly simple conceptually, but my implementation went through a few iterations before I figured out how to properly tackle it.

So, we're given a series of grids, like these two:

```
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
```

Each grid has some number of rows or columns reflected, and our goal is to figure out where this reflection point lies. One thing to note is that the only valid reflections are ones which reach to one of the extents of the grid (i.e. the first/last row or column).

Then to find our target number, we find the number of rows/columns either above or to the left of the reflection point (rows are multiplied by 100) and sum them across each grid.

Here's the tester I arrived at:

```python
def find_repeat_point(self, slices):
    mirror_points = []

    for i in range(len(slices) - 1):
        if slices[i] == slices[i+1]:
            mirror_points.append(i)

    if not len(mirror_points):
        return -1

    for mirror_point in mirror_points:
        mirror_offset = 1
        is_true_mirror = True

        while mirror_point - mirror_offset >= 0 and mirror_point + 1 + mirror_offset < len(slices):
            if slices[mirror_point - mirror_offset] != slices[mirror_point + 1 + mirror_offset]:
                is_true_mirror = False
            mirror_offset += 1

        if is_true_mirror:
            return mirror_point + 1

    return -1

def find_reflection_value(self, grid: Grid):
    rows = [str(grid[(0, i):(grid.width, i):(1, 1)]) for i in range(grid.height)]
    cols = [str(grid[(i, 0):(i, grid.height):(1, 1)]) for i in range(grid.width)]

    row_repeat_point = self.find_repeat_point(rows)
    col_repeat_point = self.find_repeat_point(cols)

    if col_repeat_point > -1:
        return col_repeat_point
    elif row_repeat_point > -1:
        return row_repeat_point * 100
    else:
        print('Something went wrong with this grid:')
        print(grid)
```

To start, I create slices for each row and column of the grid.{{< sup down 1 >}}

Then, I take those slices and step through until I find two neighboring slices that are equal to each other.

Note that I keep track of multiple mirrored slices, as any of them could potentially be the target reflection.

Now, for each reflection I found, I begin expanding outwards, comparing the slices around the mirror point.

So, if I found a mirror between columns 5 and 6, I'll test 4 and 7, then 3 and 8, 2 and 9, and so on.

If we find a pair that doesn't match, this reflection isn't valid and is ignored. If either the left/right side of the comparison is outside the list of slices, we've reached the end, and found our reflection point.

In our sample tables, that looks like:

```
   123456789
       ><
 1 #.##..##.
 2 ..#.##.#.
 3 ##......#
 4 ##......#
 5 ..#.##.#.
 6 ..##..##.
 7 #.#.##.#.
```

```
   123456789

 1 #...##..#
 2 #....#..#
 3 ..##..###
 4V#####.##.
 5^#####.##.
 6 ..##..###
 7 #....#..#
```

Here we have a reflection starting from `column 5` and `row 4`, for a total of `5 + 4*100 =` **`405`**.

## Part 2

For part 2, we're told that exactly one tile of each grid should be the opposite value. Because this could (but may not necessarily) cause a different reflection point, we'll need to update our logic to consider the possibility of one imperfection per grid.

`find_repeat_point()` now looks like this:

```python
def find_repeat_point(self, slices, is_part_2: bool):
    mirror_points = []

    for i in range(len(slices) - 1):
        left = slices[i]
        right = slices[i+1]
        imperfections = [j for j in range(len(left)) if left[j] != right[j]]

        if left == right or (is_part_2 and len(imperfections) == 1):
            mirror_points.append((i, len(imperfections)))

    if not len(mirror_points):
        return -1

    for mirror_point, base_imperfections in mirror_points:
        mirror_offset = 1
        is_true_mirror = True
        mirror_imperfections = 0

        while mirror_point - mirror_offset >= 0 and mirror_point + 1 + mirror_offset < len(slices):
            left = slices[mirror_point - mirror_offset]
            right = slices[mirror_point + 1 + mirror_offset]

            imperfections = [i for i in range(len(left)) if left[i] != right[i]]

            if left != right and (not is_part_2 or len(imperfections) != 1):
                is_true_mirror = False
            mirror_imperfections += len(imperfections)
            mirror_offset += 1

        if is_true_mirror and (not is_part_2 or (base_imperfections + mirror_imperfections) == 1):
            return mirror_point + 1

    return -1
```

The imperfection could be in the initial mirror scan or any of the subsequent scans, so we'll need to track the number of errors found as we go. If any mirror scan ever accumulates more than one imperfection, we'll reject it.

Now, both sample grids have new reflection points:

```
   123456789

 1 #.##..##.
 2 ..#.##.#.
 3V##......#
 4^##......#
 5 ..#.##.#.
 6 ..##..##.
 7 #.#.##.#.

   123456789

 1V#...##..#
 2^#....#..#
 3 ..##..###
 4 #####.##.
 5 #####.##.
 6 ..##..###
 7 #....#..#
 ```

 Our total now is `3 rows` plus `1 row`, for a total of `3*100 + 1*100 =` **`400`**.

## Closing Thoughts

I had a good feeling I wasn't going to be keeping up the daily pace much longer, and honestly it's kind of a relief to rip off that band-aid and let myself slow down a bit. Trying to get these problems solved at midnight wasn't too bad early on when the problems were relatively simple, but I would never have been able to keep that pace all month long.

Still would've hoped the streak lasted a bit longer, but that's okay.

---

{{< sup up 1 >}}
To get the row/column slices, I use an extension of Python's native array slicing syntax to grab a slice of points from `(0, i) to (grid.width, i + 1)` for each row `i`, and `(i, o) to (i + 1, grid.height)` for each column `i`.