---
title: "Advent of Code 2024 - Day 2"
date: 2024-12-03T00:39:56-05:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2024
---

Not too bad today! It seemed like this problem was going to be more complicated than it was at first, but the solution I ended up with was pretty straightforward.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-2.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

For this puzzle, we're given a list of records. Each of those records contains a list of numbers, called levels. The goal is to find the number of "safe" rows, i.e. rows satisfying the following conditions:

* The levels are all in either ascending or descending order.
* Each successive number is at least one higher/lower than the previous, but not more than three.

The sample record list looks like this:

```
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
```

In this example, the second row (``1 2 7 8 9``) fails because of the gap of 5 between 2 and 7, and the third row (``9 7 6 2 1``) fails because of the gap of 4 between 6 and 2. The fourth (``1 3 2 4 5``) alternates between ascending and descending and the fifth (``8 6 4 4 1``) contains a repeat value, meaning the total number of safe rows is only **``2``**.

My implementation was fairly straightforward, just checking every number from ``1`` to ``len(report)`` to ensure it satisfies the conditions. If any don't, this record fails.


```python
def is_safe_record(report: list[int]) -> bool:
    ascending = report[1] > report[0]

    for i in range(1, len(report)):
        a, b = report[i], report[i-1]
        if (a > b) != ascending or abs(a - b) > 3 or a == b:
            return False

    return True
```

## Part 2

Now for part 2, safety regulations become a bit lax, and records are allowed one invalid value before being counted as failed. After puzzling over how I wanted to implement this, I decided to simply modify the ``is_safe_record`` function to lazily check if removing any one number would allow the row to pass.

```python
def is_safe_record(report: list[int], allow_removal=False) -> bool:
    ascending = report[1] > report[0]

    is_safe = True

    for i in range(1, len(report)):
        a, b = report[i], report[i-1]
        if (a > b) != ascending or abs(a - b) > 3 or a == b:
            is_safe = False

    if not is_safe and allow_removal:
        for i in range(len(report)):
            if is_safe_record(report[0:i] + report[i+1:]):
                is_safe = True

    return is_safe
```

With this new check in place, the fourth and fifth rows are now "safe" with the removal of one problem number each.

Just don't tell OSHA.

## Closing Thoughts

I could easily see today's problem becoming way more complicated than it needed to be. Luckily I've gotten pretty good at deciphering the puzzle descriptions and understanding what specifically is being asked. Sometimes things really are as simple as they seem!