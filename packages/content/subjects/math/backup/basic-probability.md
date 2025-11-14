---
id: basic-probability
name: Basic Probability
description: Statistics and probability
grade: 7
ages:
  - 12
  - 13
focus: Statistics and probability
difficulty: medium
learning_objectives:
  - Probability notation and terminology
  - Classical (theoretical) probability
  - Experimental probability
  - Sample spaces and events
  - Complementary events
  - Independent and dependent events
prerequisites:
  - grade6-deepening-probability
  - grade6-relative-frequency
example_tasks:
  - 'A bag contains 5 red, 3 blue, and 2 green marbles. Find P(red)'
  - 'If P(rain) = 0.35, find P(no rain)'
  - Draw a sample space for rolling two dice and find P(sum = 7)
real_world_context: Probability helps us understand weather forecasts, game strategies, risk assessment, quality control in manufacturing, medical test accuracy, and making informed decisions under uncertainty.
---

# Basic Probability

Generate probability problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on probability concepts, calculations, and real-world applications.

## Problem Variations

### 1. Classical Probability with Simple Events
Calculate probability using equally likely outcomes.

**Formula:**
$$P(E) = \frac{\text{number of favorable outcomes}}{\text{total number of possible outcomes}}$$

**Properties:**
- $0 \leq P(E) \leq 1$ for any event $E$
- $P(\text{certain event}) = 1$
- $P(\text{impossible event}) = 0$

**Examples:**
- Easy: Rolling a die
  - P(rolling a 4) = ?
  - P(rolling an even number) = ?
  - P(rolling a number less than 5) = ?
- Medium: Drawing cards from a standard deck (52 cards)
  - P(drawing a heart) = ?
  - P(drawing a face card) = ?
  - P(drawing a red ace) = ?
- Hard: Selecting from a bag
  - A bag contains {{red}} red, {{blue}} blue, and {{green}} green marbles
  - P(red) = ?
  - P(not blue) = ?
  - P(red or green) = ?

### 2. Sample Spaces
List all possible outcomes and identify favorable outcomes.

**Definition:** The sample space (S) is the set of all possible outcomes of an experiment.

**Examples:**
- Easy: Flipping a coin twice
  - List the sample space: {HH, HT, TH, TT}
  - Find P(exactly one head)
  - Find P(at least one head)
- Medium: Rolling two dice
  - Create a table of all 36 possible outcomes
  - Find P(sum = 7)
  - Find P(sum > 9)
  - Find P(both dice show the same number)
- Hard: Selecting 2 students from a group
  - If there are {{n}} students in a group, how many ways can we select 2?
  - If {{m}} are girls and {{k}} are boys, find P(both selected are girls)

**Sample space table for two dice:**
|   | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | (1,1) | (1,2) | (1,3) | (1,4) | (1,5) | (1,6) |
| 2 | (2,1) | (2,2) | (2,3) | (2,4) | (2,5) | (2,6) |
| 3 | (3,1) | (3,2) | (3,3) | (3,4) | (3,5) | (3,6) |
| 4 | (4,1) | (4,2) | (4,3) | (4,4) | (4,5) | (4,6) |
| 5 | (5,1) | (5,2) | (5,3) | (5,4) | (5,5) | (5,6) |
| 6 | (6,1) | (6,2) | (6,3) | (6,4) | (6,5) | (6,6) |

### 3. Complementary Events
Find the probability of an event NOT occurring.

**Complementary Rule:**
$$P(\overline{E}) = 1 - P(E)$$

Where $\overline{E}$ (read "E complement") is the event that $E$ does NOT occur.

**Examples:**
- Easy: Rolling a die
  - If P(rolling a 6) = $\frac{1}{6}$, find P(not rolling a 6)
  - If P(rolling less than 4) = $\frac{1}{2}$, find P(rolling 4 or more)
- Medium: Drawing cards
  - If P(drawing a spade) = $\frac{1}{4}$, find P(not drawing a spade)
  - If P(drawing a face card) = $\frac{3}{13}$, find P(not drawing a face card)
- Hard: Real-world scenarios
  - Weather forecast says 35% chance of rain. What's P(no rain)?
  - A student has an 85% chance of passing. What's P(not passing)?
  - Quality control: 2% of products are defective. What's P(not defective)?

**When to use complement:**
Sometimes it's easier to calculate P(not E) than P(E) directly, especially for "at least one" problems.

### 4. Theoretical vs. Experimental Probability
Compare theoretical (expected) probability with experimental (observed) probability.

**Theoretical probability:** Based on mathematical analysis
**Experimental probability:** Based on actual experiments

**Formula for experimental probability:**
$$P_{\text{exp}}(E) = \frac{\text{number of times E occurred}}{\text{total number of trials}}$$

