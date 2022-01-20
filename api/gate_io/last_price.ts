import { fetchTickers } from "https://deno.land/x/gate_io@v1.0.0-beta.1/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import { pairs } from "../scope.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const res = await fetchTickers();

  return res.map(({ currency_pair, last }) => {
    return {
      label: currency_pair.replace("_", ""),
      price: last,
    };
  }).filter(({ label }) => pairs.includes(label));
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("gate.io", lastPrices);
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
