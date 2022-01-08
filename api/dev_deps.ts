import {
  defineExpect,
  jestExtendedMatcherMap,
  jestMatcherMap,
  jestModifierMap,
} from "https://deno.land/x/unitest@v1.0.0-beta.80/mod.ts";
export { defineGlobalThis } from "https://deno.land/x/unitest@v1.0.0-beta.80/mock/global_this.ts";
export {
  anyArray,
  anyNumber,
  anyOf,
  anyString,
  stringMatching,
  test,
} from "https://deno.land/x/unitest@v1.0.0-beta.80/mod.ts";

const expect = defineExpect({
  matcherMap: {
    ...jestMatcherMap,
    ...jestExtendedMatcherMap,
  },
  modifierMap: jestModifierMap,
});

export { expect };
