---
title: "Advent of Code 2023 - Day 7"
date: 2023-12-07T02:00:00-04:00
draft: false
categories:
- blog
tags:
    - advent-of-code
    - aoc2023
---

This one was a lot of fun. Not super complicated, but easy to get tripped up on.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2023/day-7.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

Today's problem is based around a poker-esque card game, with card values `2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A`, where 2 is the lowest and A the highest. Hands consist of 5 cards, as well as a number representing that player's bet.

Hands are ranked according to the following types, from high to low:

* **Five of a kind** - all 5 cards are the same, such as `22222`.
* **Four of a kind** - 4 out of 5 cards are the same, such as `22223`.
* **Full house** - 3 of one card, 2 of another, such as `22233`.
* **Three of a kind** - 3 of one card, 2 other unique cards, such as `22234`.
* **Two pair** - 2 matching pairs of cards, and one other, such as `22334`.
* **One pair** - 1 matching pair of cards, the rest unique, such as `22345`.
* **High card** - All cards unique, such as `23456`.

Ties are broken by the value of the cards themselves, from left to right.

To get our answer, we take the given set of hands, sort them, and multiply each card's rank by their bet (starting with 1 as the lowest card's rank), and summing the values.

The sample input looks like this:

```
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
```

To start, I defined some constants:

```python
CARD_VALUES = [
    '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'
]

HAND_VALUES = [
    'High card', 'One pair', 'Two pair', 'Three of a kind', 'Full house', 'Four of a kind', 'Five of a kind', 'No hand'
]
```

And my class representing hands:

```python
class Hand:
def __init__(self, cards: str, bid: int):
    self.cards = cards
    self.bid = bid

def get_numeric_value(self):
    val = 0

    for card in self.cards:
        val += CARD_VALUES.index(card)
        val *= len(CARD_VALUES) + 1  # val will be a number in base 14

    return val
```

Here you can see my function for determining the value of the cards themselves for tie breaking. I decided to represent the hand's value numerically in base 14 (the number of unique cards + 1), so that each successive card from left to right represents one higher order of magnitude. As a result, breaking a tie between hands simply requires checking which one has the higher numeric value.

And here's my function to determine the type of a hand:

```python
    def get_hand_type(self):
        unique_cards = set(self.cards)

        if len(unique_cards) == 1:
            return 6
        elif len(unique_cards) == 2 and any([self.cards.count(c) == 4 for c in unique_cards]):
            return 5
        elif len(unique_cards) == 2 and any([self.cards.count(c) == 3 for c in unique_cards]):
            return 4
        elif len(unique_cards) == 3 and any([self.cards.count(c) == 3 for c in unique_cards]):
            return 3
        elif len(unique_cards) == 3 and len([c for c in unique_cards if self.cards.count(c) == 2]) == 2:
            return 2
        elif len(unique_cards) == 4:
            return 1
        else:
            return 0
```

I convert the card string into a set, in order to determine how many unique cards are present. Then, it's just a matter of seeing how many cards are unique, as well as the configuration of any repeat cards.

If there's no unique cards, it's a 5 of a kind.

If there's two, it's either a 4 of a kind or a full house.

If there's three, it's either a 3 of a kind or a two pair.

If there's four, it has to be a one pair.

And if there's 5, it can only be a high card.

---

Now, it's time to sort our cards:

```python
def compare_hands(self, left: Hand, right: Hand):
    a_hand = left.get_hand_type()
    b_hand = right.get_hand_type()

    if a_hand > b_hand:
        return -1
    elif b_hand > a_hand:
        return 1
    else:
        return -1 if left.get_numeric_value() > right.get_numeric_value() else 1


self.hands = sorted(self.hands, key=cmp_to_key(self.compare_hands), reverse=True)

return sum([(i + 1) * h.bid for i, h in enumerate(self.hands)])
```

I used `sorted` along with a comparison function to do the job by evaluating pairs of hands.

First, I check if one of the cards has a higher type than the other. Failing that, I'll go for the numeric value.

Our sample input gets sorted like this:

