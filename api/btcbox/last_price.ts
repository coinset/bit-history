import { writeBatch } from "../_utils/influx.ts";
import {
  fetchTickers,
  TickerResponse,
} from "https://deno.land/x/btcbox@v1.0.0-beta.2/mod.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";
import type { LastPrice } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  return Object.entries(await fetchTickers()).map(([key, value]) => ({
    label: key.replace("_", ""),
    price: (value as TickerResponse).last,
  }));
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("btcbox", lastPrices);
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
