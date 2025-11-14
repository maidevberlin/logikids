---
id: correlation-and-regression
name: Correlation and Regression
description: Statistics and probability
grade: 12
ages:
  - 17
  - 18
focus: Statistics and probability
difficulty: hard
learning_objectives:
  - Scatter plots and correlation
  - Pearson correlation coefficient
  - Linear regression equations
  - Least squares method
  - Making predictions
  - Residuals and goodness of fit
prerequisites:
  - descriptive-statistics
  - grade6-linear-equations
  - statistical-inference
example_tasks:
  - 'Calculate correlation coefficient for given data'
  - 'Find regression line equation y = a + bx'
  - 'Use regression to predict y when x = 15'
  - 'Interpret r² value of 0.82'
real_world_context: Correlation and regression analyze relationships between variables in economics, medicine, social sciences, sports analytics, marketing, and help predict outcomes based on existing patterns.
---

# Correlation and Regression

Generate correlation and regression problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on analyzing relationships between variables and making predictions.

## Problem Variations

### 1. Scatter Plots and Visual Analysis
Create and interpret scatter plots.

**Key concepts:**
- **Scatter plot:** Graph showing relationship between two quantitative variables
- **Direction:** Positive, negative, or no association
- **Form:** Linear, curved, or no pattern
- **Strength:** Strong, moderate, weak

**Examples:**
- Easy: Describing relationship
  - Given scatter plot of (hours studied, test score)
  - Describe:
    a) Direction (positive/negative)
    b) Form (linear/curved/none)
    c) Strength (strong/moderate/weak)
    d) Any outliers or unusual points

- Medium: Creating scatter plot from data
  - Data: {{x_values}} and {{y_values}}

  | x | {{x₁}} | {{x₂}} | {{x₃}} | {{x₄}} | {{x₅}} | {{x₆}} |
  |---|--------|--------|--------|--------|--------|--------|
  | y | {{y₁}} | {{y₂}} | {{y₃}} | {{y₄}} | {{y₅}} | {{y₆}} |

  - Plot points
  - Describe relationship
  - Would linear model be appropriate?

- Hard: Multiple relationships comparison
  - Given three scatter plots:
    A) Height vs Weight
    B) Height vs IQ
    C) Temperature vs Ice cream sales
  - Rank by strength of association
  - Identify which shows causation vs correlation
  - Discuss lurking variables

### 2. Correlation Coefficient - Concept
Understand Pearson's correlation coefficient.

**Pearson correlation coefficient (r):**
- Measures strength and direction of linear relationship
- Range: $-1 \leq r \leq 1$
- $r = 1$: Perfect positive linear relationship
- $r = -1$: Perfect negative linear relationship
- $r = 0$: No linear relationship

**Interpretation guidelines:**
| |r| value | Interpretation |
|-----------|----------------|
| 0.0 - 0.3 | Weak correlation |
| 0.3 - 0.7 | Moderate correlation |
| 0.7 - 1.0 | Strong correlation |

**Examples:**
- Easy: Interpreting r values
  - $r = 0.85$: Strong positive correlation
  - $r = -0.42$: Moderate negative correlation
  - $r = 0.05$: Very weak/no correlation
  - For each, describe what it means

- Medium: Matching r to scatter plots
  - Given 4 scatter plots
  - Given r values: 0.95, -0.80, 0.35, -0.15
  - Match each r to its scatter plot
  - Justify matches

- Hard: Properties of correlation
  - True or False (explain each):
    a) Correlation implies causation
    b) r is affected by units of measurement
    c) r is affected by outliers
    d) r measures only linear relationships
    e) Switching x and y changes r

### 3. Calculating Correlation Coefficient
Compute Pearson's r from data.

**Formula:**
$$r = \frac{n\sum xy - \sum x \sum y}{\sqrt{[n\sum x^2 - (\sum x)^2][n\sum y^2 - (\sum y)^2]}}$$

