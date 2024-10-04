---
title: "Advent of Code 2023 - Day 6"
date: 2023-12-06T01:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

And the Advent of Code pendulum swings once more.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-6.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

We're given details on a series of toy boat races, namely the allotted time, and the record high distance for that race. Races are performed by first spending X seconds building your boat's speed, then spending the rest of time moving at that speed.

The output we're seeking requires us to calculate how many different ways each race can be won (in other words, how many seconds we spend building speed before moving, from 0 seconds to the full duration).

For the sample data, we have:

```
Time:      7  15   30
Distance:  9  40  200
```

The code for all of this is pretty straightforward:

```python
class Race:
    def __init__(self, time: int, distance: int):
        self.time = time
        self.distance = distance

    def get_distance(self, seconds_held: int):
        return max(0, (self.time - seconds_held) * seconds_held)
```

```python
def get_winning_range(self, race: Race):
    i, j = 0, 0

    for i in range(1, race.time):
        if race.get_distance(i) > race.distance:
            break

    for j in range(race.time - 1, 0, -1):
        if race.get_distance(j) > race.distance:
            break

    return j - i + 1
```

For each race, we calculate the lowest and highest winning time (per the problem text, all times between the first and last winning time should also be winners).

Then we just take the winning time windows for all the races and multiply them to get our answer.

```python
reduce(lambda a, b: a * b, [self.get_winning_range(race) for race in self.races])
```

For the input races, that's ``4 * 8 * 9 = ``**``288``**.

## Part 2

Now, we need to treat the three races as a single race, ignoring the spaces between them.

I'm not sure if this was intended to be too hard to compute manually, but I didn't have much trouble adapting my part 1 solution for the new numbers.

Not much to show here -- other than updating my parsing script, I didn't have to add any new code to the parts I showed before.

The input race now has a time of ``71530`` and a record distance of ``940200``, resulting in **``71503``** ways to win.

## Closing Thoughts

Day 6 was a much needed reprieve after the nightmare yesterday was, though it does leave me feeling like this year's problems have been a bit too lopsided so far. The difficulty curve usually feels fairly linear, but as I've said before I have absolutely no sense of where each day will lie this time around.

Of course, these easy days seem to be followed up by the real brain-breaking problems, so fingers crossed for tomorrow.

## Addendum

It didn't occur to me until reading everyone else's submissions that this was a quadratic formula problem. So, I decided to dust off my semi-remembered knowledge and make a less brute-forced solution to today's problem.


```python
def calculate_quadratic_roots(self, race):
    # winning times: (race.time - seconds_held) * seconds_held > race.distance
    # -(seconds_held ** 2) + race.time * seconds_held - race.distance = 0
    # a == -1                b == race.time             c == -race.distance
    a = -1
    b = race.time
    c = -race.distance

    root_portion = math.sqrt(b ** 2 - 4*a*c)

    return (math.ceil((-b - root_portion) / (2 * a)) - 1) - \
        (math.floor((-b + root_portion) / (2 * a)) + 1) + 1
```

Now, all we have to do is  ~~[make the quadratic formula explode](https://youtu.be/Az49aNuYeJs?t=15)~~ calculate the roots using the quadratic formula for each race, and do our math on that.

I can't take any credit for the logic here, I've seen more than a few people derive this formula, but for the sake of completeness, here's how I arrived at this answer{{< sup "down" 1 >}}:

* We're looking for the times where ``(race.time - seconds_held) * seconds_held > race.distance``. By subtracting both sides by ``race.distance``, we get:
* ``(race.time - seconds_held) * seconds_held - race.distance > 0``
* Factoring out the parentheses gives us ``race.time * seconds_held - seconds_held * seconds_held - race.distance > 0``, which we can rewrite as:
* ``-seconds_held^2 + race.time * seconds_held - race.distance > 0``
* Wait, this is starting to look all too familiar...
* If we treat this as the quadratic formula ``-x^2 + race.time*x - race.distance = 0``, then our parameters are:
* ``a = -1, b = race.time, c = -race.distance``
* So if we plug those into everyone's favorite formula (which I remembered more of than I thought I would), ``(-b +/- sqrt(b^2 - 4ac)) / 2a``, that will give us the roots of this equation.
* Then, we just need to find the nearest integers which correspond to the seconds{{< sup "down" >}} from the problem, and we're done!

With this new method in place, my solution went from computing in ~2 seconds to computing so quickly that the framework I wrote to track the time spent just shows 0.0 ms. Can't argue with that, I suppose.

{{< sup "up" 1 >}}
Forgive me if any of this is wrong, my algebra is horrifically rusty.

{{< sup "up" 2 >}}
Okay, *technically* the problem uses milliseconds, but who's counting?