**Examples:**
- Easy: Coin flipping
  - Theoretical: P(heads) = 0.5
  - Experiment: Flip a coin {{n}} times, get {{k}} heads
  - Experimental: P(heads) = $\frac{{{k}}}{{{n}}}$
  - Compare and explain any differences
- Medium: Die rolling
  - Theoretical: P(6) = $\frac{1}{6} \approx 0.167$
  - Experiment: Roll 60 times, get 8 sixes
  - Experimental: P(6) = $\frac{8}{60} = \frac{2}{15} \approx 0.133$
  - Why might these differ?
- Hard: Spinner experiment
  - A spinner has sections: 40% red, 35% blue, 25% green
  - After 200 spins: 85 red, 68 blue, 47 green
  - Compare experimental to theoretical probabilities
  - Is the spinner fair?

### 5. Independent Events
Events where one outcome doesn't affect the other.

**Independence Rule:**
$$P(A \text{ and } B) = P(A) \times P(B)$$

**Examples:**
- Easy: Multiple coin flips
  - P(heads on first flip AND heads on second flip) = ?
  - P(three heads in a row) = ?
- Medium: Cards with replacement
  - Draw a card, note it, replace it, draw again
  - P(two aces in a row) = ?
  - P(heart then diamond) = ?
- Hard: Multiple independent events
  - P(passing test 1) = 0.8, P(passing test 2) = 0.75
  - Find P(passing both tests)
  - Find P(passing at least one test)

**Tree diagram for independent events:**
```
First Event    Second Event    Probability
    A              A          P(A) × P(A)
   / \            / \
  /   \          /   \
 A     B        A     B        P(A) × P(B)
                \ /
                 B              P(B) × P(A)
                  \
                   B            P(B) × P(B)
```

### 6. Dependent Events
Events where the first outcome affects the probability of the second.

**Examples:**
- Easy: Drawing without replacement
  - A bag has 3 red and 2 blue marbles
  - First draw: P(red) = $\frac{3}{5}$
  - Second draw (if first was red): P(red) = $\frac{2}{4} = \frac{1}{2}$
  - P(both red) = $\frac{3}{5} \times \frac{2}{4} = \frac{6}{20} = \frac{3}{10}$
- Medium: Cards without replacement
  - P(drawing two aces) = ?
  - First: P(ace) = $\frac{4}{52}$
  - Second: P(ace | first was ace) = $\frac{3}{51}$
  - P(both aces) = $\frac{4}{52} \times \frac{3}{51}$
- Hard: Multiple dependent events
  - A box has {{r}} red, {{b}} blue, and {{g}} green balls
  - Draw 3 balls without replacement
  - Find P(all three are red)

**Key difference:**
- Independent: P(B) doesn't change whether A occurred
- Dependent: P(B) changes depending on whether A occurred

### 7. Mutually Exclusive Events
Events that cannot occur simultaneously.

**Addition Rule for Mutually Exclusive Events:**
$$P(A \text{ or } B) = P(A) + P(B)$$

**Examples:**
- Easy: Rolling a die
  - P(rolling 2 or 5) = P(2) + P(5) = $\frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}$
  - P(even number or 1) = ?
- Medium: Drawing cards
  - P(ace or king) = ?
  - P(spade or heart) = ?
  - Are "spade" and "face card" mutually exclusive? Why or why not?
- Hard: Survey results
  - Survey of {{n}} people: {{a}} prefer A, {{b}} prefer B, {{c}} prefer C
  - P(person prefers A or C) = ?
  - Can someone prefer both A and B?

**Important note:** Events are mutually exclusive if P(A and B) = 0

### 8. Real-World Probability Applications
Apply probability concepts to realistic scenarios.

**Examples:**
- Easy: Games and sports
  - A basketball player makes 70% of free throws. What's the probability she makes the next shot?
  - A board game uses two dice. What's P(moving more than 8 spaces)?
- Medium: Quality control
  - A factory's quality rate is 98% (2% defective)
  - If you select a product at random, P(it's good quality) = ?
  - If you select 2 products, P(both are good) = ?
- Hard: Medical testing
  - A medical test is 95% accurate
  - If 2% of population has the disease:
    - P(person has disease) = 0.02
    - P(positive test | has disease) = 0.95
    - P(negative test | doesn't have disease) = 0.95
  - Analyze different scenarios

## Solution Requirements

Provide:
1. **Clear probability notation** using proper symbols
2. **Sample space identification** when relevant
3. **Step-by-step calculations** showing all work
4. **LaTeX formatting** for fractions and formulas
5. **Tree diagrams** or tables for multi-stage events
6. **Interpretations** explaining what probabilities mean
7. **Distinction between independent and dependent** events
8. **Real-world context** connecting math to applications
