function chunk<T>(size: number, value: readonly T[]): T[][] {
  if (size <= 0) {
    return [[]];
  }
  const array = [];
  let i = 0;
  while (i < value.length) {
    array.push(value.slice(i, i += size));
  }

  return array;
}

type ConcurrencyTerm<T> = {
  promises: (() => Promise<T>)[];
  concurrency: number;
};

type ConcurrencyOptions = {
  delay: number;
};

async function concurrencyPromise<T>({
  concurrency,
  promises,
}: ConcurrencyTerm<T>, options?: ConcurrencyOptions): Promise<T[]> {
  const chunked = chunk(concurrency, promises);

  const result: T[][] = [];
  let i = 0;

  for (const chunk of chunked) {
    i++;
    const resolved = await Promise.all(chunk.map(async (fn) => await fn()));

    result.push(resolved);
    if (i !== chunked.length) {
      await wait(options?.delay ?? 200);
    }
  }

  return result.flat();
}

function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export { chunk, concurrencyPromise };
