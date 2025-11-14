---
id: normal-distribution
name: Normal Distribution
description: Statistics and probability
grade: 11
ages:
  - 16
  - 17
focus: Statistics and probability
difficulty: hard
learning_objectives:
  - Normal distribution properties
  - Standard normal distribution (z-scores)
  - Using normal distribution tables
  - Empirical rule (68-95-99.7 rule)
  - Applications to real-world data
prerequisites:
  - probability-distributions
  - descriptive-statistics
example_tasks:
  - 'If X ~ N(100, 15), find P(X > 115)'
  - 'Convert X=85 to z-score given μ=70, σ=10'
  - 'Heights are N(170, 8). Find percentage above 180 cm'
real_world_context: Normal distribution models human heights, test scores, measurement errors, natural phenomena, quality control, and appears throughout statistics due to the Central Limit Theorem.
---

# Normal Distribution

Generate normal distribution problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on z-scores, probability calculations, and real-world applications.

## Problem Variations

### 1. Properties of Normal Distribution
Understand characteristics of normal distributions.

**Key properties:**
1. Bell-shaped, symmetric curve
2. Mean = Median = Mode (at center)
3. Total area under curve = 1 (100%)
4. Notation: $X \sim N(\mu, \sigma)$
   - $\mu$ = mean (center)
   - $\sigma$ = standard deviation (spread)

**Empirical Rule (68-95-99.7 Rule):**
- Approximately 68% of data within $\mu \pm \sigma$
- Approximately 95% of data within $\mu \pm 2\sigma$
- Approximately 99.7% of data within $\mu \pm 3\sigma$

**Examples:**
- Easy: Applying empirical rule
  - IQ scores: $N(100, 15)$
  - What percentage of people have IQ between 85 and 115?
  - Answer: $\mu \pm \sigma = 100 \pm 15 = [85, 115]$ → approximately 68%

- Medium: Using empirical rule for ranges
  - Heights of adult males: $N(175, 7)$ cm
  - Find percentage of men between:
    a) 168 cm and 182 cm (within 1σ)
    b) 161 cm and 189 cm (within 2σ)
    c) 154 cm and 196 cm (within 3σ)

- Hard: Interpreting different normal distributions
  - Compare two distributions:
    - $X_1 \sim N(50, 5)$
    - $X_2 \sim N(50, 10)$
  - Both have same mean, different standard deviations
  - Sketch both curves
  - Which is more spread out? Why?

### 2. Calculating Z-Scores
Convert raw scores to standardized scores.

**Z-score formula:**
$$z = \frac{x - \mu}{\sigma}$$

**Interpretation:** Number of standard deviations from the mean
- Positive z: above mean
- Negative z: below mean
- z = 0: at the mean

**Examples:**
- Easy: Basic z-score calculation
  - Test scores: $\mu = 75$, $\sigma = 8$
  - Your score: 83
  - Calculate z-score: $z = \frac{83-75}{8} = \frac{8}{8} = 1$
  - **Interpretation:** You scored 1 standard deviation above the mean

- Medium: Multiple z-scores
  - Dataset: $\mu = 100$, $\sigma = 15$
  - Calculate z-scores for:
    a) $x = 115$
    b) $x = 85$
    c) $x = 130$
    d) $x = 70$
  - Which scores are more unusual?

- Hard: Finding raw score from z-score
  - SAT scores: $N(1050, 200)$
  - Student scored at $z = 1.5$
  - Find actual SAT score
  - Rearrange: $x = \mu + z\sigma = 1050 + 1.5(200) = 1350$

### 3. Standard Normal Distribution
Work with the standard normal $N(0,1)$.

**Standard normal:**
- Mean: $\mu = 0$
- Standard deviation: $\sigma = 1$
- Notation: $Z \sim N(0,1)$

**Converting any normal to standard normal:**
$$Z = \frac{X - \mu}{\sigma}$$

**Examples:**
- Easy: Using z-table
  - Find $P(Z < 1.5)$
  - Look up in z-table: 0.9332
  - **Interpretation:** 93.32% of data falls below z=1.5

- Medium: Between two z-values
  - Find $P(-1 < Z < 2)$
  - $P(Z < 2) = 0.9772$
  - $P(Z < -1) = 0.1587$
  - $P(-1 < Z < 2) = 0.9772 - 0.1587 = 0.8185$

- Hard: Finding z-value from probability
  - Find $z$ such that $P(Z < z) = 0.90$
  - Use inverse z-table (or z-table backwards)
  - Answer: $z \approx 1.28$

**Common z-values:**
| Percentile | z-score |
|------------|---------|
| 90th | 1.28 |
| 95th | 1.645 |
| 97.5th | 1.96 |
| 99th | 2.33 |
| 99.5th | 2.58 |

### 4. Finding Probabilities from Normal Distribution
Calculate probabilities for normally distributed variables.

**Steps:**
1. Convert to z-score: $z = \frac{x - \mu}{\sigma}$
2. Look up probability in z-table
3. Adjust for type of probability (less than, greater than, between)

**Examples:**
- Easy: Probability less than a value
  - Heights: $N(170, 8)$ cm
  - Find $P(X < 180)$
  - $z = \frac{180-170}{8} = 1.25$
  - $P(Z < 1.25) = 0.8944$
  - **Answer:** 89.44% of people are shorter than 180 cm