```
32T3K (One pair;        numeric value=560126)  => Rank 1 * bet 765 = 765
KTJJT (Two pair;        numeric value=6249964) => Rank 2 * bet 220 = 440
KK677 (Two pair;        numeric value=6350666) => Rank 3 * bet 28  = 84
T55J5 (Three of a kind; numeric value=4427878) => Rank 4 * bet 684 = 2736
QQQJA (Three of a kind; numeric value=5791772) => Rank 5 * bet 483 = 2415
```

Add them all up, and you get `765 + 440 + 84 + 2736 + 2415 =` **`6440`**.

## Part 2

In part 2, Jokers are now wild, meaning they can be used to represent any other card. The ordering of cards has now changed such that Jokers are at the bottom, so I've updated my calculations accordingly:

```python
CARD_VALUES_P2 = [
    'J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'
]
```

```python
def get_numeric_value(self, is_part_2=False):
    val = 0

    for card in self.cards:
        val += CARD_VALUES_P2.index(card) if is_part_2 else CARD_VALUES.index(card)
        val *= len(CARD_VALUES) + 1  # val will be a number in base 14

    return val
```

I've also added a new function to determine the highest type possible for a given hand with Joker cards:

```python
def get_hand_type_p2(self):
    j_count = self.cards.count('J')
    unique_cards = set([c for c in self.cards if c != 'J'])

    if j_count == 0:
        return self.get_hand_type()
    elif j_count > 3 or len(unique_cards) == 1:
        return 6
    elif j_count == 3:
        return 5
    elif j_count == 2:
        return 5 if len(unique_cards) == 2 else 3
    else:
        if len(unique_cards) == 2:
            return 5 if any([self.cards.count(c) == 3 for c in unique_cards]) else 4
        else:
            return 3 if len(unique_cards) == 3 else 1
```

In addition to the unique card count (excluding Jokers) we're also going to look at the number of Joker cards present.

* If there's zero Joker cards, we'll evaluate this hand as normal.
* If there's 4 or more Joker cards, or if there is only one unique card, we can make all the Joker cards match to make a 5 of a kind (such as `JJJJ2`).
  * Failing that, if there's three Joker cards the best we can do is a 4 of a kind (such as `JJJ23`). (We already determined that there is more than one unique card, meaning that we're looking at three Jokers, and two unique cards).
* If there's 2 Joker cards:
  * ...And 2 unique cards, we can make a 4 of a kind (such as `JJ223`).
  * Otherwise, we can only make a 3 of a kind (such as `JJ234`).
* And if there's only 1 Joker card, there's a few possibilities:
  * If there are 2 unique cards:
    * If one of them is present three times (such as `J2223`), we can make a 4 of a kind.
    * If not, we can only make a full house (such as `J2233`).
  * If there are 3 unique cards, we can make a 3 of a kind (such as `J2234`).
  * Lastly, if there are 4 unique cards, we can only make a high card (such as `J2345`).

And again, we sort and calculate:

```python
self.hands = sorted(self.hands, key=cmp_to_key(self.compare_hands_p2), reverse=True)

return sum([(i + 1) * h.bid for i, h in enumerate(self.hands)])
```

Now our sample input gets sorted like this:

```
32T3K (One pair;       numeric value=1139306) => Rank 1 * bet 765 = 765
KK677 (Two pair;       numeric value=6353620) => Rank 2 * bet 28  = 56
T55J5 (Four of a kind; numeric value=5005112) => Rank 3 * bet 684 = 2052
QQQJA (Four of a kind; numeric value=5790008) => Rank 4 * bet 483 = 1932
KTJJT (Four of a kind; numeric value=6261934) => Rank 5 * bet 220 = 1100
```

Add them all up, and you get `765 + 56 + 2052 + 1932 + 1100 =` **`5905`**.

## Closing Thoughts

This one was an interesting challenge. Nothing too difficult, but a fun puzzle to work out how to do efficiently. I'm kinda proud of the tricks I came up with to make my life easier for this problem, I could have easily seen this one becoming way more complicated than it needed to be.