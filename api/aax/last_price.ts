import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchTickers } from "https://deno.land/x/aax@v1.0.0-beta.1/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { tickers } = await fetchTickers();

  const result = tickers.filter(({ c }) => {
    return !!c;
  }).filter(({ s }) => !s.endsWith("_INDEX")).filter(({ s }) =>
    !s.endsWith("FP")
  ).map(({ s, c }) => ({
    label: s,
    price: c,
  }));

  return result;
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("aax", lastPrices);

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
