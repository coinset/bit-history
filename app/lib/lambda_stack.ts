import type { App, StackProps } from "@aws-cdk/core";
import { Duration, Stack } from "@aws-cdk/core";
import { Code, Function, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";
import { CfnApplication } from "@aws-cdk/aws-sam";
import { resolve } from "path";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import type { IRuleTarget } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { validateEnv } from "./utils/env";
import { INFLUX_DB_BUCKET, INFLUX_DB_ORG, INFLUX_DB_TOKEN } from "../env";
import { setup } from "./setup";
import { capitalize, descStage, withStage } from "./utils/format";

setup();

const lastPrices = ["bitso", "coincheck", "zaif"];

const result = validateEnv([INFLUX_DB_BUCKET, INFLUX_DB_ORG, INFLUX_DB_TOKEN]);

if (!result[0]) {
  console.error(descStage("Environment variable is missing"));
  process.exit(1);
}

const APPLICATION_ID =
  "arn:aws:serverlessrepo:us-east-1:390065572566:applications/deno";
const DENO_VERSION = "1.16.0";

export class AwsCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const denoRuntime = new CfnApplication(this, withStage("DenoRuntime"), {
      location: {
        applicationId: APPLICATION_ID,
        semanticVersion: DENO_VERSION,
      },
    });

    const layer = LayerVersion.fromLayerVersionArn(
      this,
      withStage("denoRuntimeLayer"),
      denoRuntime.getAtt("Outputs.LayerArn").toString(),
    );

    const functions = lastPrices.map((market) => {
      const name = capitalize(market);
      const fn = new Function(this, withStage(name), {
        runtime: Runtime.PROVIDED_AL2,
        code: Code.fromAsset(resolve(__dirname, "..", "..", "api")),
        handler: `${market}/last_price.handler`,
        layers: [layer],
        description: descStage(`${name} ticker historical collector`),
        timeout: Duration.seconds(5),
        logRetention: RetentionDays.ONE_WEEK,
        environment: result[1],
      });

      return fn;
    });

    const targets: IRuleTarget[] = functions.map((fn) =>
      new LambdaFunction(fn, { retryAttempts: 3 })
    );

    new Rule(this, withStage("Per1Min"), {
      description: descStage("Trigger per 1 minutes"),
      schedule: Schedule.rate(Duration.minutes(1)),
      targets,
    });
  }
}
