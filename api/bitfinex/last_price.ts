import { APIGatewayProxyResultV2 } from "../deps.ts";
import {
  fetchTickers,
} from "https://deno.land/x/bitfinex@v1.0.0-beta.1/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const response = await fetchTickers({ symbols: ["ALL"] });

  return response.filter(({ type }) => type === "t").filter(({ symbol }) =>
    !/\w+:\w+/.test(symbol)
  ).map(({ symbol, last }) => {
    return {
      label: symbol.substring(1),
      price: last,
    };
  });
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("bitfinex", lastPrices);

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
