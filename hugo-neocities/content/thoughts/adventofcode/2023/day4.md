---
title: "Advent of Code 2023 - Day 4"
date: 2023-12-04T01:00:00-04:00
draft: false
tags:
    - advent-of-code
    - aoc2023
---

Sometimes it's hard to predict just how hard an AoC puzzle will be. Some that look like a breeze will end up taking days, meanwhile the ones that seem like impossible tasks are done after half an hour, and luckily today was one of the latter puzzles.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-4.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

So, we're given a bunch of scratchcards. For each card, the lefthand group of numbers is the winning numbers, and the righthand side is the numbers present on the card.

```
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
```

To determine the value of a card we need to find the count of winning numbers present, with point values starting from 1 and doubling with each number found. In other words, `2 ^ (winner_count - 1)`.

```python
def get_win_count(self, card: Card):
    return len([n for n in card.found_numbers if n in card.winning_numbers])
```
```python
total = 0

for card in self.cards:
    win_count = self.get_win_count(card)

    if win_count:
        total += 2 ** (win_count - 1)
```

For the sample input, this looks like:

```
Card 1: 41 48 83 86 17 | [83] [86]  6 31 [17]  9   [48] 53 -> 4 Winners -> 2^(4-1) -> 8 Points
Card 2: 13 32 20 16 61 | [61] 30   68 82 17   [32] 24   19 -> 2 Winners -> 2^(2-1) -> 2 Points 
Card 3:  1 21 53 59 44 | 69   82   63 72 16   [21] 14  [1] -> 2 Winners -> 2^(2-1) -> 2 Points
Card 4: 41 92 73 84 69 | 59   [84] 76 51 58    5   54   83 -> 1 Winner  -> 2^(1-1) -> 1 Point
Card 5: 87 83 26 28 32 | 88   30   70 12 93   22   82   36 -> 0 Winners ->         -> 0 Points
Card 6: 31 18 13 56 72 | 74   77   10 23 35   67   36   11 -> 0 Winners ->         -> 0 Points
```

Add them all up, and you get `13` points.

## Part 2

Now things get a fair bit more complicated. *So...*

Instead of awarding points, winning scratchcards award more scratchcards. Cards that have `X` winning numbers award one each of the next `X` cards, so in our example card `1` awards one each of `2, 3, 4, and 5`. So, the goal now is to calculate the total number of scratchcards we'll end up with, assuming we start with one of each.

Reusing `get_win_count` from above, my strategy for this part was to maintain a dictionary of card id -> card totals, updating the numbers as I traveled down the list.

```python
for card in self.cards:
    card_score = self.get_win_count(card)

    for i in range(card.id, card.id + card_score):
        self.cards[i].card_count += card.card_count

card_total = sum([card.card_count for card in self.cards])
```

***Edit: I decided to go back and re-factor my part 2 code to make the logic a bit neater, including moving the card_count value from a dictionary to a value stored on each card directly.***

{{< details summary="My original solution, for posterity:" >}}
```python
cards_owned = {card.id: 1 for card in self.cards}

current_card = self.cards[0]
card_score = self.get_win_count(current_card)
cards_owned[current_card.id] = 1

while current_card is not None:
    for i in range(current_card.id + 1, current_card.id + 1 + card_score):
        if i in cards_owned:
            cards_owned[i] = cards_owned[i] + cards_owned[current_card.id]
        else:
            cards_owned[i] = cards_owned[current_card.id]

    if current_card.id < len(self.cards):
        current_card = self.cards[current_card.id]
        card_score = self.get_win_count(current_card)
    else:
        current_card = None
```
{{</ details >}}

Stepping through the sample input with this algorithm looks something like this:

```
Step 1
---------
[1 Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[1 Owned] Card 2 -> 2 Winners 
[1 Owned] Card 3 -> 2 Winners
[1 Owned] Card 4 -> 1 Winner 
[1 Owned] Card 5 -> 0 Winners
[1 Owned] Card 6 -> 0 Winners
```

```
Step 2
---------
[1 Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[2 Owned] Card 2 -> 2 Winners -> 2 Each of [3, 4]
[2 Owned] Card 3 -> 2 Winners
[2 Owned] Card 4 -> 1 Winner 
[2 Owned] Card 5 -> 0 Winners
[1 Owned] Card 6 -> 0 Winners
```

Since we own 2 copies of card 2 now, we get another two copies of 3 and 4 when we process 2. Continuing onward:

```
Step 3
---------
[1 Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[2 Owned] Card 2 -> 2 Winners -> 2 Each of [3, 4]
[4 Owned] Card 3 -> 2 Winners -> 4 Each of [4, 5]
[4 Owned] Card 4 -> 1 Winner 
[2 Owned] Card 5 -> 0 Winners
[1 Owned] Card 6 -> 0 Winners
```

```
Step 4
---------
[1 Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[2 Owned] Card 2 -> 2 Winners -> 2 Each of [3, 4]
[4 Owned] Card 3 -> 2 Winners -> 4 Each of [4, 5]
[8 Owned] Card 4 -> 1 Winner  -> 8 Each of [5]
[6 Owned] Card 5 -> 0 Winners
[1 Owned] Card 6 -> 0 Winners
```

```
Step 5
---------
[1  Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[2  Owned] Card 2 -> 2 Winners -> 2 Each of [3, 4]
[4  Owned] Card 3 -> 2 Winners -> 4 Each of [4, 5]
[8  Owned] Card 4 -> 1 Winner  -> 8 Each of [5]
[14 Owned] Card 5 -> 0 Winners -> No change
[1  Owned] Card 6 -> 0 Winners
```

```
Step 6
---------
[1  Owned] Card 1 -> 4 Winners -> 1 Each of [2, 3, 4, 5]
[2  Owned] Card 2 -> 2 Winners -> 2 Each of [3, 4]
[4  Owned] Card 3 -> 2 Winners -> 4 Each of [4, 5]
[8  Owned] Card 4 -> 1 Winner  -> 8 Each of [5]
[14 Owned] Card 5 -> 0 Winners -> No change
[1  Owned] Card 6 -> 0 Winners -> No change
```

After the last step we end up with `1` copy of card 1, `2` of card 2, `4` of card 3, `8` of card 4, `14` of card 5, and `1` of card 6, for a grand total of `30` cards.

## Closing Thoughts

The difficulty curve for the puzzles this year has been hard to predict. I guess that's Advent of Code in a nutshell, but the gap in difficulty between days feels particularly chaotic this year. Of course, it's only a matter of time until we face the inevitable dropoff point. Last year there was a fairly sizeable drop in submissions after day 6, followed by a fairly steady decrease each day. Of course, this year's stats have already seen fairly large drops even as early as day 2 so it's hard to say how the rest of the puzzles will pan out.