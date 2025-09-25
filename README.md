# MonoPKG Workspace

This is a mono-repo workspace for managing multiple packages.

## What's inside?

This project includes the following **Workspaces** and **Packages**:

### Workspaces

- `**apps**` (**Apps**) - Apps are where your client-side applications live.
- `**packages**` (**Packages**) - Packages are where your shared libraries live.

### Packages

- **`<empty>`**

## Performance Benchmarks

All benchmark results represent implementations that strictly follow each library's best practices and optimization efforts. These implementations often require significant optimization work and deep understanding of each library's patterns.

### Simple Data Tree (Todo App)

| Package | Time Taken | Init Render | Late Render (Degradation) |
| ------- | ---------- | ----------- | ------------------------- |
| Anchor  | 5,059.7ms  | 0.2ms       | 0.5ms                     |
| Native  | 6,106.5ms  | 0.3ms       | 0.9ms                     |
| Jotai   | 6,128.2ms  | 0.2ms       | 0.6ms                     |
| MobX    | 6,162.5ms  | 0.2ms       | 0.6ms                     |
| Redux   | 41,978.0ms | 0.3ms       | 10.2ms                    |
| Zustand | 46,528.0ms | 0.3ms       | 11.5ms                    |
| Recoil  | -          | -           | -                         |

### Complex State Tree Operations

#### Adding 1,000 Categories

| Package | Time Taken | Render Duration (Min) | Render Duration (Max) | Render Duration (Avg) | Memory Usage (Idle) | Memory Usage (Peak) |
| ------- | ---------- | --------------------- | --------------------- | --------------------- | ------------------- | ------------------- |
| Anchor  | 5,159.9ms  | 0.5ms                 | 7.9ms                 | 5.1ms                 | 40mb                | 155mb               |
| Redux   | 5,527.6ms  | 0.6ms                 | 10.6ms                | 5.5ms                 | 40mb                | 155mb               |
| Mobx    | 5,568.6ms  | 0.8ms                 | 10.7ms                | 5.5ms                 | 40mb                | 161mb               |
| Jotai   | 6,276.6ms  | 0.7ms                 | 8.6ms                 | 6.2ms                 | 40mb                | 309mb               |
| Native  | 32,533.6ms | 2.3ms                 | 82.2ms                | 32.5ms                | 40mb                | 505mb               |
| Zustand | 33,530.6ms | 5.3ms                 | 72.0ms                | 33.5ms                | 40mb                | 486mb               |
| Recoil  | -          | -                     | -                     | -                     | -                   | -                   |

#### Adding 1,000 Posts

| Package | Time Taken                       | Render Duration (Min) | Render Duration (Max) | Render Duration (Avg) | Memory Usage (Idle) | Memory Usage (Peak) |
| ------- | -------------------------------- | --------------------- | --------------------- | --------------------- | ------------------- | ------------------- |
| Anchor  | 14,386.1ms                       | 1.5ms                 | 71.1ms                | 14.3ms                | 40mb                | 732mb               |
| Redux   | 17,568.0ms                       | 1.8ms                 | 69.7ms                | 17.5ms                | 40mb                | 685mb               |
| Mobx    | 17,828.1ms                       | 2.0ms                 | 66.3ms                | 17.8ms                | 40mb                | 707mb               |
| Native  | 300,529.3ms (out of time at 62%) | 3.7ms                 | 3,233.1ms             | 491.8ms               | 40mb                | 3,048mb             |
| Zustand | 300,360.5ms (out of time at 56%) | 5.2ms                 | 1,098.2ms             | 531.6ms               | 40mb                | 2,039mb             |
| Jotai   | 300,661.5ms (out of time at 58%) | 3.5ms                 | 7,278.6ms             | 513.0ms               | 40mb                | 2,403mb             |
| Recoil  | -                                | -                     | -                     | -                     | -                   | -                   |

::: warning Recoil Benchmark Notice
The absence of Recoil benchmark data is due to compatibility issues with React 19. During testing, Recoil failed to function properly in the React 19 environment, making it impossible to obtain reliable benchmark results. This compatibility issue prevented us from including Recoil in the current benchmark comparisons.
:::

