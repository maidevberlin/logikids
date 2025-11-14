---
id: statistical-inference
name: Statistical Inference
description: Statistics and probability
grade: 12
ages:
  - 17
  - 18
focus: Statistics and probability
difficulty: hard
learning_objectives:
  - Confidence intervals for means
  - Hypothesis testing basics
  - Type I and Type II errors
  - P-values and significance levels
  - Sample size considerations
prerequisites:
  - normal-distribution
  - descriptive-statistics
  - probability-distributions
example_tasks:
  - 'Construct 95% confidence interval for μ given sample data'
  - 'Test H₀: μ = 50 vs H₁: μ ≠ 50 at α = 0.05'
  - 'Calculate margin of error for survey with n=400'
real_world_context: Statistical inference is used in medical research, political polling, quality control, scientific experiments, A/B testing, market research, and making decisions based on sample data.
---

# Statistical Inference

Generate statistical inference problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on confidence intervals, hypothesis testing, and drawing conclusions from data.

## Problem Variations

### 1. Point Estimates and Sampling Distributions
Understand sample statistics as estimates of population parameters.

**Key concepts:**
- Population parameter: $\mu$ (mean), $\sigma$ (standard deviation)
- Sample statistic: $\bar{x}$ (sample mean), $s$ (sample standard deviation)
- Sampling distribution: Distribution of sample statistics

**Standard error of the mean:**
$$SE = \frac{\sigma}{\sqrt{n}}$$

**Examples:**
- Easy: Computing sample statistics
  - Sample data: {{data}}
  - Calculate:
    a) Sample mean $\bar{x}$
    b) Sample standard deviation $s$
    c) Sample size $n$

- Medium: Standard error
  - Population: $\sigma = 20$
  - Sample sizes: $n = 25$, $n = 100$, $n = 400$
  - Calculate $SE$ for each
  - How does increasing sample size affect $SE$?

- Hard: Sampling distribution properties
  - Population: $\mu = 100$, $\sigma = 15$
  - Samples of size $n = 36$
  - Describe distribution of $\bar{X}$:
    - Mean: $\mu_{\bar{X}} = \mu = 100$
    - Standard deviation: $\sigma_{\bar{X}} = \frac{\sigma}{\sqrt{n}} = \frac{15}{6} = 2.5$
  - Find $P(\bar{X} > 105)$

### 2. Confidence Intervals - Concept and Interpretation
Understand what confidence intervals mean.

**Confidence interval for mean (σ known):**
$$\bar{x} \pm z^* \cdot \frac{\sigma}{\sqrt{n}}$$

Where $z^*$ is critical value:
- 90% CI: $z^* = 1.645$
- 95% CI: $z^* = 1.96$
- 99% CI: $z^* = 2.576$

**Interpretation:** "We are 95% confident that the true population mean lies between..."

**Examples:**
- Easy: Interpreting given CI
  - A 95% CI for average height is [168, 174] cm
  - Questions:
    a) What's the point estimate (sample mean)?
    b) What's the margin of error?
    c) Can we be certain the true mean is in this interval?
    d) What does "95% confident" mean?

- Medium: Effect of confidence level
  - Same data produces different intervals:
    - 90% CI: [45, 55]
    - 95% CI: [43, 57]
    - 99% CI: [40, 60]
  - Why are intervals different widths?
  - Trade-off between confidence and precision

- Hard: Margin of error
  - Margin of error: $ME = z^* \cdot \frac{\sigma}{\sqrt{n}}$
  - For 95% CI: $ME = 1.96 \cdot \frac{\sigma}{\sqrt{n}}$
  - If $\sigma = 40$ and we want $ME \leq 5$, find required $n$
  - $5 = 1.96 \cdot \frac{40}{\sqrt{n}}$, solve for $n$

### 3. Constructing Confidence Intervals
Calculate confidence intervals from sample data.

**Examples:**
- Easy: 95% CI with known σ
  - Sample: $n = 64$, $\bar{x} = 72$, $\sigma = 16$
  - Construct 95% CI for $\mu$
  - $SE = \frac{16}{\sqrt{64}} = 2$
  - $CI = 72 \pm 1.96(2) = 72 \pm 3.92 = [68.08, 75.92]$

