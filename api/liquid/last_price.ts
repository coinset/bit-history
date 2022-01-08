import { fetchProducts } from "https://deno.land/x/liquid@v1.1.0-beta.1/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const response = await fetchProducts();

  return response.map(({ currency_pair_code, last_traded_price }) => {
    return {
      label: currency_pair_code,
      price: last_traded_price,
    };
  }).filter(({ price }) => !!price) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("liquid", lastPrices);
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
