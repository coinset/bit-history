import { isString } from "isxx";

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

export { validateEnv };
