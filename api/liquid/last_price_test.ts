import { anyArray, anyNumber, anyString, expect, test } from "../dev_deps.ts";
import { getLastPrices } from "./last_price.ts";

function isUpper(value: string): boolean {
  return /^[A-Z\d]+$/.test(value);
}

test("getLastPrices", async () => {
  await expect(getLastPrices()).resolves.toEqual(anyArray({
    label: anyString(isUpper),
    price: anyNumber(),
  }));
});
