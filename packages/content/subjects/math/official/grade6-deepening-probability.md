---
id: grade6-deepening-probability
name: Deepening Probability
description: Data and probability
grade: 6
ages:
  - 11
  - 12
focus: Data and probability
difficulty: medium
learning_objectives:
  - Probabilities in Laplace experiments
  - Tree diagrams for multi-stage experiments
  - Path rules (basics)
  - Complementary event
prerequisites:
  - grade-5-random-experiments
example_tasks:
  - 'Roll twice: P(both times 6) = ?'
  - Draw a tree diagram
real_world_context: Probability helps us understand chances in games, weather forecasts, sports outcomes, and making informed decisions in uncertain situations.
---

# Deepening Probability and Multi-Stage Experiments

You will create tasks about probability calculations, tree diagrams for multi-stage experiments, complementary events, and applying probability concepts to real-world situations. Use LaTeX for probability notation and clear visual tree diagrams.

## Problem Variations

### 1. Basic Probability in Laplace Experiments
Students calculate probabilities where all outcomes are equally likely using $P(E) = \frac{\text{favorable outcomes}}{\text{total outcomes}}$.

**Examples:**
- A fair die is rolled. What is the probability of rolling a ${{number}}$?
- A bag contains ${{red}}$ red balls, ${{blue}}$ blue balls, and ${{green}}$ green balls. What is the probability of drawing a red ball?
- A spinner has ${{sections}}$ equal sections numbered $1$ to ${{sections}}$. What is $P(\text{even number})$?
- A card is drawn from a standard deck of $52$ cards. What is the probability of drawing an ace?

**Formula:**
$$P(E) = \frac{\text{number of favorable outcomes}}{\text{total number of outcomes}}$$

**Example:**
Rolling a 3 on a fair die: $P(3) = \frac{1}{6}$

### 2. Complementary Events
Students find the probability of an event NOT occurring: $P(\overline{E}) = 1 - P(E)$.

**Examples:**
- A die is rolled. What is the probability of NOT rolling a $6$?
- The probability of rain tomorrow is ${{probability}}$. What is the probability of no rain?
- If $P(\text{winning}) = \frac{{{num}}}{{{den}}}$, what is $P(\text{not winning})$?
- A bag has ${{red}}$ red balls and ${{blue}}$ blue balls. What is the probability of NOT drawing a red ball?

**Formula:**
$$P(\overline{E}) = 1 - P(E)$$

**Example:**
If $P(\text{rolling a 6}) = \frac{1}{6}$, then:
$$P(\text{not rolling a 6}) = 1 - \frac{1}{6} = \frac{5}{6}$$

### 3. Two-Stage Experiments with Tree Diagrams
Students draw tree diagrams to visualize all possible outcomes in two-stage experiments.

**Examples:**
- A coin is flipped twice. Draw a tree diagram showing all possible outcomes.
- A die is rolled twice. Create a tree diagram for rolling a $3$ on the first roll.
- Two cards are drawn from a deck (with replacement). Draw a tree diagram for drawing two aces.
- A spinner with colors red, blue, and green is spun twice. Draw the tree diagram.

**Example tree diagram (coin flipped twice):**

```
         H (1/2)
       /         \
    H (1/2)     T (1/2)
   /    \       /    \
  H      T     H      T
(1/4)  (1/4)  (1/4)  (1/4)

Outcomes: HH, HT, TH, TT
```

**LaTeX representation:**
First flip → Second flip → Outcome:
- H → H → HH with $P = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$
- H → T → HT with $P = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$
- T → H → TH with $P = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$
- T → T → TT with $P = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$

### 4. Multiplication Rule (Path Rule)
Students multiply probabilities along branches of a tree diagram to find the probability of a specific sequence.

**Examples:**
- A die is rolled twice. What is the probability of rolling a $6$ both times?
- Two coins are flipped. What is $P(\text{two heads})$?
- A bag has $3$ red and $2$ blue balls. A ball is drawn, replaced, and drawn again. What is $P(\text{two red balls})$?
- A spinner shows red ($\frac{1}{3}$), blue ($\frac{1}{3}$), and green ($\frac{1}{3}$). It's spun twice. What is $P(\text{red then blue})$?

**Multiplication Rule:**
$$P(\text{A and then B}) = P(A) \times P(B)$$

**Example:**
Rolling two 6's: $P(6 \text{ then } 6) = \frac{1}{6} \times \frac{1}{6} = \frac{1}{36}$

### 5. Addition Rule for Mutually Exclusive Events
Students find probabilities of "either A or B" happening when events cannot occur simultaneously.

**Examples:**
- A die is rolled. What is the probability of rolling either a $3$ or a $5$?
- A card is drawn. What is $P(\text{ace or king})$?
- Two coins are flipped. What is $P(\text{exactly one head})$? (HT or TH)
- A spinner has equal sections: red, blue, green, yellow. What is $P(\text{red or blue})$?

**Addition Rule (for mutually exclusive events):**
$$P(\text{A or B}) = P(A) + P(B)$$

**Example:**
$P(\text{rolling 3 or 5}) = P(3) + P(5) = \frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}$

### 6. Counting Favorable Outcomes in Two-Stage Experiments
Students count how many outcomes satisfy a condition and calculate probability.

**Examples:**
- A die is rolled twice. How many outcomes result in a sum of ${{targetSum}}$? What is the probability?
- Two coins are flipped. What is the probability of getting at least one head?
- A die is rolled twice. What is the probability that the sum is greater than ${{threshold}}$?
- Two spinners (numbered $1-4$) are spun. What is $P(\text{both show even numbers})$?

**Strategy:**
1. List all possible outcomes (often using a table or tree diagram)
2. Count favorable outcomes
3. Calculate $P = \frac{\text{favorable}}{\text{total}}$

**Example - Sum of 7 with two dice:**
| Die 1 | Die 2 | Sum |
|-------|-------|-----|
| 1 | 6 | 7 |
| 2 | 5 | 7 |
| 3 | 4 | 7 |
| 4 | 3 | 7 |
| 5 | 2 | 7 |
| 6 | 1 | 7 |

$P(\text{sum} = 7) = \frac{6}{36} = \frac{1}{6}$

### 7. Probability Tables for Two-Stage Experiments
Students create tables showing all outcomes and their probabilities.

**Examples:**
- Create a table showing all possible sums when rolling two dice.
- A coin and a die are used together. Make a table of all outcomes.
- Two spinners (one with 2 sections, one with 3 sections) are spun. Create an outcome table.

**Example table - Two dice sums:**
|   | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| 6 | 7 | 8 | 9 | 10 | 11 | 12 |

### 8. Real-World Probability Applications
Students apply probability concepts to practical scenarios.

**Examples:**
- In a class of ${{total}}$ students, ${{girls}}$ are girls and ${{boys}}$ are boys. If the teacher randomly selects a student, what is $P(\text{selecting a girl})$?
- A weather forecast says there's a ${{percentage}}\%$ chance of rain. What is the probability it will NOT rain?
- A multiple-choice test has ${{questions}}$ questions, each with ${{choices}}$ answer choices. If you guess randomly on one question, what is the probability of getting it right?
- A lottery has ${{tickets}}$ tickets sold. You bought ${{yourTickets}}$ tickets. What is your probability of winning?

**Interpretation:** Probabilities can be expressed as fractions, decimals, or percentages:
$$P = \frac{1}{4} = 0.25 = 25\%$$
