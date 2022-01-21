import { fetchMarkets } from "https://deno.land/x/ftx@v1.0.0-beta.1/mod.ts";
import { writeBatch } from "../_utils/influx.ts";
import { pairs } from "../scope.ts";
import type { LastPrice } from "../_utils/influx.ts";
import type { APIGatewayProxyResultV2 } from "../deps.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  const { result } = await fetchMarkets();

  return (result.map((res) => {
    if (res.type === "future" || !res.last) return;

    return {
      label: res.name.replace("/", ""),
      price: res.last,
    };
  }).filter(Boolean) as LastPrice[]).filter(({ label }) =>
    pairs.includes(label)
  );
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const lastPrices = await getLastPrices();
    await writeBatch("ftx", lastPrices);
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