Or using standardized values:
$$r = \frac{1}{n-1}\sum\left(\frac{x_i - \bar{x}}{s_x}\right)\left(\frac{y_i - \bar{y}}{s_y}\right)$$

**Examples:**
- Easy: Small dataset (n=5)

  | x | 1 | 2 | 3 | 4 | 5 |
  |---|---|---|---|---|---|
  | y | 2 | 4 | 5 | 4 | 5 |

  - Calculate $\bar{x}$, $\bar{y}$, $s_x$, $s_y$
  - Calculate r
  - Interpret result

- Medium: Organized calculation table
  - Data: {{data}}
  - Create table:

  | x | y | xy | x² | y² |
  |---|---|----|----|-----|
  |...|...|... |... |...  |
  | $\sum$ | | | | |

  - Apply formula to find r

- Hard: Real-world data
  - Dataset: (Age, Reaction Time) for 10 people
  - Ages: 20, 25, 30, 35, 40, 45, 50, 55, 60, 65
  - Times: 185, 190, 195, 205, 210, 220, 230, 245, 260, 280 (ms)
  - Calculate r
  - Is there significant correlation?

### 4. Linear Regression - Least Squares Line
Find the line of best fit.

**Regression equation:**
$$\hat{y} = a + bx$$

Where:
- $b = r \cdot \frac{s_y}{s_x}$ (slope)
- $a = \bar{y} - b\bar{x}$ (y-intercept)

**Alternative formulas:**
$$b = \frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}$$
$$a = \frac{\sum y - b\sum x}{n}$$

**Examples:**
- Easy: Finding equation from summary statistics
  - Given: $\bar{x} = 10$, $\bar{y} = 50$, $s_x = 2$, $s_y = 8$, $r = 0.75$
  - Calculate slope: $b = 0.75 \times \frac{8}{2} = 3$
  - Calculate intercept: $a = 50 - 3(10) = 20$
  - Equation: $\hat{y} = 20 + 3x$

- Medium: Complete calculation from data
  - Data:

  | Hours studied (x) | 2 | 3 | 4 | 5 | 6 |
  |-------------------|---|---|---|---|---|
  | Test score (y) | 65 | 70 | 75 | 85 | 90 |

  - Find regression equation
  - Show all calculations

- Hard: Multiple contexts
  - Temperature (°F) vs Ice cream sales ($)
  - Years of experience vs Salary ($1000s)
  - For each dataset:
    a) Calculate regression equation
    b) Interpret slope in context
    c) Interpret y-intercept in context
    d) Is y-intercept meaningful?

### 5. Making Predictions
Use regression equation to predict values.

**Interpolation:** Predict within data range
**Extrapolation:** Predict outside data range (less reliable)

**Examples:**
- Easy: Direct prediction
  - Regression: $\hat{y} = 15 + 2.5x$
  - Predict y when:
    a) $x = 10$
    b) $x = 20$
    c) $x = 0$
  - Interpret each prediction

- Medium: Real-world prediction
  - Study time vs test score: $\hat{y} = 55 + 8x$
  - Where y = test score, x = hours studied
  - a) Predict score for 4 hours of study
  - b) Student wants 90. How many hours needed?
  - c) Is prediction for 15 hours reliable? Why/why not?

- Hard: Prediction intervals
  - Regression: $\hat{y} = 100 + 5x$, $r = 0.80$
  - For $x = 10$: $\hat{y} = 150$
  - Discuss:
    a) Point prediction: 150
    b) Why actual value might differ
    c) How r affects reliability
    d) Concept of prediction interval

### 6. Residuals and Model Assessment
Analyze how well the model fits the data.

**Residual:** $e_i = y_i - \hat{y}_i$ (observed - predicted)

**Coefficient of determination ($r^2$):**
- $r^2 = (\text{correlation})^2$
- Proportion of variance in y explained by x
- Range: $0 \leq r^2 \leq 1$

