import {
  defineExpect,
  jestExtendedMatcherMap,
  jestMatcherMap,
  jestModifierMap,
} from "https://deno.land/x/unitest@v1.0.0-beta.46/mod.ts";
export { test } from "https://deno.land/x/unitest@v1.0.0-beta.46/mod.ts";

const expect = defineExpect({
  matcherMap: {
    ...jestMatcherMap,
    ...jestExtendedMatcherMap,
  },
  modifierMap: jestModifierMap,
});

export { expect };
