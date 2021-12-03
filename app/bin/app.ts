#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { AwsCdkStack } from "../lib/lambda_stack";
import { descStage, withStage } from "../lib/utils/format";
import { isProd } from "../lib/utils/env";
import { STAGE } from "../env";

const app = new App();
new AwsCdkStack(app, withStage("BitHistory"), {
  description: descStage("The bit history stack"),
  terminationProtection: isProd(),
  tags: {
    stage: process.env[STAGE]!,
  },
});
