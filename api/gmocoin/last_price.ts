import { fetchTicker } from "https://deno.land/x/gmocoin@v1.0.0-beta.2/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { data } = await fetchTicker({ symbol: "ALL" });
  return data.filter(({ symbol }) => !symbol.endsWith("_JPY")).map((
    { last, symbol },
  ) => ({
    label: `${symbol}JPY`,
    price: last,
  }));
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("gmocoin", lastPrices);
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
