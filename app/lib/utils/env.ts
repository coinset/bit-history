import { isString } from "isxx";
import { STAGE } from "../../env";

type Stage = "dev" | "prod";

const DEFAULT_STAGE: Stage = "dev";

function validateEnv<T extends string>(key: T[]): [false, {}] | [
  true,
  {
    [k in T]: string;
  },
] {
  const result = key.every((v) => isString(process.env[v]));

  if (result) {
    const env = key.reduce((acc, cur) => {
      return { ...acc, [cur]: process.env[cur] };
    }, {} as { [k in T]: string });
    return [true, env];
  }
  return [false, {}];
}

function isProd(stage?: Stage): boolean {
  const _stage = stage ?? process.env[STAGE];
  return _stage === "prod";
}

export { DEFAULT_STAGE, isProd, validateEnv };
export type { Stage };
