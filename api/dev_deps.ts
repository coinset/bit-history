import {
  defineExpect,
  jestExtendedMatcherMap,
  jestMatcherMap,
  jestModifierMap,
} from "https://deno.land/x/unitest@v1.0.0-beta.52/mod.ts";
export { defineGlobalThis } from "https://deno.land/x/unitest@v1.0.0-beta.52/mock/global_this.ts";
export {
  anyArray,
  anyNumber,
  stringMatching,
  test,
} from "https://deno.land/x/unitest@v1.0.0-beta.52/mod.ts";

const expect = defineExpect({
  matcherMap: {
    ...jestMatcherMap,
    ...jestExtendedMatcherMap,
  },
  modifierMap: jestModifierMap,
});

export { expect };
