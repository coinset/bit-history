import { getLastPrices } from "./last_price.ts";
import { expect, test } from "../dev_deps.ts";

test("getLastPrices", async () => {
  const result = await getLastPrices();

  result.forEach(({ label, price }) => {
    expect(label).toMatch(/[A-Z\d]+/);
    expect(price).toBeNumber();
  });
});
