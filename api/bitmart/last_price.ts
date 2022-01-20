import { fetchTickers } from "https://deno.land/x/bitmart@v1.0.0-beta.3/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const res = await fetchTickers();

  return res.data.tickers.map(({ symbol, last_price }) => {
    return {
      label: symbol.replace("_", ""),
      price: last_price,
    };
  });
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("bitmart", lastPrices);
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