- Medium: Probability greater than a value
  - Test scores: $N(500, 100)$
  - Find $P(X > 650)$
  - $z = \frac{650-500}{100} = 1.5$
  - $P(Z > 1.5) = 1 - P(Z < 1.5) = 1 - 0.9332 = 0.0668$
  - **Answer:** 6.68% score above 650

- Hard: Probability between two values
  - Weights: $N(70, 10)$ kg
  - Find $P(65 < X < 80)$
  - $z_1 = \frac{65-70}{10} = -0.5$, $P(Z < -0.5) = 0.3085$
  - $z_2 = \frac{80-70}{10} = 1.0$, $P(Z < 1.0) = 0.8413$
  - $P(65 < X < 80) = 0.8413 - 0.3085 = 0.5328$
  - **Answer:** 53.28% weigh between 65 and 80 kg

### 5. Finding Values from Probabilities
Reverse problem: given probability, find the value.

**Examples:**
- Easy: Top percentage
  - Test scores: $N(75, 10)$
  - Find score that represents top 10% (90th percentile)
  - $P(Z < z) = 0.90$ → $z \approx 1.28$
  - $x = \mu + z\sigma = 75 + 1.28(10) = 87.8$
  - **Answer:** Score above 87.8 is in top 10%

- Medium: Middle range
  - SAT scores: $N(1050, 200)$
  - Find range containing middle 95% of scores
  - Middle 95% leaves 2.5% in each tail
  - $P(Z < z) = 0.025$ → $z = -1.96$
  - $P(Z < z) = 0.975$ → $z = 1.96$
  - $x_1 = 1050 + (-1.96)(200) = 658$
  - $x_2 = 1050 + (1.96)(200) = 1442$
  - **Answer:** Middle 95%: between 658 and 1442

- Hard: Symmetric intervals
  - Manufacturing: Target diameter $N(5.0, 0.2)$ cm
  - Find range such that 99% of products fall within
  - Middle 99% leaves 0.5% in each tail
  - $z = \pm 2.58$
  - Range: $5.0 \pm 2.58(0.2) = 5.0 \pm 0.516 = [4.484, 5.516]$ cm

### 6. Real-World Applications - Test Scores
Apply normal distribution to standardized tests.

**Examples:**
- Easy: SAT scores
  - SAT: $N(1050, 200)$
  - You scored 1250
  - a) What's your z-score?
  - b) What percentage scored below you?
  - c) What percentage scored above you?

- Medium: Comparing scores on different tests
  - SAT: $N(1050, 200)$, you scored 1250
  - ACT: $N(21, 5)$, you scored 28
  - Which performance is better relative to other test-takers?
  - Compare z-scores

- Hard: Cutoff scores
  - College admits top 25% of applicants based on exam
  - Exam scores: $N(450, 80)$
  - What's minimum score needed for admission?
  - Find 75th percentile

### 7. Real-World Applications - Physical Measurements
Apply to heights, weights, and other measurements.

**Examples:**
- Easy: Height requirements
  - Adult male heights: $N(175, 7)$ cm
  - Amusement park ride requires height > 180 cm
  - What percentage of men can ride?
  - Calculate $P(X > 180)$

- Medium: Manufacturing tolerances
  - Bolts: Target length 10 cm, $N(10, 0.15)$ cm
  - Acceptable range: 9.7 to 10.3 cm
  - What percentage of bolts are acceptable?
  - What percentage are too short? Too long?

- Hard: Quality control decisions
  - Machine fills bottles, target 500 ml, $N(500, 5)$ ml
  - Company rejects bottles < 490 ml or > 510 ml
  - a) What percentage are rejected?
  - b) If 10,000 bottles filled daily, how many rejected?
  - c) Machine can be adjusted to reduce σ. What σ would reduce rejection to 1%?

### 8. Normal Approximation and Central Limit Theorem
Understand when normal distribution approximates other distributions.

**Normal approximation to binomial:**
When $n$ is large and $p$ is not too extreme, $X \sim \text{Binomial}(n,p)$ can be approximated by $N(np, \sqrt{np(1-p)})$

**Rule of thumb:** Use when $np \geq 10$ and $n(1-p) \geq 10$

**Examples:**
- Easy: Coin flips
  - Flip fair coin 100 times
  - Binomial: $n=100$, $p=0.5$
  - Approximate with: $N(50, 5)$
  - Find $P(X > 60)$ using normal approximation

- Medium: Quality control
  - Production: 5% defect rate
  - Sample of 200 items
  - $\mu = np = 200(0.05) = 10$
  - $\sigma = \sqrt{np(1-p)} = \sqrt{200(0.05)(0.95)} = \sqrt{9.5} \approx 3.08$
  - Find probability of more than 15 defects

- Hard: Election polling
  - Poll of 1000 voters
  - True support for candidate: 48%
  - Model as $N(480, \sqrt{1000(0.48)(0.52)}) = N(480, 15.8)$
  - Find probability poll shows majority support (>500)
  - Discuss margin of error

## Solution Requirements

Provide:
1. **Clear identification** of distribution parameters ($\mu$, $\sigma$)
2. **Z-score calculations** shown step-by-step
3. **Probability notation** properly used
4. **Z-table lookups** explicitly shown
5. **LaTeX formatting** for all formulas
6. **Sketches or descriptions** of normal curve with shaded regions
7. **Interpretations** in context of the problem
8. **Proper rounding** (z-scores to 2 decimals, probabilities to 4 decimals)
9. **Percentage conversions** when appropriate
10. **Conclusions** answering the original question
