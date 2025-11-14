---
id: probability-distributions
name: Probability Distributions
description: Statistics and probability
grade: 10
ages:
  - 15
  - 16
focus: Statistics and probability
difficulty: hard
learning_objectives:
  - Discrete probability distributions
  - Expected value and variance
  - Binomial distribution
  - Probability distribution tables
  - Real-world applications of distributions
prerequisites:
  - basic-probability
  - combinatorics
  - descriptive-statistics
example_tasks:
  - 'Find E(X) for a given probability distribution'
  - 'Calculate binomial probability P(X=k) with n=10, p=0.3'
  - 'Create a probability distribution table for rolling two dice'
real_world_context: Probability distributions model insurance risk, quality control outcomes, game theory, investment returns, exam scores, and help make predictions in uncertain situations.
---

# Probability Distributions

Generate probability distribution problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on discrete distributions, expected values, and applications.

## Problem Variations

### 1. Probability Distribution Tables
Create and analyze discrete probability distributions.

**Definition:** A probability distribution shows all possible values of a random variable and their probabilities.

**Requirements:**
1. All probabilities are between 0 and 1: $0 \leq P(X=x) \leq 1$
2. Sum of all probabilities equals 1: $\sum P(X=x) = 1$

**Examples:**
- Easy: Simple distribution
  - A game spinner has outcomes: Win $10 (p=0.2), Win $5 (p=0.3), Win $0 (p=0.5)
  - Create probability distribution table:

  | $x$ (outcome) | 0 | 5 | 10 |
  |---------------|---|---|----|
  | $P(X=x)$ | 0.5 | 0.3 | 0.2 |

  - Verify: $0.5 + 0.3 + 0.2 = 1$ ✓

- Medium: Rolling two dice - sum distribution
  - Create distribution for sum of two dice

  | Sum $(x)$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  |-----------|---|---|---|---|---|---|---|---|----|----|---|
  | Ways | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |
  | $P(X=x)$ | $\frac{1}{36}$ | $\frac{2}{36}$ | $\frac{3}{36}$ | $\frac{4}{36}$ | $\frac{5}{36}$ | $\frac{6}{36}$ | $\frac{5}{36}$ | $\frac{4}{36}$ | $\frac{3}{36}$ | $\frac{2}{36}$ | $\frac{1}{36}$ |

- Hard: Missing probabilities
  - Given partial distribution:

  | $x$ | 1 | 2 | 3 | 4 | 5 |
  |-----|---|---|---|---|---|
  | $P(X=x)$ | 0.15 | $a$ | 0.25 | $2a$ | 0.10 |

  - Find value of $a$ such that this is valid probability distribution
  - Answer: $0.15 + a + 0.25 + 2a + 0.10 = 1$, so $3a = 0.50$, thus $a = \frac{1}{6}$

### 2. Expected Value (Mean)
Calculate the expected value of a random variable.

**Expected value formula:**
$$E(X) = \mu = \sum x \cdot P(X=x)$$

**Interpretation:** The long-run average value if the experiment is repeated many times.

**Examples:**
- Easy: Game with monetary outcomes
  - Distribution:

  | Outcome | -$2 | -$1 | $0 | $3 | $5 |
  |---------|-----|-----|----|----|---|
  | Probability | 0.2 | 0.3 | 0.2 | 0.2 | 0.1 |

  - Calculate: $E(X) = (-2)(0.2) + (-1)(0.3) + (0)(0.2) + (3)(0.2) + (5)(0.1)$
  - $E(X) = -0.4 - 0.3 + 0 + 0.6 + 0.5 = 0.4$
  - **Interpretation:** On average, you gain $0.40 per game

- Medium: Number of heads in 3 coin flips
  - Distribution for number of heads:

  | $x$ (heads) | 0 | 1 | 2 | 3 |
  |-------------|---|---|---|---|
  | $P(X=x)$ | $\frac{1}{8}$ | $\frac{3}{8}$ | $\frac{3}{8}$ | $\frac{1}{8}$ |

  - Calculate $E(X)$
  - Answer: $E(X) = 0 \cdot \frac{1}{8} + 1 \cdot \frac{3}{8} + 2 \cdot \frac{3}{8} + 3 \cdot \frac{1}{8} = \frac{12}{8} = 1.5$

