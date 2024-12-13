---
title: "Advent of Code 2024 - Day 3"
date: 2024-12-07T11:45:18-05:00
draft: true
tags:
- advent-of-code
- devlog
- aoc2024
---

*(Editor's note: I meant to post this a few days ago but it didn't actually go up. Whoops!)*

I've been a bit backlogged on getting to these puzzles due to the new [OldSchool RuneScape Leagues event](/thoughts/unorganized/osrs-leagues-5_1) so I'm going to try and catch up a bit today if I can.

The key to a lot of these puzzles is that they often present themselves as being more complicated and thorny than they really are (except when they're worse actually). Today's was the former.

[Click here](https://github.com/Ratheronfire/advent-of-code/blob/master/year_2024/day-3.py) to see my source code for this day's problem.

***{{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}} If you haven't solved today or any day's puzzle yet yourself, there's bound to be spoilers in these writeups. {{< icon color="yellow" aria-label="Spoiler Warning" >}}fa-exclamation-triangle{{< /icon >}}***

---

## Part 1

To start, we're given a script file, with lots of corrupted function calls strewn about. The goal is to locate all of the non-corrupted ``mul`` functions and process them, by multiplying their arguments, and returning the sum of these functions.

``xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))``

Text before and after the function are ignored. In this case, the valid functions are:

``x``**``mul(2,4)``**``%&mul[3,7]!@^do_not_``**``mul(5,5)``**``+mul(32,64]then(``**``mul(11,8)``**&nbsp;**``mul(8,5)``**``)``

Or, to make them more visible:

* ``mul(2,4)``
* ``mul(5,5)``
* ``mul(11,8)``
* ``mul(8,5)``

Process those functions, sum up their values, and you get ``161``.

I anticipated that ``mull`` wouldn't be the only function we'd need to search for, so I wrote my code to scan for multiple functions and return a list of them.

```python
def get_matching_functions(self, function_names: list[str]) -> list[Function]:
    regex = r"(%s)\((\d+), ?(\d+)?\)" % "|".join(function_names)
    pattern = re.compile(regex)

    matches = pattern.findall(self.program_memory)
    return [Function(m[0], m[1:]) for m in matches]
```

This searches through the script using regex, matching any functions with one of the expected names, valid variables, and opening/closing parentheses. Then, I package them up into this Function class:

```python
class Function:
command: str
variables: list

def __init__(self, command: str, variables: list):
    self.command = command
    self.variables = variables

def run(self):
    if self.command == "mul":
        return functools.reduce(lambda a, b: a*b, [int(v) for v in self.variables])
```

Then, to get my answer, I just get the full set of functions and crunch the numbers.

```python
def get_part_1_answer(self, use_sample=False) -> str:
    functions = self.get_matching_functions(["mul"])
    return str(sum([f.run() for f in functions]))
```

## Part 2

Surprisingly simple complication here: Now, we're looking for the extra functions ``do()`` and ``don't()``. When a ``do()`` is encountered, the following ``mul()`` functions are processed, and if ``don't()`` is encountered, the following ``mul()`` functions are ignored until the next ``do()`` function. (At the start of execution, ``mul()``s are active by default.)

This required a slight rework of my regex logic, since now we need to consider functions which do not have parameters.

```python
def get_matching_functions(self, function_names: list[str]) -> list[Function]:
    regex = r"(%s)\(((\d+), ?(\d+))?\)" % "|".join(function_names)
    pattern = re.compile(regex)

    matches = pattern.findall(self.program_memory)
    return [Function(m[0], m[2:]) for m in matches]
```

This also meant that the sum had to be processed manually.

```python
def get_part_2_answer(self, use_sample=False) -> str:
    functions = self.get_matching_functions(["mul", "do", "don't"])

    sum = 0
    active = True
    for function in functions:
        if function.command == "do":
            active = True
        elif function.command == "don't":
            active = False
        elif function.command == "mul" and active:
            sum += function.run()

    return str(sum)
```

## Closing Thoughts

Some people in the Advent of Code community like to make extra challenges for themselves on top of the existing puzzle, and I feel like today is prime material for that. There's lots of unused functions in the puzzle input that could introduce some fun complications (I could see something like "if you encounter function X, it creates a loop" or something like that). There could also be the possibility of ``mul()`` functions with more than 2 arguments though I suppose that would need different puzzle inputs.
