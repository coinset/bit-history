import { SSM } from "https://deno.land/x/ssm@0.1.4/mod.ts";

const ssm = new SSM({
  accessKeyID: Deno.env.get("AWS_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  sessionToken: Deno.env.get("AWS_SESSION_TOKEN"),
  region: Deno.env.get("AWS_REGION") ?? "us-east-1",
});

const result = await ssm.getParameter({
  "Name": Deno.env.get("INFLUX_DB_TOKEN_PATH")!,
  WithDecryption: true,
}).catch(() => {
  console.error(`env is not exists: INFLUX_DB_TOKEN_PATH`);
});

const indexDBToken = result?.Parameter?.Value;

export { indexDBToken };
