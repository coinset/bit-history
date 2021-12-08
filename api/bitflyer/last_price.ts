import { APIGatewayProxyResultV2 } from "../deps.ts";
import { fetchTicker } from "https://deno.land/x/bitflyer@v1.0.0-beta.4/mod.ts";
import { BitflyerPair } from "https://deno.land/x/bitflyer@v1.0.0-beta.4/public/types.ts";
import {
  ALL_BITFLYER_SPOT_PAIRS,
} from "https://deno.land/x/bitflyer@v1.0.0-beta.4/public/constants.ts";
import type { LastPrice } from "../_utils/influx.ts";
import { writeBatch } from "../_utils/influx.ts";

import { upperCase } from "../_utils/case.ts";

export async function safeFetch(pair: BitflyerPair): Promise<LastPrice | null> {
  const { ltp } = await fetchTicker({ productCode: pair }).catch(() => ({
    ltp: null,
  }));

  if (ltp) {
    return {
      label: upperCase(pair),
      price: ltp,
    };
  }
  return null;
}

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const prices = await Promise.all(ALL_BITFLYER_SPOT_PAIRS.map(safeFetch));
  const filtered = prices.filter(Boolean) as LastPrice[];

  try {
    await writeBatch("bitflyer", filtered);

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
