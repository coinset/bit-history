import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchLastPrice } from "https://deno.land/x/zaif@v1.0.0-beta.3/mod.ts";
import { ALL_ZAIF_PAIRS } from "https://deno.land/x/zaif@v1.0.0-beta.3/public/constants.ts";
import { ZaifPair } from "https://deno.land/x/zaif@v1.0.0-beta.3/public/types.ts";
import { upperCase } from "../_utils/case.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";
import { concurrencyPromise } from "../_utils/chunk.ts";

export async function safeFetch(pair: ZaifPair): Promise<LastPrice | null> {
  const { last_price } = await fetchLastPrice({ pair }).catch(() => ({
    last_price: null,
  }));

  if (last_price) {
    return {
      label: upperCase(pair),
      price: last_price,
    };
  }
  return null;
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const promises = ALL_ZAIF_PAIRS.map((pair) => () => safeFetch(pair));

  const result = await concurrencyPromise({
    promises,
    concurrency: 10,
  }, {
    delay: 1000,
  });

  const filtered = result.filter(Boolean) as LastPrice[];

  try {
    await writeBatch("zaif", filtered);

    return {
      statusCode: 200,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
    };
  }
}
