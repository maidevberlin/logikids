---
id: percentage-interest
name: Percentage and Interest Calculations
description: Calculating percentages, percentage changes, and simple and compound interest
grade: 7
ages:
  - 12
  - 14
focus: Basic percentage calculations, percentage increase and decrease, simple interest, compound interest, value added tax
difficulty: easy
learning_objectives:
  - Calculate percentage value, base value, and percentage rate
  - Determine percentage increases and decreases
  - Calculate simple interest and compound interest
  - Apply percentage calculations to real-world problems
  - Understand the relationship between percentages, fractions, and decimals
prerequisites: []
example_tasks:
  - A shirt costs €40 and is discounted by 25%. What is the sale price?
  - A savings account with €500 earns 3% interest per year. How much interest is earned after one year?
  - A city's population increased from 80,000 to 92,000. What is the percentage increase?
real_world_context: Sales discounts, tax calculations, bank interest, inflation rates, population statistics, election results, tip calculations
---

# Percentage and Interest Calculations Tasks

Create mathematics problems that develop practical skills in percentage calculations and their applications. Problems should help students understand the three percentage components (base value, percentage rate, percentage value), calculate percentage changes, and apply percentages to financial contexts including interest calculations.

**Vary the problem structure:**
- **Finding percentage value** using $W = \frac{p}{100} \times G$: Calculate 15% of €200, 8% of 450 students, 75% of 120 kg
- **Finding base value** using $G = \frac{W \times 100}{p}$: If 30% equals 60, what is the whole amount? €45 is 25% of what price?
- **Finding percentage rate** using $p = \frac{W}{G} \times 100$: What percent is 24 of 80? 15 correct answers out of 20 questions is what percentage?
- **Percentage increase**: A price rises from €50 to €65. Calculate the percentage increase using $\frac{\text{new} - \text{old}}{\text{old}} \times 100$
- **Percentage decrease**: A population decreases from 25,000 to 22,000. Find the percentage decrease
- **Discount calculations**: Original price €80, discount 20%, find sale price: $80 \times (1 - 0.20) = 80 \times 0.80$
- **Tax calculations**: Price before tax €150, VAT 19%, find total price: $150 \times 1.19$
- **Simple interest** using $I = P \times r \times t$: Calculate interest on €1000 at 4% per year for 3 years
- **Compound interest** using $A = P \times (1 + r)^t$: Calculate final amount when €500 grows at 5% per year for 2 years

**Vary the content/context:**
- **Shopping**: Sales discounts (20% off, 30% clearance sale), comparing prices, calculating savings, final price after discount
- **Finance**: Bank account interest, savings growth, loan interest, investment returns, compound vs simple interest
- **Taxes**: Value added tax (Mehrwertsteuer), calculating price including tax, extracting tax from total price
- **Statistics**: Population changes, test scores (85% correct = what grade?), survey results (60% of 500 people)
- **Sports**: Win percentages, shooting accuracy (made 12 out of 15 shots), improvement rates
- **Food & Dining**: Restaurant tips (15% tip on €45 meal), recipe increases (increase ingredients by 50%)
- **School**: Grade calculations, attendance rates, score improvements

**Vary the complexity based on age:**
- **For younger ages** ({{age}} < 13): Simple percentages (10%, 25%, 50%, 75%), finding percentage of a number, basic discount problems, one-step calculations, clear context with visual aids
- **For middle ages** ({{age}} 13-14): All three percentage problems (value, base, rate), percentage increase/decrease, simple interest for 1 year, tax calculations, two-step problems
- **For older ages** ({{age}} >= 14): Compound interest with multiple years, complex percentage change problems, reverse calculations (find original price before discount), combined tax and discount, word problems requiring setup

**Use appropriate formats:**

**LaTeX for formulas:**
- Inline for basic calculations: Calculate $25\%$ of $€80$, Find $\frac{15}{100} \times 200$
- Block for formulas:

$$\text{Percentage Value} = \frac{\text{Percentage Rate}}{100} \times \text{Base Value}$$

$$W = \frac{p}{100} \times G$$

$$\text{Simple Interest} = P \times r \times t$$

$$\text{Compound Interest} = P \times (1 + r)^t - P$$

**Tables for interest calculations:**

| Year | Principal | Interest | Total |
|------|-----------|----------|-------|
| 0 | €1000 | - | €1000 |
| 1 | €1000 | €40 | €1040 |
| 2 | €1040 | €41.60 | €1081.60 |

**SVG diagrams for visual percentage representation:**

Use SVG to show:
- Circle/pie charts showing percentage portions
- Bar graphs comparing original and new values
- Growth charts showing compound interest accumulation
- Discount visualizations showing price reductions
- Percentage bars (progress bars) showing parts of whole

Example SVG for percentage bar:
```svg
<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Background bar -->
  <rect x="50" y="40" width="300" height="40" fill="#e5e7eb" stroke="black" stroke-width="1"/>
  <!-- Filled portion (65%) -->
  <rect x="50" y="40" width="195" height="40" fill="#3b82f6"/>
  <!-- Text -->
  <text x="200" y="65" font-size="18" fill="white" font-weight="bold">65%</text>
  <text x="50" y="100" font-size="14">0%</text>
  <text x="320" y="100" font-size="14">100%</text>
</svg>
```

**Adjust difficulty with {{difficulty}}:**
- **Easy**: Finding percentage value only, simple percentages (10%, 25%, 50%), one-step problems, whole number answers, simple interest for 1 year, clear word problems with all information given
- **Medium**: Finding base value or percentage rate, any percentage value, percentage increase/decrease, discount and tax combined, simple interest for multiple years, compound interest introduction, some mental math required
- **Hard**: Complex percentage change problems, reverse calculations (original price before discount and tax), compound interest over multiple years, word problems requiring careful setup, combined percentage operations

**Include variety in numerical values:**
- Different percentages: 5%, 12%, 15%, 18%, 20%, 25%, 30%, 35%, 40%, 50%, 60%, 75%, 80%, 90%
- Vary base values: €20, €85, €150, €450, 1200 people, 350 students, 45 kg
- Interest rates: 2%, 3%, 4%, 5%, 6%, 8%, 10%
- Time periods: 1 year, 2 years, 3 years, 6 months, 18 months
- Discount scenarios: 10% off, 20% clearance, 30% sale, 25% employee discount
- Tax rates: 7% (reduced), 19% (standard German VAT), 20%, 15%
- Price ranges: €15-€500
- Ensure different final answers to promote understanding over memorization
