---
title: "Advent of Code 2023 - Day 9"
date: 2023-12-09T01:00:00-04:00
draft: false
categories:
- blog
tags:
- advent-of-code
- devlog
- aoc2023
---

it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives it's derivatives

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-9.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

It is derivatives.

We're given a set of number lists, and our goal is to sequentially transform those numbers into smaller sets, where each element is the difference between the two corresponding elements of the above array, until all of them are zero (it's derivatives).

Our sample data looks like this:

```
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
```

And, in case you don't know what the method we're using to reduce these lists is (it's derivatives), it looks something like this{{< sup "down" 1 >}}

```
0   3   6   9  12  15
  3   3   3   3   3
    0   0   0   0
```

In the first row, each successive number is three greater than the one before it, so the next row is all threes.

In that row, the difference between each number is 0, so the next row is zero.

Our goal for this one is pretty simple: Determine what would be the next number in each list of numbers, and sum them up.

And here's how I did that:

```python
def get_next_value(self, value_set: list[int]):
    edge_values = [value_set[-1]]

    derivative_values = []

    while not all([v == 0 for v in value_set]):
        for i in range(len(value_set) - 1):
            derivative_values.append(value_set[i + 1] - value_set[i])

        value_set = derivative_values.copy()
        derivative_values = []

        edge_values.append(value_set[-1])

    return sum(edge_values)
```

For each inner row, I begin building a temporary array, then overwrite the base array with that one, keeping a record of the rightmost element of each row as I progress.

Then, once I've hit the zero row, all I have to do is add together all of the right-hand values, giving us the next value of the originating row.

For the rows we're given, that gives us `18 + 28 + 68 =` **`114`**.

## Part 2

Not a big twist for part 2: Now, we're calculating the value before the leftmost value instead of after the rightmost.

Doing this required only a slight rewrite of the original function, incorporating a new variable for which side we're adding an element on.

```python
def get_next_value(self, value_set: list[int], forwards=True):
    edge_values = [value_set[-1 if forwards else 0]]

    derivative_values = []

    while not all([v == 0 for v in value_set]):
        for i in range(len(value_set) - 1):
            derivative_values.append(value_set[i + 1] - value_set[i])

        value_set = derivative_values.copy()
        derivative_values = []

        edge_values.append(value_set[-1 if forwards else 0])

    if forwards:
        return sum(edge_values)
    else:
        num = 0
        edge_values.reverse()
        for edge_value in edge_values:
            num = edge_value - num

        return num
```

The math for determining the new left-hand value isn't quite as neat and there's probably a cleaner solution, but it gets the job done.

Now, we get `5 + -3 + 0 =` **`2`**.

## Closing Thoughts

It's derivatives.

## Addendum

So it turns out you didn't have to change very much at all for part 2. As a few people on the subreddit realized, literally all you have to do is just reverse the arrays before deriving them, and use the same method as part 1.


```python
def get_part_1_answer(self, use_sample=False) -> str:
    return str(sum([self.get_next_value(v) for v in self.value_sets]))

def get_part_2_answer(self, use_sample=False) -> str:
    return str(sum([self.get_next_value(v[::-1]) for v in self.value_sets]))
```

Laziness pays off sometimes.

{{< sup "up" 1 >}}
This bit was lifted directly from today's AoC page because I'm lazy.