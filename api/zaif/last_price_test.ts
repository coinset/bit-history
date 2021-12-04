import {
  anyArray,
  anyNumber,
  expect,
  stringMatching,
  test,
} from "../dev_deps.ts";
import { getLastPrices } from "./last_price.ts";
import { ALL_ZAIF_PAIRS } from "https://deno.land/x/zaif@v1.0.0-beta.3/public/constants.ts";

test("getLastPrices", async () => {
  await expect(getLastPrices(ALL_ZAIF_PAIRS)).resolves.toEqual(anyArray({
    label: stringMatching(/[A-Z]+/),
    price: anyNumber(),
  }));
});
