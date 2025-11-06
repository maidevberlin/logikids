---
id: combinatorics
name: Combinatorics
description: Statistics and probability
grade: 8
ages:
  - 13
  - 14
focus: Statistics and probability
difficulty: hard
learning_objectives:
  - Fundamental counting principle
  - Permutations (with and without repetition)
  - Combinations
  - Factorial notation
  - Applications to probability
prerequisites:
  - grade5-combinatorics
  - basic-probability
example_tasks:
  - 'How many 4-digit PIN codes are possible?'
  - 'How many ways can 5 students be arranged in a row?'
  - 'Choose 3 students from a group of 10. How many ways?'
real_world_context: Combinatorics is used in password security, tournament scheduling, lottery calculations, seating arrangements, team formations, menu planning, and analyzing probability in card games.
---

# Combinatorics

Generate combinatorics problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on counting principles, permutations, combinations, and their applications.

## Problem Variations

### 1. Fundamental Counting Principle
Apply the multiplication principle for multi-stage choices.

**Fundamental Counting Principle:**
If there are $n_1$ ways to make a first choice, $n_2$ ways to make a second choice, and so on, then the total number of ways to make all choices is:
$$n_1 \times n_2 \times n_3 \times \cdots \times n_k$$

**Examples:**
- Easy: Creating outfits
  - You have {{shirts}} shirts, {{pants}} pants, and {{shoes}} pairs of shoes
  - How many different outfits can you create?
  - Answer: ${{shirts}} \times {{pants}} \times {{shoes}}$
- Medium: License plates
  - A license plate has 3 letters followed by 3 digits
  - How many different plates are possible?
  - Answer: $26 \times 26 \times 26 \times 10 \times 10 \times 10 = 17,576,000$
- Hard: PIN codes with restrictions
  - A 4-digit PIN cannot start with 0
  - How many possible PINs are there?
  - Answer: $9 \times 10 \times 10 \times 10 = 9,000$

**Tree diagram for small cases:**
For 2 shirts (Red, Blue) and 3 pants (Jeans, Khaki, Black):
```
Shirt → Pants → Outfit
  R → J → RJ
    → K → RK
    → B → RB
  B → J → BJ
    → K → BK
    → B → BB
Total: 2 × 3 = 6 outfits
```

### 2. Factorial Notation
Understand and calculate factorials.

**Factorial definition:**
$$n! = n \times (n-1) \times (n-2) \times \cdots \times 2 \times 1$$

**Special cases:**
- $0! = 1$ (by definition)
- $1! = 1$

**Examples:**
- Easy: Calculate small factorials
  - $5! = ?$
  - $3! = ?$
  - $7! = ?$
- Medium: Simplify factorial expressions
  - $\frac{8!}{6!} = ?$
  - $\frac{10!}{7! \times 3!} = ?$
  - $\frac{n!}{(n-2)!} = ?$ (algebraically)
- Hard: Factorial equations
  - Solve for $n$: $n! = 120$
  - Solve for $n$: $\frac{n!}{(n-2)!} = 56$
  - Simplify: $\frac{(n+1)!}{(n-1)!}$

**Factorial values:**
| n | n! |
|---|---|
| 0 | 1 |
| 1 | 1 |
| 2 | 2 |
| 3 | 6 |
| 4 | 24 |
| 5 | 120 |
| 6 | 720 |
| 7 | 5,040 |
| 8 | 40,320 |
| 9 | 362,880 |
| 10 | 3,628,800 |

### 3. Permutations Without Repetition
Arrangements where order matters and each item is used once.

**Permutation formula:**
$$P(n,r) = \frac{n!}{(n-r)!}$$

Where $n$ = total items, $r$ = items being arranged

**Special case:** All items arranged: $P(n,n) = n!$

**Examples:**
- Easy: Arranging people in a line
  - In how many ways can {{n}} students be arranged in a row?
  - Answer: ${{n}}! = ?$
- Medium: Partial arrangements
  - From {{n}} books, you want to arrange {{r}} on a shelf
  - How many arrangements are possible?
  - Answer: $P({{n}},{{r}}) = \frac{{{n}}!}{({{n}}-{{r}})!}$
- Hard: Race finishing positions
  - In a race with 12 runners, how many ways can gold, silver, and bronze be awarded?
  - Answer: $P(12,3) = \frac{12!}{9!} = 12 \times 11 \times 10 = 1,320$

**Why order matters:**
ABC, ACB, BAC, BCA, CAB, CBA are all different permutations of {A, B, C}

### 4. Combinations Without Repetition
Selections where order does NOT matter.

**Combination formula:**
$$C(n,r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}$$

Where $n$ = total items, $r$ = items being selected

**Examples:**
- Easy: Selecting team members
  - Choose {{r}} students from a group of {{n}} to form a committee
  - How many different committees are possible?
  - Answer: $C({{n}},{{r}}) = \binom{{{n}}}{{{r}}}$
- Medium: Pizza toppings
  - A pizzeria offers 10 toppings. You can choose any 3.
  - How many different 3-topping pizzas can you create?
  - Answer: $C(10,3) = \frac{10!}{3!7!} = \frac{10 \times 9 \times 8}{3 \times 2 \times 1} = 120$
