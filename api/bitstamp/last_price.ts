import { APIGatewayProxyResultV2 } from "../deps.ts";
import {
  ALL_BITSTAMP_PAIRS,
  fetchTicker,
} from "https://deno.land/x/bitstamp@v1.0.0-beta.1/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const lastPrices = await Promise.all(ALL_BITSTAMP_PAIRS.map(async (pair) => {
    const result = await fetchTicker({ pair }).catch(() => {});
    if (!result) return;

    return {
      label: pair.toUpperCase(),
      price: result.last,
    };
  }));

  return lastPrices.filter(Boolean) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("bitstamp", lastPrices);

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
