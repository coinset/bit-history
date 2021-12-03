import type {
  APIGatewayProxyResultV2,
} from "https://deno.land/x/lambda@1.16.0/mod.ts";
import {
  ALL_PAIRS,
  fetchTicker,
} from "https://deno.land/x/bitso@v1.0.0-beta.4/mod.ts";
import { isUndefined } from "https://deno.land/x/isx@v1.0.0-beta.6/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import { upperCase } from "../_utils/case.ts";

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const result = await Promise.all(ALL_PAIRS.map(async (pair) => {
    try {
      const { payload: { book, last } } = await fetchTicker({
        book: pair,
      });

      return {
        label: book,
        price: last,
      };
    } catch {
      console.warn(pair);
    }
  }));

  const data = (result.filter((value) => !isUndefined(value)) as {
    label: string;
    price: number;
  }[]).map(({ label, price }) => ({ label: upperCase(label), price }));

  await writeBatch("bitso", data);

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: "OK",
  };
}
