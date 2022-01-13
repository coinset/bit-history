import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchCryptoTicker } from "https://deno.land/x/currency_com@v1.0.0-beta.1/mod.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const res = await fetchCryptoTicker().catch(() => ({}));

  return Object.entries(res).map(([key, value]) => {
    if (value.last_price) {
      return {
        label: key.replace("/", ""),
        price: value.last_price,
      };
    }
    return;
  }).filter(Boolean) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("currency.com", lastPrices);

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
