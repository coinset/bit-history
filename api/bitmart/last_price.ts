import {
  fetchSymbols,
  fetchTicker,
} from "https://deno.land/x/bitmart@v1.0.0-beta.1/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { data: { symbols } } = await fetchSymbols();

  const result = await Promise.all(symbols.map(async (symbol) => {
    try {
      const { data: { ticker: { last_price, symbol: label } } } =
        await fetchTicker({
          symbol,
        });

      return {
        label: label.replace("_", ""),
        price: last_price,
      };
    } catch {
      console.log(symbol, "is not exists");
      return;
    }
  }));

  return result.filter(Boolean) as LastPrice[];
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
