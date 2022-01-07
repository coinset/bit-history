import { getLastPrices } from "./last_price.ts";
import { anyArray, anyNumber, anyOf, expect, test } from "../dev_deps.ts";

test("getLastPrices", async () => {
  await expect(getLastPrices()).resolves.toEqual(anyArray({
    label: anyOf([
      "BTCJPY",
      "XYMJPY",
      "ETHJPY",
      "MONAJPY",
      "BCHJPY",
      "LTCJPY",
      "XRPJPY",
      "XEMJPY",
      "XLMJPY",
    ]),
    price: anyNumber(),
  }));
});
