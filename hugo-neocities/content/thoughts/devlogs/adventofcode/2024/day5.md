---
title: "Advent of Code 2024 - Day 5"
date: 2024-12-15T21:41:34-05:00
draft: false
tags:
- advent-of-code
- devlog
- aoc2024
---

I feel like my solution for today was a bit unconventional, but it worked out pretty well.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-5.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

For today's puzzle, we're given two sets of data. First, a series of number pairs divided by ``|``, then some lists of numbers (referred to as updates) separated by ``,``. The first sets are treated as rules for determining which order the two numbers should appear in within the updates, reading from left to right.

The sample data looks like this:

```
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
```

Most of these updates are correct, with three exceptions:

* ``75,97,47,61,53`` fails on the ordering rule ``97|75``.
* ``61,13,29`` fails on ``29|13``.
* ``97,13,75,29,47`` fails on ``29|13``, ``47|13``, ``47|29``, and ``75|13``.

To get the answer for part 1, we need to determine all the correctly ordered lists, get their middle number, and sum them.

I tried out a couple different approaches for this problem, but in the end I arrived at the following:

```python
def get_rules_for_update(self, update: list[int]) -> list[tuple]:
    rules = []

    for rule in self.order_rules:
        if rule[0] in update and rule[1] in update:
            rules.append(rule)

    return rules

def is_rule_valid(self, update: list[int], rule: tuple) -> bool:
    if not rule[0] in update or not rule[1] in update:
        return True

    left_index = update.index(rule[0])
    right_index = update.index(rule[1])

    return left_index < right_index

def is_update_valid(self, update: list[int]):
    return all([self.is_rule_valid(update, r) for r in self.get_rules_for_update(update)])     
```

To start, ``get_rules_for_update()`` finds all the rules where both the left and right numbers are present. Next, ``is_rule_valid()`` determines if a given update satisfies a given rule, and then ``is_update_valid()`` tests all the applicable rules for an update.

And then all that remains is to crunch the numbers.

```python
def get_part_1_answer(self, use_sample=False) -> str:
    valid_updates = [u for u in self.updates if self.is_update_valid(u)]

    return str(sum([u[math.floor(len(u) / 2.0)] for u in valid_updates]))
```

## Part 2

Now we need to focus on the invalid updates. Like before we're summing up their middle values, with the caveat that we need to correct those updates first.

And here's the function that does that:

```python
def get_fixed_ordering(self, update: list[int]) -> list[int]:
    rules = self.get_rules_for_update(update)

    new_list = []

    while len(rules):
        lowers = [rule[0] for rule in rules]
        highers = [rule[1] for rule in rules]

        lowest = [low for low in lowers if low not in highers][0]

        new_list.append(lowest)

        if len(rules) == 1:
            new_list.append(rules[0][1])
        rules = [rule for rule in rules if rule[0] != lowest]

    return new_list
```

I made the assumption that the given rules would fully describe the relationships between every number of every update, which I observed to mean that, for each update, there would always be one and only one number which only appears in the left hand side of the applicable rules (since, naturally, nothing could come before the leftmost number).

So, to "correct" the list, I would:
* Grab the full list of applicable rules.
* While there are still rules left:
  * Select the single number present only on the lefthand side of those rules,
  * Add that number to the new list,
  * And emove any rules with that number on the left from consideration.

The end result was the correctly ordered list, without having to deal with any of that pesky math.

## Closing Thoughts

There's probably a more proper mathy solution intended, involving numeric comparisons and sorting, but this felt much more straightforward, and luckily it worked out. Really shouldn't make a habit of making such big assumptions like this, though.