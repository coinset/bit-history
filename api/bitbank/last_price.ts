import { fetchTickers } from "https://deno.land/x/bitbank@v1.0.0-beta.3/mod.ts";
import { upperCase } from "../_utils/case.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { data } = await fetchTickers();
  return data.map(({ pair, last }) => ({
    label: upperCase(pair),
    price: last,
  }));
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("bitbank", lastPrices);
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
