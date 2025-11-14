---
id: grade4-divisibility
name: Divisibility
description: Numbers and operations
grade: 4
ages:
  - 9
  - 10
focus: Numbers and operations
difficulty: medium
learning_objectives:
  - Divisors and multiples
  - 'Divisibility rules (2, 3, 5, 10)'
  - Recognize prime numbers
prerequisites:
  - grade-3-times-tables
example_tasks:
  - Is 456 divisible by 3?
  - Name all divisors of 24
real_world_context: Used when dividing items equally into groups, checking if quantities can be packaged evenly, determining team formations, or understanding factors in problem-solving.
---

# Divisibility

Create tasks that help students understand divisibility rules, find divisors and multiples, and recognize patterns in numbers.

## Problem Variations

**Variation 1: Applying Divisibility Rules**
Check if ${{number}}$ is divisible by {{divisor}}. Explain your answer using the divisibility rule.

Divisibility rules to reference:
- **By 2**: Last digit is even (0, 2, 4, 6, 8)
- **By 3**: Sum of digits is divisible by 3
- **By 5**: Last digit is 0 or 5
- **By 10**: Last digit is 0

Example: Is 456 divisible by 3?
- Sum of digits: $4 + 5 + 6 = 15$
- Is 15 divisible by 3? Yes ($15 = 3 \times 5$)
- Therefore, 456 is divisible by 3

**Variation 2: Finding All Divisors**
List all divisors of ${{number}}$.

Example: Find all divisors of 24.

| Divisor | Check | Result |
|---------|-------|--------|
| 1 | $24 \div 1 = 24$ | ✓ |
| 2 | $24 \div 2 = 12$ | ✓ |
| 3 | $24 \div 3 = 8$ | ✓ |
| 4 | $24 \div 4 = 6$ | ✓ |
| 6 | $24 \div 6 = 4$ | ✓ |
| 8 | $24 \div 8 = 3$ | ✓ |
| 12 | $24 \div 12 = 2$ | ✓ |
| 24 | $24 \div 24 = 1$ | ✓ |

Answer: Divisors of 24 are: 1, 2, 3, 4, 6, 8, 12, 24

**Variation 3: Listing Multiples**
Write the first {{count}} multiples of {{number}}.

Example: First 8 multiples of 7:

$$7, 14, 21, 28, 35, 42, 49, 56$$

Pattern: Each multiple is $7 \times n$ where $n = 1, 2, 3, ..., 8$

**Variation 4: Real-World Equal Grouping**
A teacher has ${{total_items}}$ pencils to distribute equally among ${{students}}$ students. Can each student get the same number of pencils without any left over?

Check: Is ${{total_items}}$ divisible by ${{students}}$?

If yes: Each student gets ${{total_items}} \div {{students}} = {{per_student}}$ pencils.
If no: There will be ${{remainder}}$ pencils left over.

**Variation 5: Multiple Divisibility Tests**
Test if ${{number}}$ is divisible by 2, 3, 5, and 10. Create a summary table:

| Divisor | Rule | Check | Divisible? |
|---------|------|-------|------------|
| 2 | Last digit even | Last digit is {{last_digit}} | {{yes_no_2}} |
| 3 | Sum of digits divisible by 3 | ${{d1}} + {{d2}} + {{d3}} = {{sum}}$ | {{yes_no_3}} |
| 5 | Last digit 0 or 5 | Last digit is {{last_digit}} | {{yes_no_5}} |
| 10 | Last digit 0 | Last digit is {{last_digit}} | {{yes_no_10}} |

**Variation 6: Prime or Composite**
Is ${{number}}$ a prime number or a composite number? Explain.

Remember:
- **Prime number**: Has exactly 2 divisors (1 and itself)
- **Composite number**: Has more than 2 divisors

Example: Is 17 prime or composite?
- Divisors of 17: 1, 17
- Since it has exactly 2 divisors, 17 is **prime**

**Variation 7: Common Multiples**
Find the first {{count}} common multiples of {{number_a}} and {{number_b}}.

Example: Common multiples of 4 and 6:

| Multiples of 4 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 |
|----------------|---|---|----|----|----|----|----|----|----|
| Multiples of 6 | 6 | 12 | 18 | 24 | 30 | 36 | 42 | 48 | 54 |

Common multiples: 12, 24, 36, ...

**Variation 8: Divisibility Puzzle**
I'm thinking of a number between {{range_start}} and {{range_end}}.
- It is divisible by {{divisor_a}}
- It is divisible by {{divisor_b}}
- It is NOT divisible by {{divisor_c}}

What could the number be? Find all possibilities.
