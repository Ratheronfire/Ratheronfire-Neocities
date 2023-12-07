---
title: "Advent of Code 2023 - Day 1"
date: 2023-12-01T22:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

Last year I was introduced to [Advent of Code](https://adventofcode.com/), a yearly coding challenge that runs throughout the month of December with increasingly complex problems each week. Although I wasn't able to finish all 25 days last time, I was excited to try my hand again this year, and I thought I would compile my thoughts for each day as I went.

My submissions are available on a public git repository [here](https://github.com/Ratheronfire/advent-of-code), where I've been writing up my solutions in Python, along with some helper functions I've been building gradually as needed. Naturally day 1's code wasn't too complicated, but I'm already starting to dread some of the later days, knowing [where things can go](https://github.com/Ratheronfire/advent-of-code/blob/master/2022/day-22.py).

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/2023/day-1.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

On the onset, this problem was fairly straightforward. We're givien a number of strings containing integer digits, and we need to parse out the first and last digits from each line, then do some basic addition with them.

```
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
```

For this example inputs, the numbers would be:

```
[1] abc [2]         => 12
pqr [3] stu [8] vwx => 38
a [1] b2c3d4e [5] f => 15
treb [7] uchet      => 77 (The seven counts as both the first and last)
```

Then, we just take the resulting two-digit numbers and total them, giving us our total of 142.

I implemented this by scanning each line from the front and back, one character at a time, until both extents were found.

```python
def get_nums(self, line: str):
    first, last = '', ''

    for i in range(len(line)):
        if first == '' and line[i].isnumeric():
            first = line[i]

        if last == '' and line[len(line) - 1 - i].isnumeric():
            last = line[len(line) - 1 - i]

    return int(first + last)
```

In retrospect the easier option would've been to filter out all non-numeric values and select the first and last numbers, but this worked well enough for part 1.

# Part 2

As usual, however, part 2 is where things get interesting. The second part of AoC problems typically play on your assumptions of the problem from part 1, and force you to re-conceptualize the problem in a more concrete way. Basically, they're speed traps for coders trying to find the lazy, easy solutions.

Now, in addition to integers we're forced to also look for the digits spelled out in text.

```
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
```

Within the sample input we're given, you can also see evidence of a couple edge cases designed to throw you off.{{< sup dir="down" >}}1{{</ sup >}} In the second line, ``eight`` and ``two`` share a letter, and the last line ends with ``sixteen``. We're intended to treat these lines as ``823`` and ``7pqrst6teen`` respectively, the first because both ``eight`` and ``two`` are valid numbers present in the string, and the second because, per the exact phrasing of the challenge, only digits matter -- the ``teen`` part of ``sixteen`` is just a red herring.

The first part gave me a bit of trouble: I first tried to take the simple approach of replacing each string with its corresponding digit: ``one => 1``, ``two => 2``, and so on. This didn't work, however, because by replacing entire number strings I was removing parts of overlapping numbers.  `eightwo` became `eigh2`, when it should have become `eight2` and then `82`.{{< sup dir="down" >}}2{{</ sup >}}

My solution was to perform the same logic as part 1, but to add an additional step before processing each line to replace only the first and last string-based numbers with digits. This meant scanning from both the front and the back of each line, finding the first character which is part of a number, and replacing it with the digit. Naturally, if an existing digit came first, I would stop seeking there, and leave the line as-is.

```python
def fix_num_strs(self, line):
    digit_strs = [
        'one', 'two', 'three', 'four', 'five',
        'six', 'seven', 'eight', 'nine', 'ten', 'zero'
    ]

    found_first = False
    found_last = False

    for i in range(len(line)):
        if found_first or line[i].isnumeric():
            break  # found a real number first

        for digit in digit_strs:
            if line[i:i+len(digit)] == digit:
                line = line[:i] + str(digit_strs.index(digit) + 1) + line[i+len(digit):]
                found_first = True
                break

    for i in range(len(line) - 1, -1, -1):
        if found_last or line[i].isnumeric():
            break  # found a real number first

        for digit in digit_strs:
            if line[i-len(digit)+1:i+1] == digit:
                line = line[:i-len(digit)+1] + str(digit_strs.index(digit) + 1) + line[i+1:]
                found_last = True
                break

    return line
```

With that, I was able to extract the proper values for the new inputs:

```
[two] 1 [nine]         => two nine    => 29
[eight] wo [three]     => eight three => 83
abc[one] 2 [three] xyz => one three   => 13
x [two] ne3 [four]     => two four    => 24
[4] nineeightseven [2] => 4 2         => 42
z [one] ight23 [4]     => one 4       => 14
[7] pqrst [six] teen   => 7 six       => 76
```

Adding them up again, we get our total for part 2's puzzle input, 281.

## Closing Thoughts

Nothing super involved, but this was more thinking than I expected for the first day. I've seen speculation that this first puzzle was explicity designed to thwart players relying on LLMs to solve the puzzle for them, which I could believe, since anything involving interpreting complicated text patterns seems to really mess up GPT generators. It seems to have worked fairly well, considering that the longest solve time to make the global leaderboards was 7 minutes, which seems fairly slow for an AI-based solution and lines up pretty well with the leaderboards of past years.

Looking forward, I'm expecting to see some grid-based puzzles fairly soon, those seem like a fairly regular occurence. It's interesting having to re-aquaint myself with topics that I rarely see in practice now, like string manipulation, large-scale recursion, pathfinding, and dynamic programming.

...Boy, I'm really not looking forward to the [dynamic programming puzzles](https://adventofcode.com/2022/day/16)...

---

{{< sup dir="up" >}}1{{</ sup >}}
*(Of course, if I had looked into the unique puzzle input I was given, I might have noticed this pattern before reaching part 2... Ah, well.)*

{{< sup dir="up" >}}2{{</ sup >}}
I saw other people work around this by simply leaving in the edges of each number and inserting the digit in the center (``one => o1ne``, ``seven => se7en``) so that the edge matches still work. I don't think it's possible for digits to overlap by any more than one letter, so I have to imagine that trick works on all possible inputs, but I can't say for sure.