- Medium: Different confidence levels
  - Sample: $n = 100$, $\bar{x} = 85$, $\sigma = 20$
  - Construct:
    a) 90% CI
    b) 95% CI
    c) 99% CI
  - Compare widths

- Hard: Sample size determination
  - Survey planning: Want to estimate mean income
  - Known: $\sigma = \$12,000$
  - Requirements: 95% confidence, margin of error ≤ $\$2,000$
  - Find minimum sample size
  - $n = \left(\frac{z^* \cdot \sigma}{ME}\right)^2 = \left(\frac{1.96 \times 12000}{2000}\right)^2 = (11.76)^2 \approx 139$
  - Need $n \geq 139$ people

**Formula for sample size:**
$$n = \left(\frac{z^* \cdot \sigma}{ME}\right)^2$$

### 4. Hypothesis Testing - Fundamentals
Set up and understand hypothesis tests.

**Null hypothesis ($H_0$):** Status quo, no effect, no difference
**Alternative hypothesis ($H_1$ or $H_a$):** What we're testing for

**Types of tests:**
- Two-tailed: $H_1: \mu \neq \mu_0$
- Right-tailed: $H_1: \mu > \mu_0$
- Left-tailed: $H_1: \mu < \mu_0$

**Significance level ($\alpha$):** Probability of Type I error
- Common: $\alpha = 0.05$ (5% level)

**Examples:**
- Easy: Formulating hypotheses
  - Claim: "Average commute time is more than 30 minutes"
  - Write:
    - $H_0: \mu = 30$
    - $H_1: \mu > 30$ (right-tailed test)

- Medium: Two-tailed test setup
  - Manufacturer claims batteries last 500 hours
  - Test if actual mean differs from claim
  - $H_0: \mu = 500$
  - $H_1: \mu \neq 500$ (two-tailed)
  - $\alpha = 0.05$

- Hard: Multiple scenario setups
  - For each scenario, write $H_0$ and $H_1$:
    a) Drug decreases blood pressure (currently 140)
    b) New teaching method improves test scores (currently 75)
    c) Quality control: Mean should be 10.0 cm
  - Identify as one-tailed or two-tailed

### 5. Test Statistics and P-values
Calculate test statistics and interpret p-values.

**Z-test statistic:**
$$z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$

**P-value:** Probability of observing result this extreme (or more) if $H_0$ is true

**Decision rule:**
- If $p\text{-value} \leq \alpha$: Reject $H_0$ (statistically significant)
- If $p\text{-value} > \alpha$: Fail to reject $H_0$ (not significant)

**Examples:**
- Easy: Calculating z-statistic
  - $H_0: \mu = 50$
  - Sample: $n = 100$, $\bar{x} = 52.5$, $\sigma = 10$
  - Calculate: $z = \frac{52.5 - 50}{10/\sqrt{100}} = \frac{2.5}{1} = 2.5$

- Medium: Finding p-value and making decision
  - Two-tailed test, $\alpha = 0.05$
  - Calculated: $z = 2.5$
  - P-value = $2 \times P(Z > 2.5) = 2 \times 0.0062 = 0.0124$
  - Since $0.0124 < 0.05$, reject $H_0$
  - **Conclusion:** Evidence suggests mean differs from 50

- Hard: Complete hypothesis test
  - Company claims coffee cups hold 350 ml
  - Sample: $n = 50$, $\bar{x} = 345$, $\sigma = 15$
  - Test at $\alpha = 0.05$ level
  - $H_0: \mu = 350$ vs $H_1: \mu \neq 350$
  - Calculate $z$, find $p$-value, make decision, state conclusion

**P-value interpretation:**
| P-value | Evidence against $H_0$ |
|---------|------------------------|
| > 0.10 | Little or no evidence |
| 0.05 - 0.10 | Weak evidence |
| 0.01 - 0.05 | Moderate evidence |
| < 0.01 | Strong evidence |

### 6. Type I and Type II Errors
Understand the two types of errors in hypothesis testing.

