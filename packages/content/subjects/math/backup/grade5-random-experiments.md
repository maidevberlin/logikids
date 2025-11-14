---
id: grade5-random-experiments
name: Random Experiments
description: Data and probability
grade: 5
ages:
  - 10
  - 11
focus: Data and probability
difficulty: medium
learning_objectives:
  - 'Outcome, event, sample space'
  - Probability as relative frequency
  - Laplace experiments
prerequisites:
  - grade-4-probability
example_tasks:
  - 'Roll dice: P(even number) = ?'
real_world_context: Understanding probability helps predict weather, make fair games, assess risks, and understand chances in sports and daily life.
---

# Random Experiments and Probability

Generate a probability problem appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level.

## Problem Variations

### 1. Identifying Sample Space
List all possible outcomes (sample space) for the following experiment:

**Experiments:**
- Easy: Tossing a coin, rolling a standard die
- Medium: Spinning a spinner with {{n}} equal sections labeled {{labels}}
- Hard: Drawing a card from {{n}} cards numbered {{range}}, tossing two coins

**Format:** $S = \{...\}$

### 2. Calculating Simple Probabilities
A standard die is rolled. What is the probability of rolling:

a) A {{number}}?
b) An even number?
c) A number greater than {{threshold}}?
d) A number less than or equal to {{threshold}}?

**Express as:** $P(\text{event}) = \frac{\text{favorable outcomes}}{\text{total outcomes}}$

### 3. Spinner Probability
A spinner has {{n}} equal sections: {{description}}.

**Questions:**
- What is $P(\text{{{color}}})$?
- What is $P(\text{not {{color}}})$?
- Which color is most likely to be spun?
- Are all outcomes equally likely?

**Example spinners:**
- Easy: 4 sections (red, blue, green, yellow)
- Medium: 8 sections (3 red, 2 blue, 2 green, 1 yellow)
- Hard: 10 sections with varying colors

### 4. Coin Toss Experiments
If you toss {{n}} fair coins, what is the probability of getting:

**Single coin:**
- $P(\text{heads})$
- $P(\text{tails})$

**Two coins:**
- $P(\text{two heads})$
- $P(\text{one head and one tail})$
- $P(\text{at least one head})$

**Sample space for two coins:** $S = \{HH, HT, TH, TT\}$

### 5. Card Drawing Probability
A box contains {{total}} cards numbered from {{start}} to {{end}}.

**Questions:**
- What is $P(\text{drawing card number {{num}}})$?
- What is $P(\text{drawing an even number})$?
- What is $P(\text{drawing a number divisible by {{divisor}}})$?
- What is $P(\text{drawing a prime number})$?

**Example sets:**
- Easy: 10 cards (1-10)
- Medium: 20 cards (1-20)
- Hard: 30 cards (1-30)

### 6. Relative Frequency vs. Theoretical Probability
A coin was tossed 50 times with these results:
- Heads: {{heads}} times
- Tails: {{tails}} times

**Questions:**
a) What is the relative frequency of heads?
b) What is the theoretical probability of heads?
c) Explain any difference between the two.

**Example results:**
- Easy: 26 heads, 24 tails (close to theory)
- Medium: 30 heads, 20 tails (some deviation)
- Hard: 35 heads, 15 tails (larger deviation)

### 7. Multiple Event Probability
A bag contains {{red}} red marbles, {{blue}} blue marbles, and {{green}} green marbles.

**Questions:**
- What is $P(\text{red})$?
- What is $P(\text{blue})$?
- What is $P(\text{green})$?
- What is $P(\text{not red})$?
- Which color are you most likely to draw?

**Show as table:**
| Color | Count | Probability |
|-------|-------|-------------|
| Red | {{red}} | ? |
| Blue | {{blue}} | ? |
| Green | {{green}} | ? |

**Example distributions:**
- Easy: 5 red, 3 blue, 2 green
- Medium: 8 red, 7 blue, 5 green
- Hard: 12 red, 9 blue, 9 blue

### 8. Favorable vs. Unfavorable Outcomes
You roll a standard die. Let event $A$ = "rolling a number greater than {{threshold}}".

**Questions:**
a) List all favorable outcomes for event $A$.
b) List all unfavorable outcomes for event $A$.
c) Calculate $P(A)$.
d) Calculate $P(\text{not } A)$.
e) Verify that $P(A) + P(\text{not } A) = 1$.

**Thresholds:**
- Easy: greater than 4
- Medium: greater than 2
- Hard: greater than or equal to 3

## Solution Requirements

Provide:
1. **Clear identification** of sample space
2. **Step-by-step calculation** showing favorable/total outcomes
3. **Probability expressed** as both fraction and decimal (when appropriate)
4. **Explanation** of probability concepts used
5. For relative frequency: comparison with theoretical probability
