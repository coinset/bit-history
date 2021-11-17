import type {
  APIGatewayProxyResultV2,
} from "https://deno.land/x/lambda@1.16.0/mod.ts";

export async function handler(): Promise<APIGatewayProxyResultV2> {
  console.log("Run");

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: "OK",
  };
}
