import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchTickers } from "https://deno.land/x/okex@v1.0.0-beta.1/mod.ts";
import { pairs } from "../scope.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { data } = await fetchTickers({
    instType: "SPOT",
  }).catch(() => ({ data: [] }));

  return data.map(({ instId, last }) => {
    return {
      label: instId.replaceAll("-", ""),
      price: last,
    };
  }).filter(({ label }) => pairs.includes(label));
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("okex", lastPrices);

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
