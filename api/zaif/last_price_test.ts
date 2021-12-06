import { anyNumber, expect, test } from "../dev_deps.ts";

import { safeFetch } from "./last_price.ts";

test("safeFetch", async () => {
  await expect(safeFetch("bch_jpy")).resolves.toEqual({
    label: "BCHJPY",
    price: anyNumber(),
  });
});
