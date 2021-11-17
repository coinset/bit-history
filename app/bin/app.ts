#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { AwsCdkStack } from "../lib/lambda_stack";

const app = new App();
new AwsCdkStack(app, "BitHistory", {
  description: "The bit history stack",
});
