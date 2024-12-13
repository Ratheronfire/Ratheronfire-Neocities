---
title: "Advent of Code 2024 - Day 4"
date: 2024-12-13T00:44:51-05:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2024
---

I massively overcomplicated this one. Pretty simple problem in retrospect, but my attempt to write a smart solution backfired super hard this time.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-4.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

To start, we're given a grid of text we're meant to treat as a word search.

```
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
```

The goal is to simply count the number of times ``XMAS`` appears. Naturally, this can be in any direction.

In the sample puzzle, these are found here:


```
....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
```

In total, there are **``18``** appearances of ``XMAS``.

My initial solution was admittedly far more complicated than it should've been. I decided to try and plan ahead by pre-scanning the word search and creating a list of all the possible directions words could be searched in.

```python
def prepare_data(self, input_data: List[str], current_part: int):
    self.text = [l for l in input_data if l != '']

    self.text_searches = []

    # rows
    for i in range(len(self.text)):
        self.text_searches.append((self.text[i], 'row %d' % i))

    # columns
    for x in range(len(self.text[0])):
        col = ''

        for y in range(len(self.text)):
            col += self.text[y][x]

        self.text_searches.append((col, 'column %d' % x))

    # diagonals
    for y in range(len(self.text) - 1):
        self.text_searches.append((
            self.get_diagonal(0, y, True),
            "diagonal right from (%d, %d)" % (0, y)
        ))  # rights first half
        self.text_searches.append((
            self.get_diagonal(len(self.text[0]) - 1, y, False),
            "diagonal left from (%d, %d)" % (len(self.text[0]) - 1, y)
        ))  # lefts first half

    for x in range(1, len(self.text[0]) - 1):
        self.text_searches.append((
            self.get_diagonal(x, 0, True),
            "diagonal right from (%d, %d)" % (x, 0)
        ))  # rights second half
        self.text_searches.append((
            self.get_diagonal(x, 0, False),
            "diagonal left from (%d, %d)" % (x, 0)
        ))  # lefts second half

    self.text_searches.sort(key=lambda s: s[1])

def get_diagonal(self, x: int, y: int, is_right: bool) -> str:
    diagonal = ''

    while 0 <= x < len(self.text[0]) and 0 <= y < len(self.text):
        diagonal += self.text[y][x]
        y += 1
        x += 1 if is_right else -1

    return diagonal
```

The logic here was messy and overcomplicated, but my thinking was that I could save myself from annoying grid logic by abstracting that portion of the logic away. After my initial prep work, I could then simply scan each slice of the grid linearly to find my total.

```python
def get_word_count(self, word: str) -> int:
    count = 0

    for search in self.text_searches:
        text = search[0]
        for i in range(len(text)):
            if text[i:i+len(word)] == word:
                count += 1

            if text[::-1][i:i+len(word)] == word:
                count += 1

    return count
```

For each slice of the grid, I searched frontwards and backwards (the logic for backward searching took a while to iron out, as well), and I had my answer. Not very clean, but it worked.

## Part 2

Now, for part 2, a new wrench is thrown in that completely broke my existing logic. The goal now is to search for the number of spaces where two instances of ``MAS`` form in a X structure, like so:

```
M.S
.A.
M.S
```

Or:

```
S.S
.A.
M.M
```

And so on.

The original grid looks like this when this new logic is applied:

```
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
```

And the total number of "``X-MAS``" appearances is **``9``**.

The two halves of the X can be in any orientation, so my logic had to prepare for it.

Again, my logic took on a number of forms before I managed to organize it properly. At this point I knew I had to write proper logic for detecting words multi-directionally, but the big question was how to detect crossing words, and **only** crossing words.

Ultimately I decided to search for the centerpoints of these structures, i.e. any points at the exact center of two crossing words.

To start, I wrote a function which checks if the word exists at a point ``position``, searching in direction ``direction``.

```python
def is_word(self, position: Point, direction: Point, word_to_match: str) -> bool:
    word = ''

    for i in range(len(word_to_match)):
        if position.x < 0 or position.x > len(self.text[0]) - 1 or position.y < 0 or position.y > len(self.text) - 1:
            break

        word += self.text[position.y][position.x]
        position += direction

    return word == word_to_match
```

Then, I loop through each point of the grid (excluding the edges, since I'm focusing on the centers of the cross patterns) to find any pairs of words that match the requirements:

```python
def get_cross_word_count(self, word: str):
    count = 0

    for y in range(1, len(self.text) - 1):
        for x in range(1, len(self.text[0]) - 1):
            dirs = [
                Point(1, 1), Point(1, -1),
                Point(-1, 1), Point(-1, -1)
            ]

            crossed_words = 0

            for direction in dirs:
                if self.is_word(Point(x, y) - direction, direction, word):
                    crossed_words += 1

            if crossed_words >= 2:
                count += 1

    return count
```

With this new, simpler logic, I also decided to go back and clean up my solution for part 1.

```python
def get_word_count(self, word: str) -> int:
    count = 0

    for y in range(len(self.text)):
        for x in range(len(self.text[0])):
            dirs = [
                Point(0, 1),  Point(0, -1),
                Point(1, 0),  Point(-1, 0),
                Point(1, 1),  Point(1, -1),
                Point(-1, 1), Point(-1, -1)
            ]

            for direction in dirs:
                if self.is_word(Point(x, y), direction, word):
                    count += 1

    return count
```

## Closing Thoughts

Today was a much-needed reminder that a good portion of the challenge of Age of Clicking is determining the inner logic of the problem, and finding the simplest possible solution that satisfies the needs of the puzzle.

I did consider trying to use my Grid helper function I've rolled out more than a few times before, but this time around I fooled myself into thinking I could find an easier solution.

Oh well, they can't all be winners.