export * from './todos.js';
export * from './medium.js';
export * from './complex.js';

// Constants following the existing pattern
export const BENCHMARK_SIZE = 1000;
export const BENCHMARK_TOGGLE_SIZE = 50;
export const BENCHMARK_DEBOUNCE_TIME = 5;
export const BENCHMARK_MAX_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export type TimeMetric = {
  index: number;
  duration: number;
};

export async function evaluate(fn: () => void, iterations = BENCHMARK_SIZE) {
  const metrics: TimeMetric[] = [];
  const progress = { index: 0, duration: 0 };
  const stats = { lowest: 0, highest: 0, average: 0 };

  const tick = async () => {
    const start = performance.now();

    fn();

    await new Promise((resolve) => {
      queueMicrotask(() => {
        setTimeout(resolve, 0);
      });
    });

    const end = performance.now();
    const duration = end - start;

    progress.index++;
    progress.duration += duration;

    metrics.push({ index: progress.index, duration });

    if (progress.duration >= BENCHMARK_MAX_TIME || progress.index >= iterations) {
      const lowest = metrics.reduce((acc, curr) => (curr.duration < acc.duration ? curr : acc), metrics[0]);
      const average = metrics.reduce((acc, curr) => acc + curr.duration, 0) / metrics.length;
      const highest = metrics.reduce((acc, curr) => (curr.duration > acc.duration ? curr : acc), metrics[0]);

      stats.lowest = lowest.duration;
      stats.highest = highest.duration;
      stats.average = average;

      console.info(
        `Finished benchmark after ${bold(progress.duration.toLocaleString())}ms with ${bold(progress.index.toLocaleString())} iterations.`
      );
      console.log(`Average duration: ${bold((progress.duration / progress.index).toLocaleString())}ms`);
      console.log('Metrics:', JSON.stringify({ metrics, progress, stats }));

      return;
    }

    await sleep(BENCHMARK_DEBOUNCE_TIME);
    await tick();
  };

  await tick();

  return { metrics, progress, stats };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bold = (text: string | number | boolean) => `\x1b[1m${text}\x1b[0m`;
