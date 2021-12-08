import { safeFetch } from "./last_price.ts";
import { defineGlobalThis, expect, test } from "../dev_deps.ts";

test({
  name: "safeFetch",
  fn: async () => {
    await expect(safeFetch("BTC_JPY")).resolves.toEqual({
      label: "BTCJPY",
      price: 1000,
    });
  },
  setup: () => {
    const reset = defineGlobalThis("fetch", () => {
      return Promise.resolve(
        new Response(JSON.stringify({
          ltp: 1000,
        })),
      );
    });

    return {
      teardown: reset,
    };
  },
});
