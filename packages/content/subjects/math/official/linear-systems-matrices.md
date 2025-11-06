---
id: linear-systems-matrices
name: Linear Systems and Matrices
description: Solving systems of linear equations using matrix methods and Gaussian elimination
grade: 12
ages:
  - 17
  - 18
difficulty: hard
focus: Converting systems to matrix form, row operations, row echelon form, and Gaussian elimination
learning_objectives:
  - Convert systems of linear equations to matrix form
  - Perform elementary row operations
  - Apply Gaussian elimination to solve systems
  - Determine if a system has no solution, unique solution, or infinitely many solutions
  - Understand augmented matrices and their role in solving systems
---

# Linear Systems and Matrices

Linear systems can be efficiently solved using matrix representation and systematic row operations through Gaussian elimination.

## Matrix Representation of Linear Systems

A system of linear equations:

$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\vdots \\
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m
\end{cases}$$

can be written in matrix form as $A\mathbf{x} = \mathbf{b}$:

$$\begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}
\begin{pmatrix}
x_1 \\ x_2 \\ \vdots \\ x_n
\end{pmatrix} =
\begin{pmatrix}
b_1 \\ b_2 \\ \vdots \\ b_m
\end{pmatrix}$$

## Augmented Matrix

The augmented matrix combines the coefficient matrix and the constants:

$$[A|\mathbf{b}] = \left(\begin{array}{cccc|c}
a_{11} & a_{12} & \cdots & a_{1n} & b_1 \\
a_{21} & a_{22} & \cdots & a_{2n} & b_2 \\
\vdots & \vdots & \ddots & \vdots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn} & b_m
\end{array}\right)$$

## Elementary Row Operations

Three operations preserve the solution set:

1. **Row Swap**: $R_i \leftrightarrow R_j$
2. **Row Scaling**: $R_i \rightarrow kR_i$ where $k \neq 0$
3. **Row Addition**: $R_i \rightarrow R_i + kR_j$

## Gaussian Elimination

The algorithm transforms the augmented matrix to **row echelon form**:

1. Create leading 1 in the first row (pivot position)
2. Use row operations to create zeros below the pivot
3. Move to the next row and repeat
4. Continue until the matrix is in row echelon form

**Row Echelon Form**:
- All nonzero rows are above rows of all zeros
- Each leading entry (pivot) is to the right of the pivot in the row above
- All entries below a pivot are zero

**Example**:

$$\left(\begin{array}{ccc|c}
1 & 2 & -1 & 3 \\
0 & 1 & 2 & 4 \\
0 & 0 & 1 & -1
\end{array}\right)$$

## Back Substitution

After obtaining row echelon form, solve for variables from bottom to top:

From the example above:
- $x_3 = -1$
- $x_2 + 2(-1) = 4 \Rightarrow x_2 = 6$
- $x_1 + 2(6) - (-1) = 3 \Rightarrow x_1 = -10$

## Types of Solutions

1. **Unique Solution**: Each variable has exactly one value (consistent system, full rank)
2. **Infinitely Many Solutions**: Free variables exist (consistent system, rank deficient)
3. **No Solution**: Contradiction in row echelon form, e.g., $0 = 5$ (inconsistent system)

## Gauss-Jordan Elimination

Extension of Gaussian elimination to **reduced row echelon form** (RREF):
- Continue to create zeros above each pivot
- Each pivot equals 1
- Direct reading of solution without back substitution

Generate tasks requiring students to solve linear systems using Gaussian elimination, identify solution types, and perform row operations systematically.
