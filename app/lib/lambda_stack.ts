import type { App, StackProps } from "@aws-cdk/core";
import { DockerImage, Duration, Stack } from "@aws-cdk/core";
import { Code, Function, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";
import { CfnApplication } from "@aws-cdk/aws-sam";
import { resolve } from "path";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { capitalize } from "./utils/format";
import { ManagedPolicy, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { tmpdir } from "os";

const lastPrices = [
  "bitso",
  "coincheck",
  "zaif",
  "bitflyer",
  "btcbox",
  "gmocoin",
  "bitbank",
  "liquid",
  "decurrent",
  "huobi",
  "coinbase",
  "aax",
  "bitstamp",
  "bitfinex",
  "okex",
  "ascendex",
  "bitmart",
];

const image = DockerImage.fromRegistry("denoland/deno");

const APPLICATION_ID =
  "arn:aws:serverlessrepo:us-east-1:390065572566:applications/deno";
const DENO_VERSION = "1.16.0";

interface CustomProps extends StackProps {
  INFLUX_DB_BUCKET: string;
  INFLUX_DB_ORG: string;
  INFLUX_DB_TOKEN_PATH: string;
  duration: number;
  envName: string;
}

export class AwsCdkStack extends Stack {
  constructor(scope: App, id: string, props: CustomProps) {
    super(scope, id, props);

    const { envName, INFLUX_DB_BUCKET, INFLUX_DB_ORG, INFLUX_DB_TOKEN_PATH } =
      props;

    const denoRuntime = new CfnApplication(
      this,
      `DenoRuntime-${envName}`,
      {
        location: {
          applicationId: APPLICATION_ID,
          semanticVersion: DENO_VERSION,
        },
      },
    );

    const layer = LayerVersion.fromLayerVersionArn(
      this,
      `denoRuntimeLayer-${envName}`,
      denoRuntime.getAtt("Outputs.LayerArn").toString(),
    );

    const iamRoleForLambda = new Role(this, `IAMRoleForLambda-${envName}`, {
      roleName: `ssm-secure-string-role-${envName}`,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
      ],
    });

    lastPrices.forEach((market) => {
      const input = `/asset-input/${market}/last_price.ts`;
      const name = capitalize(market);
      const fn = new Function(this, `${market}-last-price`, {
        runtime: Runtime.PROVIDED_AL2,
        code: Code.fromAsset(
          resolve(__dirname, "..", "..", "api"),
          {
            bundling: {
              image,
              command: [
                "bundle",
                "--no-check",
                input,
                "/asset-output/mod.js",
              ],
              volumes: [
                { containerPath: "/deno-dir", "hostPath": tmpdir() },
              ],
            },
          },
        ),
        handler: "mod.handler",
        layers: [layer],
        description: `${name} last price collector`,
        timeout: Duration.seconds(10),
        logRetention: RetentionDays.ONE_WEEK,
        role: iamRoleForLambda,
        environment: {
          HANDLER_EXT: "js",
          INFLUX_DB_BUCKET,
          INFLUX_DB_ORG,
          INFLUX_DB_TOKEN_PATH,
        },
      });

      const target = new LambdaFunction(fn, { retryAttempts: 3 });

      new Rule(this, `${market}-per${props.duration}min-${envName}`, {
        description: `$[${market}] trigger per ${props.duration} minutes`,
        schedule: Schedule.rate(Duration.minutes(props.duration)),
        targets: [target],
      });
    });
  }
}
