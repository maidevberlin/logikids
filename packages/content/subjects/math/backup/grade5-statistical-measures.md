---
id: grade5-statistical-measures
name: Statistical Measures
description: Data and probability
grade: 5
ages:
  - 10
  - 11
focus: Data and probability
difficulty: medium
learning_objectives:
  - 'Minimum, maximum, range'
  - Arithmetic mean (average)
  - Median (central value)
  - Mode (most frequent value)
prerequisites:
  - collecting-and-representing-data
example_tasks:
  - 'Dataset: 2, 5, 3, 5, 8, 1, 5. Find mean, median, mode'
real_world_context: Statistical measures help analyze test scores, compare sports performances, understand weather patterns, and make sense of survey results.
---

# Statistical Measures

Generate a statistics problem appropriate for a {{age}}-year-old student (Grade {{grade}}) at {{difficulty}} difficulty level.

## Problem Variations

### 1. Finding Minimum, Maximum, and Range
Given the dataset: {{data}}

**Find:**
a) Minimum (smallest value)
b) Maximum (largest value)
c) Range (maximum - minimum)

**Example datasets:**
- Easy: 5, 8, 3, 12, 7
- Medium: 18, 24, 15, 31, 22, 19
- Hard: 47, 53, 38, 61, 42, 55, 49

**Show in table:**
| Measure | Value |
|---------|-------|
| Minimum | ? |
| Maximum | ? |
| Range | ? |

### 2. Calculating the Mean (Average)
Find the mean of the dataset: {{data}}

**Formula:** $\text{Mean} = \frac{\text{sum of all values}}{\text{number of values}}$

**Example datasets:**
- Easy: 4, 6, 8, 10, 12 (sum = 40, count = 5)
- Medium: 15, 18, 22, 20, 25 (sum = 100, count = 5)
- Hard: 34, 28, 41, 37, 45, 31 (sum = 216, count = 6)

**Show work:**
$$\text{Mean} = \frac{{{sum}}}{{{count}}} = ?$$

### 3. Finding the Median
Find the median (middle value) of the dataset: {{data}}

**Steps:**
1. Order the values from smallest to largest
2. Find the middle value (or average of two middle values if even count)

**Example datasets:**
- Easy (odd count): 7, 3, 9, 5, 11 → ordered: 3, 5, 7, 9, 11 → median = 7
- Medium (even count): 12, 8, 15, 10, 18, 14 → ordered: 8, 10, 12, 14, 15, 18 → median = $(12+14)/2 = 13$
- Hard (odd count): 25, 31, 18, 27, 22, 34, 29 → ordered: 18, 22, 25, 27, 29, 31, 34 → median = 27

### 4. Finding the Mode
Find the mode (most frequent value) of the dataset: {{data}}

**Note:** A dataset can have:
- One mode (unimodal)
- Multiple modes (bimodal, multimodal)
- No mode (all values appear equally)

**Example datasets:**
- Easy: 3, 5, 7, 5, 9, 5, 11 → mode = 5
- Medium: 12, 15, 12, 18, 15, 20, 12, 15 → modes = 12 and 15 (bimodal)
- Hard: 8, 10, 12, 14, 16 → no mode (all appear once)

### 5. Complete Statistical Summary
Given the dataset: {{data}}

**Calculate all measures:**
a) Minimum
b) Maximum
c) Range
d) Mean
e) Median
f) Mode

**Present in a summary table:**
| Statistical Measure | Value |
|---------------------|-------|
| Minimum | ? |
| Maximum | ? |
| Range | ? |
| Mean | ? |
| Median | ? |
| Mode | ? |

**Example datasets:**
- Easy: 6, 8, 6, 10, 12, 6, 14
- Medium: 18, 22, 20, 25, 18, 28, 22, 18
- Hard: 34, 41, 37, 34, 45, 39, 34, 42, 38

### 6. Test Scores Analysis
The following are test scores (out of {{max_score}}) for {{n}} students:

{{scores}}

**Questions:**
a) What was the lowest score?
b) What was the highest score?
c) What is the average (mean) score?
d) What is the median score?
e) Which score appeared most often (mode)?

**Example score sets:**
- Easy: Scores out of 10: 7, 8, 6, 9, 8, 7, 10, 8
- Medium: Scores out of 20: 15, 18, 16, 19, 17, 16, 20, 16, 18
- Hard: Scores out of 100: 78, 85, 82, 90, 78, 88, 85, 78, 92, 85

### 7. Temperature Data Analysis
The daily high temperatures (in °C) for one week were:

{{temperatures}}

**Questions:**
a) What was the coldest day? (minimum)
b) What was the warmest day? (maximum)
c) What is the temperature range for the week?
d) What is the average temperature?
e) What is the median temperature?

**Example temperature sets:**
- Easy: 18, 20, 19, 22, 21, 20, 23
- Medium: 15, 18, 14, 20, 17, 19, 16
- Hard: 12, 16, 11, 18, 14, 17, 13, 19, 15

### 8. Comparing Mean and Median
Two students, Alex and Jordan, recorded their quiz scores:

**Alex's scores:** {{alex_scores}}
**Jordan's scores:** {{jordan_scores}}

**For each student, calculate:**
a) Mean score
b) Median score
c) Who has a higher mean score?
d) Who has a higher median score?
e) Explain why the mean and median might be different.

**Example score sets:**
- Easy: Alex: 6, 7, 8, 7, 7; Jordan: 5, 9, 8, 6, 7
- Medium: Alex: 75, 80, 85, 80, 80; Jordan: 70, 90, 85, 75, 80
- Hard: Alex: 88, 92, 75, 90, 85; Jordan: 85, 85, 85, 90, 80

## Solution Requirements

Provide:
1. **Clear organization** of the data (ordered when needed)
2. **Step-by-step calculations** for each measure
3. **Proper formulas** shown with LaTeX notation
4. **Final answers** clearly labeled
5. For mean: Show the sum and division
6. For median: Show the ordered list and middle selection
