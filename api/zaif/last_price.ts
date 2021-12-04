import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchLastPrice } from "https://deno.land/x/zaif@v1.0.0-beta.3/mod.ts";
import { ALL_ZAIF_PAIRS } from "https://deno.land/x/zaif@v1.0.0-beta.3/public/constants.ts";
import { ZaifPair } from "https://deno.land/x/zaif@v1.0.0-beta.3/public/types.ts";
import { upperCase } from "../_utils/case.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(pairs: ZaifPair[]): Promise<LastPrice[]> {
  const result = await Promise.all(pairs.map(async (pair) => {
    const result = await fetchLastPrice({ pair }).catch(console.error);

    if (!result || !result.last_price) return;

    return {
      label: upperCase(pair),
      price: result.last_price,
    };
  }));

  return result.filter(Boolean) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices(ALL_ZAIF_PAIRS);

  try {
    await writeBatch("zaif", lastPrices);

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
