---
id: matrices-basics
name: Matrices Basics
description: Introduction to matrices, matrix operations, and basic properties
grade: 12
ages:
  - 17
  - 18
difficulty: hard
focus: Understanding matrix structure, addition, subtraction, scalar multiplication, and matrix multiplication
learning_objectives:
  - Understand matrix notation and dimensions
  - Perform matrix addition and subtraction
  - Apply scalar multiplication to matrices
  - Execute matrix multiplication correctly
  - Recognize properties of matrix operations (associativity, distributivity)
---

# Matrices Basics

Matrices are fundamental mathematical objects in linear algebra, represented as rectangular arrays of numbers arranged in rows and columns.

## Matrix Notation and Dimensions

A matrix $A$ with $m$ rows and $n$ columns is denoted as $A \in \mathbb{R}^{m \times n}$:

$$A = \begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}$$

where $a_{ij}$ represents the element in row $i$ and column $j$.

## Matrix Operations

### Addition and Subtraction

Matrices of the same dimensions can be added or subtracted element-wise:

$$A + B = \begin{pmatrix}
a_{11} + b_{11} & a_{12} + b_{12} \\
a_{21} + b_{21} & a_{22} + b_{22}
\end{pmatrix}$$

### Scalar Multiplication

A scalar $k$ multiplies each element of the matrix:

$$kA = \begin{pmatrix}
ka_{11} & ka_{12} \\
ka_{21} & ka_{22}
\end{pmatrix}$$

### Matrix Multiplication

For matrices $A \in \mathbb{R}^{m \times n}$ and $B \in \mathbb{R}^{n \times p}$, the product $AB \in \mathbb{R}^{m \times p}$ is defined as:

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}b_{kj}$$

**Important**: Matrix multiplication is NOT commutative: $AB \neq BA$ in general.

## Key Properties

1. **Associativity**: $(AB)C = A(BC)$
2. **Distributivity**: $A(B + C) = AB + AC$
3. **Identity Matrix**: $AI = IA = A$ where $I$ is the identity matrix
4. **Zero Matrix**: $A + 0 = A$ and $A \cdot 0 = 0$

## Special Matrices

- **Identity Matrix** $I_n$: Diagonal elements are 1, all others are 0
- **Zero Matrix** $0$: All elements are 0
- **Diagonal Matrix**: Non-zero elements only on the main diagonal
- **Transpose** $A^T$: Rows and columns are swapped

Generate tasks that require students to perform various matrix operations, identify matrix dimensions, and apply properties of matrix algebra.
