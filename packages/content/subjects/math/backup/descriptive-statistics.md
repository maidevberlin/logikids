---
id: descriptive-statistics
name: Descriptive Statistics
description: Statistics and probability
grade: 7
ages:
  - 12
  - 13
focus: Statistics and probability
difficulty: medium
learning_objectives:
  - Measures of central tendency (mean, median, mode)
  - Measures of variability (range, interquartile range)
  - Data visualization (histograms, box plots)
  - Interpreting statistical summaries
prerequisites:
  - grade5-statistical-measures
  - grade5-collecting-and-representing-data
example_tasks:
  - 'Dataset: 12, 15, 18, 15, 22, 18, 25, 15, 28. Calculate mean, median, mode, and range'
  - Create a box plot for the given data
  - Compare two datasets using statistical measures
real_world_context: Descriptive statistics help analyze test scores, compare athletic performance, understand survey results, interpret economic data, and make data-driven decisions in science and business.
---

# Descriptive Statistics

Generate descriptive statistics problems appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level. Focus on calculating, interpreting, and comparing statistical measures.

## Problem Variations

### 1. Calculating Central Tendency Measures
Given a dataset, calculate all measures of central tendency.

**Dataset:** {{data}}

**Calculate:**
a) **Mean** (arithmetic average)
b) **Median** (middle value when ordered)
c) **Mode** (most frequent value)

**Formula for mean:**
$$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n} = \frac{x_1 + x_2 + \cdots + x_n}{n}$$

**Example datasets:**
- Easy: 10, 15, 20, 15, 25, 20, 30 (n=7)
- Medium: 42, 38, 45, 42, 51, 38, 47, 42, 55 (n=9)
- Hard: 78, 82, 85, 78, 91, 88, 78, 95, 82, 88, 78 (n=11)

**Present results in table:**
| Measure | Value | Calculation |
|---------|-------|-------------|
| Mean | ? | Sum ÷ Count |
| Median | ? | Middle value |
| Mode | ? | Most frequent |

### 2. Measures of Variability
Calculate measures that describe how spread out the data is.

**Dataset:** {{data}}

**Calculate:**
a) **Range** = Maximum - Minimum
b) **Interquartile Range (IQR)** = Q3 - Q1

**Steps for IQR:**
1. Order the data from smallest to largest
2. Find the median (Q2)
3. Find the median of the lower half (Q1)
4. Find the median of the upper half (Q3)
5. Calculate IQR = Q3 - Q1

**Example datasets:**
- Easy: 8, 12, 15, 18, 22, 25, 30
- Medium: 35, 42, 48, 55, 58, 62, 68, 75, 82
- Hard: 125, 138, 145, 152, 168, 175, 182, 195, 208, 215, 230

**Present as:**
| Measure | Value |
|---------|-------|
| Minimum | ? |
| Q1 (25th percentile) | ? |
| Q2 (Median, 50th percentile) | ? |
| Q3 (75th percentile) | ? |
| Maximum | ? |
| Range | ? |
| IQR | ? |

### 3. Five-Number Summary and Box Plots
Create a five-number summary and sketch a box plot.

**Dataset:** {{data}}

**Five-number summary consists of:**
1. Minimum
2. First quartile (Q1)
3. Median (Q2)
4. Third quartile (Q3)
5. Maximum

**Visual representation:**
```
    Min    Q1    Median    Q3    Max
     |-----|-------|-------|-----|
          [-------Box-------]
   Whisker         Box        Whisker
```

**Example datasets:**
- Easy: 5, 8, 12, 15, 18, 22, 25, 30, 35
- Medium: 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64
- Hard: 150, 165, 178, 185, 192, 205, 218, 225, 238, 245, 260, 275

**Box plot shows:**
- The "box" from Q1 to Q3 (contains middle 50% of data)
- A line at the median
- "Whiskers" extending to minimum and maximum

### 4. Frequency Tables and Histograms
Organize data into intervals and create a frequency table.

**Dataset:** {{data}}

**Create frequency table:**
| Interval | Tally | Frequency | Relative Frequency |
|----------|-------|-----------|-------------------|
| {{range1}} | | ? | ? |
| {{range2}} | | ? | ? |
| {{range3}} | | ? | ? |
| {{range4}} | | ? | ? |
| **Total** | | {{n}} | 1.00 |

**Relative frequency formula:**
$$\text{Relative Frequency} = \frac{\text{Frequency}}{n}$$

