#!/usr/bin/env node
import "source-map-support/register";
import { App, Tags } from "@aws-cdk/core";
import { AwsCdkStack } from "../lib/lambda_stack";

const app = new App();

const argContext = "environment";
const envKey = app.node.tryGetContext(argContext);

if (!envKey) {
  throw new Error(
    `Please specify environment with context option. ex) cdk deploy -c ${argContext}=dev`,
  );
}

const envValues = app.node.tryGetContext(envKey);
if (!envValues) throw new TypeError("Invalid environment");

const duration = envValues["lambda"]["duration"];
const INFLUX_DB_BUCKET = envValues["influxDB"]["bucket"];
const INFLUX_DB_ORG = envValues["influxDB"]["org"];
const INFLUX_DB_TOKEN_PATH = envValues["influxDB"]["tokenPath"];

new AwsCdkStack(app, `BitHistory-${envKey}`, {
  description: "The bit history stack",
  terminationProtection: true,
  INFLUX_DB_BUCKET,
  INFLUX_DB_ORG,
  INFLUX_DB_TOKEN_PATH,
  duration,
});

Tags.of(app).add("environment", envValues["envName"]);
