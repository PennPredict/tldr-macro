import assert from "node:assert/strict";
import {findTermMarkers} from "../lib/term-matcher.mjs";
const terms=[{id:"ppi",surface_forms:["Producer Price Index","PPI"]},{id:"shipping",surface_forms:["shipping"]},{id:"rate",surface_forms:["interest rates","rates"]}];
assert.equal(findTermMarkers("shipping",terms).some(x=>x.term.id==="ppi"),false,"PPI must not match inside shipping");
assert.equal(findTermMarkers("PPI moved; ppi did not.",terms).filter(x=>x.term.id==="ppi").length,1,"acronym matching is case-sensitive and one-use");
assert.equal(findTermMarkers("Interest rates changed.",terms)[0].surface.toLowerCase(),"interest rates","longest phrase wins");
assert.equal(findTermMarkers("rates and rates",terms).filter(x=>x.term.id==="rate").length,1,"one annotation per term per block");
console.log("Glossary matcher passed: whole-word, case-sensitive acronym, longest-first, non-overlap, one-use.");
