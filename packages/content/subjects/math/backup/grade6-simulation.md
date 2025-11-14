---
id: grade6-simulation
name: Simulation
description: Data and probability
grade: 6
ages:
  - 11
  - 12
focus: Data and probability
difficulty: medium
learning_objectives:
  - Simulate random experiments on computer
  - Relative frequencies with many trials
  - Law of large numbers (intuitive)
prerequisites:
  - deepening-probability
example_tasks:
  - 'Flip a coin 10 times: 6 heads. Flip 100 times: 48 heads. Which is closer to 50%?'
  - Simulate rolling a die 60 times. About how many sixes would you expect?
  - 'After 20 trials, you got heads 14 times. Is this unusual for a fair coin?'
  - Compare theoretical probability (0.5) to experimental results after 10, 50, and 200 trials
real_world_context: Quality control testing, weather prediction, game design, medical trials, opinion polls
---

# Simulation

Create tasks where {{child_name}} uses simulation to explore probability and understands how results approach theoretical probability with many trials appropriate for grade 6 (ages {{age}}).

## Task Variations

1. **Coin Flip Simulation**: Describe or analyze coin flip results. "You flip a fair coin {{10}} times and get {{7}} heads. Is this result unusual?" Compare to theoretical probability (50% heads). Then: "What if you flip {{100}} times and get {{48}} heads?" Discuss how larger samples tend closer to theoretical probability.

2. **Die Rolling Simulation**: Simulate rolling a standard die. "If you roll a die {{60}} times, about how many times would you expect to roll a {{6}}?" Theoretical: $\frac{1}{6} \times 60 = 10$ times. Compare to actual simulation results. Vary the target number and number of rolls.

3. **Relative Frequency Calculation**: Calculate experimental probability from simulation data. "In {{50}} coin flips, heads appeared {{27}} times. What is the relative frequency of heads?" Answer: $\frac{27}{50} = 0.54$ or $54\\%$. Compare to theoretical probability of $0.5$ or $50\\%$.

4. **Law of Large Numbers (Intuitive)**: Compare results from different numbers of trials. Present data:
   - 10 flips: 7 heads (70%)
   - 100 flips: 48 heads (48%)
   - 1000 flips: 503 heads (50.3%)

   "Which result is closest to the theoretical probability of 50%? Why?" Emphasize: more trials → closer to expected probability.

5. **Spinner Simulations**: Use spinners with unequal sections. "A spinner has $\frac{1}{4}$ red, $\frac{1}{2}$ blue, $\frac{1}{4}$ green. If you spin {{40}} times, about how many times would you expect {{blue}}?" Calculate: $\frac{1}{2} \times 40 = 20$. Compare expected to simulated results.

6. **Comparing Theoretical and Experimental**: Given simulation data, compare to theoretical probability. "You draw from a bag with {{3}} red and {{2}} blue marbles {{50}} times (replacing each time). You got red {{28}} times. How does this compare to the theoretical probability?" Theoretical: $\frac{3}{5} = 60\\%$. Experimental: $\frac{28}{50} = 56\\%$.

7. **Sample Size Reasoning**: Determine appropriate sample size. "You want to test if a coin is fair. Which gives more reliable results: {{10}} flips or {{100}} flips? Explain." Discuss variability in small samples vs. large samples. Include examples where small samples give misleading results.

8. **Predicting with Probability**: Use simulation results to make predictions. "In {{200}} trials, event A happened {{50}} times. If you run {{40}} more trials, about how many times would you expect event A?" Calculate rate: $\frac{50}{200} = \frac{1}{4}$, so predict $\frac{1}{4} \times 40 = 10$ times.

Present results in tables:

| Number of Flips | Heads | Tails | Relative Frequency of Heads |
|---|---|---|---|
| 10 | {{7}} | {{3}} | $\frac{7}{10} = 70\\%$ |
| 100 | {{48}} | {{52}} | $\frac{48}{100} = 48\\%$ |
| 1000 | {{503}} | {{497}} | $\frac{503}{1000} = 50.3\\%$ |

Key concepts to emphasize:
- **Theoretical Probability**: What we expect based on the model (e.g., fair coin = 50% heads)
- **Experimental Probability (Relative Frequency)**: What actually happens in trials
- **Law of Large Numbers**: As trials increase, experimental probability tends toward theoretical probability
- **Variability**: Small samples can vary widely; large samples are more stable

Include real contexts: "A factory tests {{100}} vs. {{10,000}} products for defects. Which gives better estimate of defect rate?" Connect to quality control, polling, scientific experiments. Help students understand why larger samples provide more reliable information and why we can't conclude much from small samples.
