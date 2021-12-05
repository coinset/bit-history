import { chunk } from "./chunk.ts";
import { expect, test } from "../dev_deps.ts";

test("chunk", () => {
  const table: [...Parameters<typeof chunk>, ReturnType<typeof chunk>][] = [
    [0, [], [[]]],
    [0, [1], [[]]],
    [0, [1, 2, 3], [[]]],
    [1, [1, 2, 3], [[1], [2], [3]]],
    [2, [1, 2, 3], [[1, 2], [3]]],
    [3, [1, 2, 3], [[1, 2, 3]]],
    [4, [1, 2, 3], [[1, 2, 3]]],
    [5, [1, 2, 3], [[1, 2, 3]]],
    [3, [1, 2, 3, 4, 5, 6, 7, 8, 9], [[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
  ];

  table.forEach(([size, array, result]) =>
    expect(chunk(size, array)).toEqual(result)
  );
});
