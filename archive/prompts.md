## Implementation Prompt

```text
This project is a benchmark to compare how state management libraries handle scalability.

Take Anchor's as the base reference, I need you implement it to the {PACKAGE} package. Important:

- Follow exactly the same UI structure and styling.
- Follow exactly the same functionality.
- Follow exactly the same data structure.
- Handle React's strict mode.

FYI: Anchor's architecture is different with the others. Anchor maintains a stable reference to the data structure;
that's why normal Javascript operations just works. So, don't attempt to do the same with the other packages.

You need optimize the implementation to follow the respective state management best practices and patterns.

Don't check package installation or anything else, everything already setup. Your task is ONLY to implement, nothing
else.

FOLLOW THE BENCHMARK CORRECTNESS AND FAIRNESS PRINCIPLE.

```

## Recommendation Prompt

```text
As a Javascript Developer, you have a task to go to each package implementation to perform an objective assessment based on the developer experience and performance characteristic.

Create a sorted recommendation from which package that you want to work with first to the very least. Attached the benchmark report and each package's source code. Analyze the `Complex.tsx` file including its related files if applicable (e.g. store file).

FYI: All packages maintain immutability pattern and its best practice.

Recommendation format:

### About Me

{Tell user who you are, what is your name}

### Decision Process

{Tell user how do you make the decision}

### Detailed Analysis

{Brief}

#### 1. {PACKAGE} (Recommended)

**Complexity**: (Very Low|Low|Medium|High|Very High), **Bundle Size**: {SIZE}

{Describe your analysis}

**Pros**:
- {PROS}

**Cons**:
- {CONS}

### Conclusion
```
