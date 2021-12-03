import { APIGatewayProxyResultV2 } from "../deps.ts";
import {
  ALL_RATE_PAIRS,
  fetchRate,
} from "https://deno.land/x/coincheck@v1.0.0-beta.7/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

import { upperCase } from "../_utils/case.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const result = await Promise.all(ALL_RATE_PAIRS.map(async (pair) => {
    const result = await fetchRate({ pair }).catch(console.error);
    if (!result) return;

    return {
      label: upperCase(pair),
      price: result.rate,
    };
  }));

  return result.filter(Boolean) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("coincheck", lastPrices);

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
