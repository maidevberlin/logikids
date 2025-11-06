---
id: determinants
name: Determinants
description: Computing and applying determinants of square matrices
grade: 12
ages:
  - 17
  - 18
difficulty: hard
focus: Determinant calculation methods, properties of determinants, and geometric interpretation
learning_objectives:
  - Calculate determinants using cofactor expansion
  - Apply row operations to simplify determinant computation
  - Understand properties of determinants
  - Use determinants to determine matrix invertibility
  - Interpret determinants geometrically as scaling factors
---

# Determinants

The determinant is a scalar value that encodes important properties of a square matrix, including invertibility and geometric transformations.

## Definition and Notation

For a square matrix $A \in \mathbb{R}^{n \times n}$, the determinant is denoted as $\det(A)$ or $|A|$.

### 2×2 Matrices

$$\det\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} = ad - bc$$

### 3×3 Matrices

$$\det\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix} = a_{11}\begin{vmatrix}
a_{22} & a_{23} \\
a_{32} & a_{33}
\end{vmatrix} - a_{12}\begin{vmatrix}
a_{21} & a_{23} \\
a_{31} & a_{33}
\end{vmatrix} + a_{13}\begin{vmatrix}
a_{21} & a_{22} \\
a_{31} & a_{32}
\end{vmatrix}$$

## Cofactor Expansion (Laplace Expansion)

For an $n \times n$ matrix, expand along any row $i$ or column $j$:

$$\det(A) = \sum_{j=1}^{n} a_{ij}C_{ij} = \sum_{j=1}^{n} a_{ij}(-1)^{i+j}M_{ij}$$

where:
- $M_{ij}$ is the **minor**: determinant of the $(n-1) \times (n-1)$ matrix obtained by deleting row $i$ and column $j$
- $C_{ij} = (-1)^{i+j}M_{ij}$ is the **cofactor**

**Strategy**: Expand along the row or column with the most zeros.

## Properties of Determinants

### Basic Properties

1. **Identity**: $\det(I) = 1$
2. **Transpose**: $\det(A^T) = \det(A)$
3. **Product**: $\det(AB) = \det(A)\det(B)$
4. **Inverse**: $\det(A^{-1}) = \frac{1}{\det(A)}$ (if $A$ is invertible)
5. **Scalar Multiple**: $\det(kA) = k^n\det(A)$ for $n \times n$ matrix

### Row Operation Effects

1. **Row Swap**: $\det(A') = -\det(A)$
2. **Row Scaling**: $R_i \rightarrow kR_i$ gives $\det(A') = k\det(A)$
3. **Row Addition**: $R_i \rightarrow R_i + kR_j$ gives $\det(A') = \det(A)$ (unchanged)

### Special Cases

- **Triangular Matrix**: $\det(A) = a_{11}a_{22}\cdots a_{nn}$ (product of diagonal elements)
- **Zero Row/Column**: $\det(A) = 0$
- **Proportional Rows**: $\det(A) = 0$

## Computing Determinants Efficiently

For large matrices, use row operations to transform to triangular form:

$$\det(A) = (-1)^s \cdot k_1k_2\cdots k_m \cdot \det(\text{triangular form})$$

where:
- $s$ = number of row swaps
- $k_1, k_2, \ldots, k_m$ = scaling factors from row scaling operations

## Invertibility Criterion

**Theorem**: A square matrix $A$ is invertible if and only if $\det(A) \neq 0$.

- $\det(A) = 0$: Matrix is **singular** (not invertible)
- $\det(A) \neq 0$: Matrix is **nonsingular** (invertible)

## Geometric Interpretation

For a linear transformation $T(\mathbf{x}) = A\mathbf{x}$:

- $|\det(A)|$ represents the **scaling factor** of area (2D) or volume (3D)
- $\det(A) < 0$ indicates **orientation reversal**
- $\det(A) = 0$ means the transformation **collapses** dimension

### Example: Area Transformation

If vectors $\mathbf{v}_1$ and $\mathbf{v}_2$ form a parallelogram with area $A$, then after transformation by matrix $M$, the new area is:

$$A' = |\det(M)| \cdot A$$

## Cramer's Rule

For systems $A\mathbf{x} = \mathbf{b}$ where $\det(A) \neq 0$:

$$x_i = \frac{\det(A_i)}{\det(A)}$$

where $A_i$ is matrix $A$ with column $i$ replaced by $\mathbf{b}$.

**Note**: Cramer's rule is theoretically important but computationally inefficient for large systems.

Generate tasks requiring determinant calculations using various methods, applying properties to simplify computation, and interpreting determinants in geometric contexts.