**Type I Error ($\alpha$):** Reject $H_0$ when it's actually true (false positive)
**Type II Error ($\beta$):** Fail to reject $H_0$ when it's actually false (false negative)
**Power:** $1 - \beta$ (probability of correctly rejecting false $H_0$)

**Error table:**
|  | $H_0$ True | $H_0$ False |
|---|---|---|
| **Reject $H_0$** | Type I Error ($\alpha$) | Correct decision (Power) |
| **Fail to reject $H_0$** | Correct decision ($1-\alpha$) | Type II Error ($\beta$) |

**Examples:**
- Easy: Identifying error types
  - Medical test for disease
  - Type I: Diagnose healthy person as sick
  - Type II: Diagnose sick person as healthy
  - Which is more serious? Depends on context

- Medium: Consequences of errors
  - Criminal trial: $H_0$: Defendant is innocent
  - Type I: Convict innocent person
  - Type II: Acquit guilty person
  - Which does legal system prioritize avoiding?
  - Relate to "innocent until proven guilty"

- Hard: Controlling error rates
  - Decreasing $\alpha$ (more stringent) increases $\beta$
  - Ways to reduce both:
    a) Increase sample size
    b) Reduce variability
  - Calculate required $n$ to achieve both $\alpha = 0.05$ and $\beta = 0.10$

### 7. Real-World Applications - Quality Control
Apply inference to manufacturing and quality control.

**Examples:**
- Easy: Testing product specifications
  - Bolts should have mean diameter 10 mm
  - Sample: $n = 40$, $\bar{x} = 10.08$ mm, $\sigma = 0.2$ mm
  - Test $H_0: \mu = 10$ vs $H_1: \mu \neq 10$ at $\alpha = 0.05$
  - Is production process on target?

- Medium: Confidence interval for process
  - Machine fills bottles, target 500 ml
  - Sample: $n = 50$, $\bar{x} = 497$ ml, $\sigma = 8$ ml
  - Construct 95% CI
  - Does target value fall in CI?
  - What action should company take?

- Hard: Process improvement
  - Before improvement: $\mu = 85$, $\sigma = 12$
  - After improvement: Sample $n = 64$, $\bar{x} = 88.5$, $\sigma = 12$
  - Test if improvement was effective ($H_1: \mu > 85$)
  - Calculate $z$, $p$-value
  - What's probability of Type II error if true mean is 90?

### 8. Real-World Applications - Research and Polling
Apply inference to surveys and experiments.

**Examples:**
- Easy: Political poll
  - Poll: $n = 400$ voters
  - 55% support candidate (proportion $\hat{p} = 0.55$)
  - Margin of error: $ME = 1.96\sqrt{\frac{0.55(0.45)}{400}} \approx 0.049$ or 4.9%
  - 95% CI: [50.1%, 59.9%]
  - Can we be confident majority supports candidate?

- Medium: Medical study
  - New drug tested: $n = 100$ patients
  - Mean recovery time: $\bar{x} = 8.2$ days, $\sigma = 2.5$ days
  - Historical mean: $\mu_0 = 10$ days
  - Test if drug reduces recovery time
  - $H_0: \mu = 10$ vs $H_1: \mu < 10$

- Hard: Comparing two treatments
  - Treatment A: $n_1 = 80$, $\bar{x}_1 = 145$, $\sigma_1 = 20$
  - Treatment B: $n_2 = 80$, $\bar{x}_2 = 138$, $\sigma_2 = 18$
  - Test if treatments differ significantly
  - Use: $z = \frac{(\bar{x}_1 - \bar{x}_2)}{\sqrt{\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}}}$

## Solution Requirements

Provide:
1. **Clear statement** of hypotheses ($H_0$ and $H_1$)
2. **Significance level** ($\alpha$) identified
3. **Test statistic calculations** shown step-by-step
4. **P-value** calculated and compared to $\alpha$
5. **Decision** clearly stated (reject or fail to reject $H_0$)
6. **Conclusion** in context of the problem
7. **Confidence intervals** with proper interpretation
8. **LaTeX notation** for all formulas
9. **Assumptions** stated (e.g., normality, random sample)
10. **Practical significance** discussed, not just statistical significance
