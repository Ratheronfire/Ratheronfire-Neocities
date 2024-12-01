---
title: "Advent of Code 2024 - Day 1"
date: 2024-12-01T12:40:32-05:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2024
---

Somehow it's already been a year since the last [Advent of Code](https://adventofcode.com/), which of course means it's once again time to see how much brain liquefaction I can tolerate! I started doing writeups [last year](../../2023/day1), and while I never actually finished, I had a ton of fun doing and so naturally I'd like to continue the trend this year.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-1.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

Pretty simple puzzle to start this year's event off. We're given two lists of mismatched numbers.

```
3   4
4   3
2   5
1   3
3   9
3   3
```

For part 1, we need to sequentially remove the lowest numbers from each list, and total up the differences of each of those pairs.

For the sample input data, that'd be ``1, 3``, ``2, 3``, ``3, 3``, ``3, 4``, ``3, 5``, and ``4, 9``. The differences being ``3-1=2``, ``3-2=1``, ``3-3=0``, ``4-3=1``, ``5-3=2``, and ``9-4=5``, for a total of ``2+1+0+1+2+5=``**``11``**.

To make getting this value easier, I pre-sorted both lists, then removed the first members from each until there was nothing left to remove.

```python
total = 0

self.left_list.sort(reverse=True)
self.right_list.sort(reverse=True)

while len(self.left_list) > 0 and len(self.right_list) > 0:
    min_left = self.left_list.pop()
    min_right = self.right_list.pop()

    total += abs(min_left - min_right)
```

## Part 2

For part 2, we now have to determine how many times the numbers in the left list appear in the right list. For each left-hand number, we multiply its value by its appearance count in the right, then total those values.

For the sample data, 3 appears 3 times, 4 once, and 1 and 2 never. Repeat numbers in the left list are counted each time, so the math looks like ``3*3 + 4*1 + 2*0 + 1*0 + 3*3 + 3*3=``**``31``**.

To avoid having to make needless repeat calculations, I started by creating a dictionary mapping numbers in the right table to their number of occurrences. Then I could simply look up those values as needed.

```python
total = 0

right_counts = {}

for num in self.right_list:
    if num in right_counts:
        right_counts[num] = right_counts[num] + 1
    else:
        right_counts[num] = 1

for num in self.left_list:
    if num in right_counts:
        total += num * right_counts[num]
```

## Closing Thoughts

Nothing terribly earth-shattering today, but I'm not letting my guard down. I've learned from experience that Advent of Code does *not* mess around, even if the early days are often this simple. Only a matter of time before things ramp up and I have to once again try to wrap my head around dynamic programming.