**Examples:**
- Easy: Calculating residuals
  - Regression: $\hat{y} = 10 + 2x$
  - Data point: $(5, 22)$
  - Predicted: $\hat{y} = 10 + 2(5) = 20$
  - Residual: $e = 22 - 20 = 2$
  - Interpretation: Actual value is 2 units above predicted

- Medium: Residual plot analysis
  - Create residual plot (residuals vs x)
  - Patterns to check:
    a) Random scatter → Linear model appropriate
    b) Curved pattern → Non-linear relationship
    c) Funnel shape → Non-constant variance
  - Given residual plot, assess model fit

- Hard: Complete model assessment
  - Data: {{data}}
  - Regression: $\hat{y} = a + bx$
  - Calculate:
    a) All predicted values
    b) All residuals
    c) Sum of residuals (should be ≈ 0)
    d) $r^2$ value
  - Create residual plot
  - Assess model quality

**Interpreting $r^2$:**
- $r = 0.9$ → $r^2 = 0.81$
- "81% of variation in y is explained by x"
- Remaining 19% due to other factors

### 7. Regression Assumptions and Limitations
Understand when regression is appropriate and limitations.

**Assumptions:**
1. **Linearity:** Relationship is approximately linear
2. **Independence:** Observations are independent
3. **Homoscedasticity:** Constant variance of residuals
4. **Normality:** Residuals approximately normal (for inference)

**Common issues:**
- **Outliers:** Can heavily influence regression line
- **Influential points:** Points with large effect on slope
- **Correlation ≠ Causation:** Association doesn't prove cause-effect

**Examples:**
- Easy: Identifying problems
  - Given scenarios, identify issue:
    a) Strong correlation between ice cream sales and drownings (lurking variable: temperature)
    b) Regression of height on shoe size with one basketball player (outlier)
    c) Predicting 2050 population from 1900-2000 data (extrapolation)

- Medium: Analyzing outliers
  - Dataset with one clear outlier
  - Calculate regression with and without outlier
  - Compare:
    a) Slopes
    b) Correlation coefficients
    c) Predictions
  - Discuss when to include/exclude outliers

- Hard: Causation vs correlation
  - Study finds strong correlation ($r = 0.85$) between:
    - Coffee consumption and heart disease
  - Questions:
    a) Does this prove coffee causes heart disease?
    b) What confounding variables might exist?
    c) What additional evidence would establish causation?
    d) Design an experiment to test causation

### 8. Real-World Applications
Apply regression to realistic datasets and scenarios.

**Examples:**
- Easy: Economics - Supply and demand
  - Price vs Quantity sold data
  - Find regression line
  - Predict sales at new price point
  - Calculate revenue = price × quantity

- Medium: Sports analytics
  - Basketball: Minutes played vs Points scored for 15 players
  - Data: {{data}}
  - Tasks:
    a) Create scatter plot
    b) Calculate correlation
    c) Find regression equation
    d) Predict points for player with 25 minutes
    e) Identify any outliers (players who score unusually high/low)

- Hard: Multiple regression context
  - Home prices based on:
    - Square footage (x₁)
    - Age of home (x₂)
  - Simple regression: Price vs Square footage
  - Calculate $\hat{y} = a + bx$
  - Find $r^2$
  - Discuss limitations:
    a) What other factors affect price?
    b) How might age interact with size?
    c) Introduction to multiple regression (conceptual)

**Common applications:**
| Field | X variable | Y variable |
|-------|------------|------------|
| Medicine | Dosage | Recovery time |
| Economics | Advertising | Sales |
| Education | Study time | Test scores |
| Environment | CO₂ levels | Temperature |
| Sports | Practice hours | Performance |

## Solution Requirements

Provide:
1. **Scatter plots** when appropriate (describe or sketch)
2. **Correlation calculations** shown step-by-step
3. **Regression equations** clearly derived
4. **LaTeX formatting** for all formulas
5. **Predictions** with proper interpretation
6. **Residual analysis** when assessing model fit
7. **Context-specific interpretations** of all statistics
8. **Units** included in all answers
9. **Discussion of limitations** and assumptions
10. **Distinction between correlation and causation**
