import { fetchTickers } from "https://deno.land/x/huobi@v1.0.0-beta.2/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import { APIGatewayProxyResultV2 } from "../deps.ts";
import type { LastPrice } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { data } = await fetchTickers();

  return data.map(({ close, symbol }) => {
    return {
      label: symbol.toUpperCase(),
      price: close,
    };
  });
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("huobi", lastPrices);

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