- Hard: Insurance expected value
  - Insurance company sells policies for $150
  - Payout scenarios:
    - 95% chance: No claim ($0 payout)
    - 4% chance: Minor claim ($1,000 payout)
    - 1% chance: Major claim ($10,000 payout)
  - Calculate expected payout per policy
  - Calculate expected profit per policy
  - Answer: $E(\text{payout}) = 0(0.95) + 1000(0.04) + 10000(0.01) = 140$
  - Expected profit: $150 - 140 = 10$ per policy

### 3. Variance and Standard Deviation
Measure the spread of a probability distribution.

**Variance formula:**
$$\text{Var}(X) = \sigma^2 = \sum (x - \mu)^2 \cdot P(X=x) = E(X^2) - [E(X)]^2$$

**Standard deviation:**
$$\sigma = \sqrt{\text{Var}(X)}$$

**Examples:**
- Easy: Simple distribution
  - Given:

  | $x$ | 0 | 1 | 2 |
  |-----|---|---|---|
  | $P(X=x)$ | 0.5 | 0.3 | 0.2 |

  - Find $E(X)$, $\text{Var}(X)$, and $\sigma$
  - $E(X) = 0(0.5) + 1(0.3) + 2(0.2) = 0.7$
  - $E(X^2) = 0^2(0.5) + 1^2(0.3) + 2^2(0.2) = 0 + 0.3 + 0.8 = 1.1$
  - $\text{Var}(X) = 1.1 - (0.7)^2 = 1.1 - 0.49 = 0.61$
  - $\sigma = \sqrt{0.61} \approx 0.781$

- Medium: Comparing two games
  - Game A and Game B have different distributions
  - Both have same expected value but different variances
  - Compare risk levels using standard deviation
  - Which game is "safer" (less variable)?

- Hard: Properties of variance
  - If $Y = aX + b$, show that:
    - $E(Y) = aE(X) + b$
    - $\text{Var}(Y) = a^2\text{Var}(X)$
  - Apply to real scenario (e.g., converting dollars to euros)

### 4. Binomial Distribution - Basic
Introduction to binomial probability.

**Binomial experiment requirements:**
1. Fixed number of trials ($n$)
2. Each trial has two outcomes (success/failure)
3. Probability of success ($p$) is constant
4. Trials are independent

**Binomial probability formula:**
$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$$

**Examples:**
- Easy: Coin flips
  - Flip a fair coin 5 times
  - $n = 5$, $p = 0.5$ (probability of heads)
  - Find $P(X = 3)$ (exactly 3 heads)
  - $P(X=3) = \binom{5}{3}(0.5)^3(0.5)^2 = 10 \times 0.125 \times 0.25 = 0.3125$

- Medium: Free throw shooting
  - Basketball player makes 70% of free throws
  - Takes 8 shots
  - Find $P(X = 6)$ (makes exactly 6)
  - $P(X=6) = \binom{8}{6}(0.7)^6(0.3)^2 = 28 \times 0.117649 \times 0.09 \approx 0.296$

- Hard: Quality control
  - Machine produces items with 5% defect rate
  - Select 20 items randomly
  - Find:
    a) $P(X = 0)$ (no defects)
    b) $P(X = 1)$ (exactly 1 defect)
    c) $P(X \leq 2)$ (at most 2 defects)

### 5. Binomial Distribution - Expected Value and Variance
Use formulas for binomial mean and variance.

**For binomial distribution:**
$$E(X) = \mu = np$$
$$\text{Var}(X) = \sigma^2 = np(1-p)$$
$$\sigma = \sqrt{np(1-p)}$$