- Hard: Handshakes at a party
  - At a party with {{n}} people, everyone shakes hands once with everyone else
  - How many handshakes occur?
  - Answer: $C({{n}},2) = \frac{{{n}}({{n}}-1)}{2}$

**Comparing with permutations:**
- Permutations: ABC ≠ BAC (different)
- Combinations: {A,B,C} = {B,A,C} (same)

### 5. Permutations vs. Combinations
Distinguish when order matters and when it doesn't.

**Decision flowchart:**
1. Does order matter?
   - YES → Permutation
   - NO → Combination

**Examples:**
- Easy: Classification problems
  - Choosing class president, VP, and secretary from 10 candidates
    - Order matters (different positions) → Permutation: $P(10,3)$
  - Choosing 3 students from 10 to form a study group
    - Order doesn't matter → Combination: $C(10,3)$
- Medium: Mixed problems
  - From 8 books, select 3 for a reading list (order matters)
  - From 8 books, select 3 to pack for vacation (order doesn't matter)
  - Calculate both and compare
- Hard: Real-world scenarios
  - Tournament bracket: 16 teams, how many possible semifinal matchups?
  - Password: 5 characters from 26 letters, no repeats allowed
  - Lottery: Choose 6 numbers from 49, order doesn't matter

### 6. Permutations with Repetition Allowed
Arrangements where items can be reused.

**Formula:**
$$n^r$$

Where $n$ = number of choices for each position, $r$ = number of positions

**Examples:**
- Easy: PIN codes
  - A 4-digit PIN using digits 0-9 (repetition allowed)
  - Answer: $10^4 = 10,000$ possible PINs
- Medium: Computer passwords
  - A password has 8 characters (26 letters, case-sensitive, plus 10 digits)
  - How many possible passwords? (Assume repetition allowed)
  - Answer: $62^8 \approx 2.18 \times 10^{14}$
- Hard: License plates with formats
  - Format: 3 letters (A-Z) followed by 4 digits (0-9)
  - All repetitions allowed
  - Answer: $26^3 \times 10^4 = 17,576 \times 10,000 = 175,760,000$

**Comparison table:**
| Scenario | Formula | Example (n=5, r=3) |
|----------|---------|-------------------|
| Permutation (no repeat) | $\frac{n!}{(n-r)!}$ | $P(5,3) = 60$ |
| With repetition | $n^r$ | $5^3 = 125$ |
| Combination (no repeat) | $\frac{n!}{r!(n-r)!}$ | $C(5,3) = 10$ |

### 7. Permutations with Identical Objects
Arrangements where some items are indistinguishable.

**Formula:**
$$\frac{n!}{n_1! \times n_2! \times \cdots \times n_k!}$$

Where $n$ = total objects, $n_1, n_2, \ldots, n_k$ = counts of each identical type

**Examples:**
- Easy: Arranging letters
  - How many distinct arrangements of the letters in "BOOK"?
  - Total: 4 letters, but 2 O's are identical
  - Answer: $\frac{4!}{2!} = \frac{24}{2} = 12$
- Medium: Arranging letters with multiple repeats
  - How many distinct arrangements of "MISSISSIPPI"?
  - Total: 11 letters (1-M, 4-I, 4-S, 2-P)
  - Answer: $\frac{11!}{1! \times 4! \times 4! \times 2!} = \frac{39,916,800}{1 \times 24 \times 24 \times 2} = 34,650$
- Hard: Arranging colored balls
  - You have {{r}} red, {{b}} blue, and {{g}} green balls
  - How many ways can you arrange them in a row?
  - Answer: $\frac{({{r}}+{{b}}+{{g}})!}{{{r}}! \times {{b}}! \times {{g}}!}$

### 8. Combinatorics and Probability
Apply counting principles to calculate probabilities.

**Probability using combinatorics:**
$$P(E) = \frac{\text{number of favorable outcomes}}{\text{total number of outcomes}}$$

**Examples:**
- Easy: Card probabilities
  - From a standard deck, draw 5 cards
  - Total possible hands: $C(52,5)$
  - Hands with all hearts: $C(13,5)$
  - P(all hearts) = $\frac{C(13,5)}{C(52,5)}$
- Medium: Committee probabilities
  - Choose 4 people from 6 men and 5 women
  - P(committee has 2 men and 2 women) = $\frac{C(6,2) \times C(5,2)}{C(11,4)}$
- Hard: Lottery probabilities
  - Lottery: Choose 6 numbers from 1-49
  - Total outcomes: $C(49,6) = 13,983,816$
  - P(winning) = $\frac{1}{13,983,816}$
  - P(matching exactly 3 numbers) = $\frac{C(6,3) \times C(43,3)}{C(49,6)}$

**General strategy:**
1. Identify total number of outcomes (denominator)
2. Count favorable outcomes (numerator)
3. Apply probability formula

## Solution Requirements

Provide:
1. **Clear identification** of whether order matters
2. **Proper notation** ($P(n,r)$, $C(n,r)$, or $\binom{n}{r}$)
3. **Factorial calculations** shown step-by-step
4. **LaTeX formatting** for all formulas
5. **Simplification** of factorial expressions when possible
6. **Explanations** of why permutation or combination is appropriate
7. **Final answers** clearly stated
8. **Units or context** included in answers when relevant
