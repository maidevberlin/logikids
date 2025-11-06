---
id: linear-transformations
name: Linear Transformations
description: Understanding linear transformations, their matrix representations, and geometric properties
grade: 12
ages:
  - 17
  - 18
difficulty: hard
focus: Linear transformation properties, matrix representations, kernel and image, and geometric transformations
learning_objectives:
  - Verify if a transformation is linear
  - Find matrix representations of linear transformations
  - Compute kernel (null space) and image (range) of transformations
  - Understand geometric effects of standard transformations
  - Compose linear transformations using matrix multiplication
---

# Linear Transformations

Linear transformations are functions between vector spaces that preserve vector addition and scalar multiplication, forming the foundation of linear algebra applications.

## Definition

A transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$ is **linear** if for all vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$ and scalar $c \in \mathbb{R}$:

1. **Additivity**: $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2. **Homogeneity**: $T(c\mathbf{u}) = cT(\mathbf{u})$

**Equivalent combined property**: $T(c\mathbf{u} + d\mathbf{v}) = cT(\mathbf{u}) + dT(\mathbf{v})$

**Important consequences**:
- $T(\mathbf{0}) = \mathbf{0}$ (zero vector maps to zero vector)
- Linear transformations always pass through the origin

## Matrix Representation

Every linear transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$ can be represented by an $m \times n$ matrix $A$:

$$T(\mathbf{x}) = A\mathbf{x}$$

To find the matrix $A$:
1. Apply $T$ to the standard basis vectors $\mathbf{e}_1, \mathbf{e}_2, \ldots, \mathbf{e}_n$
2. The results form the columns of $A$:

$$A = \begin{pmatrix}
| & | & & | \\
T(\mathbf{e}_1) & T(\mathbf{e}_2) & \cdots & T(\mathbf{e}_n) \\
| & | & & |
\end{pmatrix}$$

**Example**: If $T(\mathbf{e}_1) = \begin{pmatrix} 2 \\ 1 \end{pmatrix}$ and $T(\mathbf{e}_2) = \begin{pmatrix} -1 \\ 3 \end{pmatrix}$, then:

$$A = \begin{pmatrix}
2 & -1 \\
1 & 3
\end{pmatrix}$$

## Standard Geometric Transformations in $\mathbb{R}^2$

### Rotation (Counterclockwise by angle $\theta$)

$$R_\theta = \begin{pmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{pmatrix}$$

### Reflection about the x-axis

$$\begin{pmatrix}
1 & 0 \\
0 & -1
\end{pmatrix}$$

### Reflection about the y-axis

$$\begin{pmatrix}
-1 & 0 \\
0 & 1
\end{pmatrix}$$

### Reflection about the line $y = x$

$$\begin{pmatrix}
0 & 1 \\
1 & 0
\end{pmatrix}$$

### Scaling (by factors $k_x$ and $k_y$)

$$\begin{pmatrix}
k_x & 0 \\
0 & k_y
\end{pmatrix}$$

### Horizontal Shear

$$\begin{pmatrix}
1 & k \\
0 & 1
\end{pmatrix}$$

### Vertical Shear

$$\begin{pmatrix}
1 & 0 \\
k & 1
\end{pmatrix}$$

### Projection onto x-axis

$$\begin{pmatrix}
1 & 0 \\
0 & 0
\end{pmatrix}$$

### Projection onto y-axis

$$\begin{pmatrix}
0 & 0 \\
0 & 1
\end{pmatrix}$$

## Kernel (Null Space)

The **kernel** of $T$ is the set of all vectors that map to the zero vector:

$$\ker(T) = \{\mathbf{x} \in \mathbb{R}^n : T(\mathbf{x}) = \mathbf{0}\}$$

For matrix representation $A$:

$$\ker(T) = \text{null}(A) = \{\mathbf{x} : A\mathbf{x} = \mathbf{0}\}$$

**Finding the kernel**: Solve the homogeneous system $A\mathbf{x} = \mathbf{0}$ using Gaussian elimination.

**Properties**:
- $\ker(T)$ is a subspace of $\mathbb{R}^n$
- $T$ is **injective** (one-to-one) if and only if $\ker(T) = \{\mathbf{0}\}$

## Image (Range)

The **image** of $T$ is the set of all possible output vectors:

$$\text{im}(T) = \{T(\mathbf{x}) : \mathbf{x} \in \mathbb{R}^n\}$$

For matrix representation $A$:

$$\text{im}(T) = \text{col}(A) = \text{span of columns of } A$$

**Finding the image**: The columns of $A$ corresponding to pivot positions in row echelon form form a basis for $\text{im}(T)$.

**Properties**:
- $\text{im}(T)$ is a subspace of $\mathbb{R}^m$
- $T$ is **surjective** (onto) if and only if $\text{im}(T) = \mathbb{R}^m$

## Rank-Nullity Theorem

For a linear transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$ with matrix $A$:

$$\text{rank}(A) + \text{nullity}(A) = n$$

where:
- $\text{rank}(A) = \dim(\text{im}(T))$ (dimension of image)
- $\text{nullity}(A) = \dim(\ker(T))$ (dimension of kernel)

## Composition of Transformations

If $T_1: \mathbb{R}^n \rightarrow \mathbb{R}^m$ and $T_2: \mathbb{R}^m \rightarrow \mathbb{R}^p$ are linear transformations with matrices $A_1$ and $A_2$, then the composition $T_2 \circ T_1$ has matrix:

$$A_2A_1$$

**Important**: The order matters! $T_2 \circ T_1 \neq T_1 \circ T_2$ in general.

**Example**: Rotating by $45°$ then reflecting about the x-axis:

$$\begin{pmatrix}
1 & 0 \\
0 & -1
\end{pmatrix}
\begin{pmatrix}
\cos 45° & -\sin 45° \\
\sin 45° & \cos 45°
\end{pmatrix}$$

## Invertible Transformations

A linear transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^n$ is **invertible** if:

1. There exists $T^{-1}$ such that $T^{-1} \circ T = T \circ T^{-1} = I$ (identity transformation)
2. The matrix $A$ representing $T$ is invertible ($\det(A) \neq 0$)
3. $T$ is both injective and surjective (bijective)

**Geometric interpretation**: Invertible transformations preserve dimension and can be "undone."

## One-to-One and Onto

- **One-to-One (Injective)**: Different inputs produce different outputs
  - Test: $\ker(T) = \{\mathbf{0}\}$
  - For $m \times n$ matrix: requires $\text{rank}(A) = n$

- **Onto (Surjective)**: Every output is achievable
  - Test: $\text{im}(T) = \mathbb{R}^m$
  - For $m \times n$ matrix: requires $\text{rank}(A) = m$

- **Bijective**: Both one-to-one and onto
  - Only possible when $m = n$ (square matrix)
  - Equivalent to invertibility

## Applications

1. **Computer Graphics**: Rotations, scaling, shearing for 2D/3D objects
2. **Differential Equations**: Systems of linear ODEs
3. **Quantum Mechanics**: State transformations
4. **Data Science**: Principal Component Analysis (PCA)
5. **Robotics**: Coordinate transformations

Generate tasks requiring identification of linear transformations, computation of matrix representations, finding kernel and image, and composing geometric transformations.
