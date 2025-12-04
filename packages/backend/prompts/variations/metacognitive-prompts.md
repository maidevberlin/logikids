---
prompts:
  # Self-Explanation (8)
  - text: 'After solving, explain why your answer makes sense'
    grade: [1, 13] # Explanation is universal learning tool
  - text: 'How would you explain your thinking to someone younger?'
    grade: [2, 13] # Teaching others requires understanding
  - text: 'Why did you choose this method to solve it?'
    grade: [2, 13] # Method reflection works broadly
  - text: 'Describe your thought process step by step'
    grade: [2, 13] # Process awareness works broadly
  - text: 'What reasoning led you to this conclusion?'
    grade: [3, 13] # Reasoning analysis more advanced
  - text: 'Explain how you knew to start with this step'
    grade: [2, 13] # First-step awareness works broadly
  - text: "Walk through your logic like you're teaching a class"
    grade: [4, 13] # Teaching simulation more advanced
  - text: 'Justify each decision you made while solving'
    grade: [4, 13] # Justification requires critical thinking

  # Alternative Approaches (8)
  - text: 'Can you think of another way to solve this?'
    grade: [1, 13] # Alternative thinking universal
  - text: 'What would change if one of the numbers was different?'
    grade: [2, 13] # Variable analysis works broadly
  - text: 'How else could you have approached this problem?'
    grade: [2, 13] # Method diversity universal
  - text: "What's a completely different strategy that could work?"
    grade: [3, 13] # Strategy variation more advanced
  - text: "If you couldn't use this method, what would you try?"
    grade: [3, 13] # Constraint thinking more advanced
  - text: 'Compare two different methods for solving this'
    grade: [4, 13] # Comparative analysis more advanced
  - text: 'Which approach is most efficient and why?'
    grade: [5, 13] # Efficiency analysis advanced
  - text: 'Design an entirely new method no one has tried'
    grade: [6, 13] # Creative method design most advanced

  # Verification & Checking (7)
  - text: 'How can you check if your answer is correct?'
    grade: [1, 13] # Self-checking universal
  - text: 'What test could prove your solution works?'
    grade: [3, 13] # Testing concept more advanced
  - text: 'How would you verify this answer without recalculating?'
    grade: [4, 13] # Alternative verification advanced
  - text: 'What evidence supports your conclusion?'
    grade: [4, 13] # Evidence-based thinking advanced
  - text: 'How confident are you in this answer and why?'
    grade: [3, 13] # Confidence calibration more advanced
  - text: 'What could you do to double-check your work?'
    grade: [1, 13] # Double-checking universal
  - text: 'How would you prove this to a skeptic?'
    grade: [5, 13] # Proof construction advanced

  # Pattern Recognition (7)
  - text: 'What pattern do you notice in this problem?'
    grade: [1, 13] # Pattern recognition universal
  - text: "How is this similar to problems you've seen before?"
    grade: [2, 13] # Similarity detection works broadly
  - text: 'What connections do you see between the different parts?'
    grade: [2, 13] # Connection-making works broadly
  - text: "What's the underlying principle at work here?"
    grade: [4, 13] # Principle extraction advanced
  - text: 'How does this fit into what you already know?'
    grade: [3, 13] # Knowledge integration more advanced
  - text: 'What makes this problem unique compared to others?'
    grade: [3, 13] # Contrast analysis more advanced
  - text: 'What general rule or formula applies here?'
    grade: [4, 13] # Generalization more advanced

  # Challenge & Extension (5)
  - text: 'What was the most challenging part of this problem?'
    grade: [1, 13] # Difficulty awareness universal
  - text: 'How would you create a harder version of this problem?'
    grade: [3, 13] # Problem generation more advanced
  - text: 'What would make this problem easier?'
    grade: [2, 13] # Simplification thinking works broadly
  - text: "What's the hardest variation of this you can imagine?"
    grade: [4, 13] # Extreme cases more advanced
  - text: 'What new twist could you add to make it interesting?'
    grade: [3, 13] # Creative extension more advanced

  # Reflection & Learning (5)
  - text: 'What similar problems have you solved before?'
    grade: [2, 13] # Experience comparison works broadly
  - text: 'What did you learn from solving this?'
    grade: [1, 13] # Learning reflection universal
  - text: 'What would you do differently next time?'
    grade: [2, 13] # Improvement thinking works broadly
  - text: 'What surprised you about this problem?'
    grade: [2, 13] # Surprise reflection works broadly
  - text: 'How has your understanding changed after this?'
    grade: [3, 13] # Conceptual change awareness more advanced
---