**Examples:**
- Easy: Multiple choice test
  - Test has 20 questions, each with 4 choices
  - If guessing randomly, $p = 0.25$
  - Expected number of correct answers: $E(X) = 20(0.25) = 5$
  - Standard deviation: $\sigma = \sqrt{20(0.25)(0.75)} = \sqrt{3.75} \approx 1.94$

- Medium: Manufacturing process
  - Production line: 2% defect rate
  - Batch of 100 items
  - Expected defects: $E(X) = 100(0.02) = 2$
  - Standard deviation: $\sigma = \sqrt{100(0.02)(0.98)} = \sqrt{1.96} = 1.4$
  - Interpret what this means for quality control

- Hard: Survey responses
  - Survey sent to 500 people, historical response rate 30%
  - $E(X) = ?$
  - $\sigma = ?$
  - Find interval $[\mu - 2\sigma, \mu + 2\sigma]$
  - Interpret: About 95% of time, responses will fall in this range

### 6. Binomial Distribution - Cumulative Probabilities
Calculate probabilities for ranges of values.

**Cumulative probability:**
$$P(X \leq k) = \sum_{i=0}^{k} P(X=i)$$

**Examples:**
- Easy: At least one success
  - Experiment: $n=5$, $p=0.4$
  - Find $P(X \geq 1)$
  - Use complement: $P(X \geq 1) = 1 - P(X = 0)$
  - $P(X=0) = \binom{5}{0}(0.4)^0(0.6)^5 = 0.07776$
  - $P(X \geq 1) = 1 - 0.07776 = 0.92224$

- Medium: Range of values
  - $n = 10$, $p = 0.6$
  - Find $P(4 \leq X \leq 7)$
  - Calculate: $P(X=4) + P(X=5) + P(X=6) + P(X=7)$
  - Show all calculations

- Hard: Using cumulative properties
  - $n = 15$, $p = 0.35$
  - Find $P(X > 8)$ using complement rule
  - Find $P(3 < X < 8)$
  - Compare calculation approaches

### 7. Real-World Binomial Applications
Apply binomial distribution to realistic scenarios.

**Examples:**
- Easy: Weather predictions
  - 40% chance of rain each day
  - Over 7 days, find:
    a) Probability of rain on exactly 3 days
    b) Probability of rain on more than 5 days
    c) Expected number of rainy days

- Medium: Medical treatment
  - New treatment has 85% success rate
  - Administered to 12 patients
  - Find:
    a) Probability all 12 are successful
    b) Probability at least 10 are successful
    c) Expected number of successes
    d) Is this treatment promising?

- Hard: Product testing
  - Company claims 95% of products meet standards
  - Inspector tests 25 units
  - If claim is true:
    a) What's probability fewer than 23 pass?
    b) What's probability all 25 pass?
  - If only 20 pass, does this cast doubt on company's claim? Why?

### 8. Comparing Distributions
Analyze and compare different probability distributions.

**Examples:**
- Easy: Two games comparison
  - Game A: Fixed prizes with given probabilities
  - Game B: Different structure
  - Compare $E(X)$ and $\sigma$ for both
  - Which game has higher expected value?
  - Which has more risk (variability)?

- Medium: Investment options
  - Investment A: Distribution of returns
  - Investment B: Different distribution
  - Calculate expected return and risk for each
  - Discuss trade-off between risk and return

- Hard: Binomial vs. actual distribution
  - Real data from experiment (given in table)
  - Theoretical binomial distribution with estimated $p$
  - Compare observed vs. expected frequencies
  - Test goodness of fit (qualitatively)
  - Does binomial model fit well? Why or why not?

## Solution Requirements

Provide:
1. **Complete probability distribution tables** with all values
2. **Verification** that probabilities sum to 1
3. **Expected value calculations** shown step-by-step
4. **Variance and standard deviation** with interpretations
5. **Binomial formula applications** with all terms shown
6. **LaTeX notation** for all formulas
7. **Practical interpretations** of numerical results
8. **Comparisons** between distributions when relevant
9. **Clear labeling** of all random variables and parameters
