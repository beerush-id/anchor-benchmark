# Anchor Benchmark Collections

This repository provides a comprehensive benchmark suite for comparing various React state management libraries. It
implements the same application using different state management solutions to enable fair performance, complexity, and
bundle size comparisons.

## What's inside?

This project includes the following **Workspaces** and **Packages**:

### Workspaces

- `**react**` (**React Applications**) - React applications implementing different state management solutions.
- `**packages**` (**Packages**) - Packages are where your shared libraries live.

### React State Management Implementations

- **`anchor`** - The reference implementation using Anchor state management
- **`jotai`** - Implementation using Jotai state management
- **`mobx`** - Implementation using MobX state management
- **`native`** - Implementation using React's native state management
- **`redux`** - Implementation using Redux state management
- **`zustand`** - Implementation using Zustand state management
- **`recoil`** - Implementation using Recoil state management (currently excluded from benchmarks due to React 19
  compatibility issues)

## Purpose

This benchmark suite aims to provide objective comparisons of different state management solutions in React
applications. Each implementation follows the respective library's best practices while maintaining identical
functionality, UI structure, and data structures to ensure fair comparisons.

## Complexity and Bundle Size

| Package | Complexity | Bundle Size | Notes                                                                      |
|---------|------------|-------------|----------------------------------------------------------------------------|
| Anchor  | Low        | 344.2 KB    | Direct mutations with simple assignments. Most readable and maintainable.  |
| Mobx    | Medium     | 375.3 KB    | Direct mutations but with class-based patterns, actions, and decorators.   |
| Native  | High       | 315.1 KB    | Immutable patterns with spread operations. Verbose and harder to maintain. |
| Jotai   | High       | 322.9 KB    | Immutable patterns with spread operations. Additional atom complexity.     |
| Redux   | High       | 338.3 KB    | Most verbose with actions, reducers, and immutable patterns.               |

> **Assessment Note**: The above complexity assessment is based on code verbosity, readability, and maintainability from
> a Developer Experience (DX) perspective. It evaluates how straightforward it is to work with each state management
> solution in terms of writing, understanding, and maintaining code.

## Performance Benchmarks

All benchmark results represent implementations that strictly follow each library's best practices and optimization
efforts. These implementations often require significant optimization work and deep understanding of each library's
patterns.

### Simple Data Tree (Todo App)

| Package | Time Taken | Render Duration (Min) | Render Duration (Max) | Render Duration (Avg) | Memory Usage (Idle) | Memory Usage (Peak) |
|---------|------------|-----------------------|-----------------------|-----------------------|---------------------|---------------------|
| Anchor  | 5,177.3ms  | 0.6ms                 | 9.70ms                | 5.177ms               | 40mb                | 222mb               |
| Jotai   | 5,242.2ms  | 0.5ms                 | 10.4ms                | 5.242ms               | 40mb                | 256mb               |
| Mobx    | 5,615.2ms  | 0.5ms                 | 11.8ms                | 5.615ms               | 40mb                | 251mb               |
| Native  | 24,310.8ms | 0.5ms                 | 65.0ms                | 24.311ms              | 40mb                | 372mb               |
| Redux   | 32,762.1ms | 0.9ms                 | 72.6ms                | 32.762ms              | 40mb                | 372mb               |

### Complex State Tree

#### Adding 1,000 Categories

| Package | Time Taken | Render Duration (Min) | Render Duration (Max) | Render Duration (Avg) | Memory Usage (Idle) | Memory Usage (Peak) |
|---------|------------|-----------------------|-----------------------|-----------------------|---------------------|---------------------|
| Anchor  | 5,147.8ms  | 0.5ms                 | 9.10ms                | 5.148ms               | 40mb                | 168mb               |
| Jotai   | 5,230.9ms  | 0.5ms                 | 10.1ms                | 5.231ms               | 40mb                | 161mb               |
| Native  | 5,189.2ms  | 0.6ms                 | 9.10ms                | 5.189ms               | 40mb                | 158mb               |
| Redux   | 5,512.1ms  | 0.8ms                 | 11.0ms                | 5.512ms               | 40mb                | 165mb               |
| Mobx    | 5,534.5ms  | 0.6ms                 | 11.3ms                | 5.534ms               | 40mb                | 178mb               |

#### Adding 1,000 Posts

| Package | Time Taken | Render Duration (Min) | Render Duration (Max) | Render Duration (Avg) | Memory Usage (Idle) | Memory Usage (Peak) |
|---------|------------|-----------------------|-----------------------|-----------------------|---------------------|---------------------|
| Anchor  | 13,325.4ms | 1.1ms                 | 57.0ms                | 13.325ms              | 40mb                | 773mb               |
| Jotai   | 13,788.7ms | 1.1ms                 | 60.9ms                | 13.789ms              | 40mb                | 695mb               |
| Native  | 14,932.5ms | 1.7ms                 | 77.8ms                | 14.932ms              | 40mb                | 628mb               |
| Mobx    | 17,789.6ms | 5.3ms                 | 49.6ms                | 17.79ms               | 40mb                | 732mb               |
| Redux   | 18,809.9ms | 1.4ms                 | 61.3ms                | 18.81ms               | 40mb                | 706mb               |

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
