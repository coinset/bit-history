import { DEFAULT_STAGE } from "./utils/env";
import { STAGE } from "../env";
import { config } from "dotenv";

function setup(): void {
  config();

  if (!process.env[STAGE]) {
    process.env[STAGE] = DEFAULT_STAGE;
  }
}

export { setup };
