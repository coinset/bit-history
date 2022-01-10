import { APIGatewayProxyResultV2 } from "../deps.ts";
import {
  ALL_COINBASE_SYMBOLS,
  fetchPriceSpot,
} from "https://deno.land/x/coinbase@v1.0.0-beta.2/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

async function lastPrice(
  currencyPair: string,
): Promise<[true, LastPrice] | [false]> {
  try {
    const { data } = await fetchPriceSpot({
      currencyPair: currencyPair as never,
    });

    return [true, {
      label: `${data.base}${data.currency}`,
      price: data.amount,
    }];
  } catch {
    return [false];
  }
}

export async function getLastPrices(): Promise<LastPrice[]> {
  const pairs = [
    ...ALL_COINBASE_SYMBOLS.map((symbol) => `${symbol}-JPY`),
    ...ALL_COINBASE_SYMBOLS.map((symbol) => `${symbol}-USD`),
  ];

  const result = await Promise.all(
    pairs.map(lastPrice),
  );

  return result.filter(([success]) => success).map(([_, lastPrice]) =>
    lastPrice
  ) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("coinbase", lastPrices);

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
