import { getLastPrices } from "./last_price.ts";
import { anyArray, anyNumber, anyString, expect, test } from "../dev_deps.ts";

test("getLastPrices", async () => {
  await expect(getLastPrices()).resolves.toEqual(anyArray({
    label: anyString(),
    price: anyNumber(),
  }));
});
