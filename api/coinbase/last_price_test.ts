import { getLastPrices } from "./last_price.ts";
import { anyArray, anyNumber, anyString, expect, test } from "../dev_deps.ts";
import { isUpper } from "../_utils/case.ts";

test("getLastPrices", async () => {
  await expect(getLastPrices()).resolves.toEqual(anyArray({
    label: anyString(isUpper),
    price: anyNumber(),
  }));
});