**Example datasets:**
- Easy: Test scores (0-100): 65, 72, 78, 81, 85, 88, 92, 95, 88, 75, 82, 90
  Intervals: 60-69, 70-79, 80-89, 90-100
- Medium: Ages of 20 people: 22, 25, 28, 31, 34, 35, 38, 41, 42, 45, 48, 49, 52, 55, 58, 61, 64, 67, 70, 73
  Intervals: 20-29, 30-39, 40-49, 50-59, 60-69, 70-79

### 5. Comparing Two Datasets
Compare two datasets using statistical measures.

**Dataset A:** {{data_a}}
**Dataset B:** {{data_b}}

**For each dataset, calculate:**
a) Mean
b) Median
c) Range
d) IQR

**Then compare:**
- Which dataset has a higher center (mean/median)?
- Which dataset is more spread out (range/IQR)?
- What does this tell us about the two groups?

**Example scenarios:**
- Easy: Test scores from two classes
  - Class A: 70, 75, 80, 85, 90
  - Class B: 65, 70, 80, 90, 95
- Medium: Customer wait times at two restaurants
  - Restaurant A: 5, 8, 12, 15, 18, 22, 25
  - Restaurant B: 10, 12, 14, 15, 16, 18, 20
- Hard: Daily temperatures in two cities
  - City A: 18, 20, 22, 24, 26, 28, 30, 32, 34
  - City B: 22, 23, 24, 25, 26, 27, 28, 29, 30

### 6. Interpreting Statistical Summaries
Given a statistical summary, answer questions about the dataset.

**Given information:**
- Mean: {{mean}}
- Median: {{median}}
- Mode: {{mode}}
- Range: {{range}}
- Sample size: {{n}}

**Questions:**
a) What does it mean that the mean is {{comparison}} than the median?
b) Is the distribution likely symmetric or skewed? Explain.
c) What percentage of data typically falls within one standard deviation of the mean?
d) If we added a value of {{new_value}}, how would it affect the mean and median?

**Example:**
Given: Mean = 75, Median = 78, Mode = 80, Range = 40, n = 20
- Mean < Median suggests left-skewed distribution (some low outliers)
- Mode > Median suggests clustering of higher values
- Range of 40 shows moderate variability

### 7. Real-World Data Analysis
Analyze real-world data and draw conclusions.

**Scenario:** {{scenario}}

**Data:** {{data}}

**Tasks:**
a) Create a frequency table
b) Calculate mean, median, and mode
c) Calculate range and IQR
d) Create a box plot
e) Write a brief summary of your findings

**Example scenarios:**
- Easy: Daily screen time for 15 students (in hours):
  2, 3, 4, 3, 5, 4, 6, 3, 4, 5, 7, 4, 3, 5, 4
- Medium: Prices of 20 used cars (in thousands):
  8, 12, 15, 18, 22, 25, 28, 30, 32, 15, 18, 20, 22, 25, 28, 12, 15, 18, 22, 25
- Hard: Monthly rainfall (mm) over one year:
  45, 52, 38, 62, 78, 85, 92, 88, 75, 65, 55, 48

### 8. Effect of Outliers
Explore how outliers affect statistical measures.

**Original dataset:** {{data}}

**Modified dataset (with outlier):** {{data_with_outlier}}

**Tasks:**
a) Calculate mean and median for both datasets
b) Which measure is more affected by the outlier? Why?
c) In this case, which measure better represents the "typical" value?
d) When might outliers be important to keep in analysis?

**Example datasets:**
- Easy: Test scores
  - Original: 75, 80, 82, 85, 88, 90, 92
  - With outlier: 75, 80, 82, 85, 88, 90, 92, 35
- Medium: Home prices (in $1000s)
  - Original: 200, 215, 225, 240, 255, 270, 285
  - With outlier: 200, 215, 225, 240, 255, 270, 285, 950
- Hard: Athlete sprint times (seconds)
  - Original: 11.2, 11.5, 11.8, 12.1, 12.4, 12.7
  - With outlier: 11.2, 11.5, 11.8, 12.1, 12.4, 12.7, 15.8

## Solution Requirements

Provide:
1. **Clear data organization** (ordered lists, tables)
2. **Step-by-step calculations** with proper formulas
3. **LaTeX notation** for mathematical expressions
4. **Visual representations** (box plots, frequency tables)
5. **Interpretations** explaining what the numbers mean
6. **Comparisons** when analyzing multiple datasets
7. **Conclusions** based on statistical evidence
