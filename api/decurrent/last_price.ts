import { fetchTicker } from "https://deno.land/x/decurrent@v1.0.0-beta.2/mod.ts";
import { ALL_DECURRET_PAIRS } from "https://deno.land/x/decurrent@v1.0.0-beta.2/public/constants.ts";
import { APIGatewayProxyResultV2 } from "../deps.ts";
import { writeBatch } from "../_utils/influx.ts";
import type { LastPrice } from "../_utils/influx.ts";

export async function getLastPrices(): Promise<LastPrice[]> {
  return await Promise.all(
    ALL_DECURRET_PAIRS.map(async (pair) => {
      try {
        const { last } = await fetchTicker({ pair });
        return {
          label: pair.replace("_", ""),
          price: last,
        };
      } catch {
        return;
      }
    }).filter(Boolean),
  ) as LastPrice[];
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const lastPrices = await getLastPrices();

  try {
    await writeBatch("decurrent", lastPrices);

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
