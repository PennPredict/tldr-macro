import assert from "node:assert/strict";
import {getEditionStatus} from "../lib/edition-status.mjs";
const published="2026-10-13T09:35:00-04:00";
assert.equal(getEditionStatus(published,new Date("2026-10-13T17:30:00-04:00")),"Published at 9:35 AM ET. Prices have likely moved.");
assert.equal(getEditionStatus(published,new Date("2026-10-14T08:00:00-04:00")),"This is an archived edition from Oct 13, 2026.");
console.log("Edition stale/archive messages passed at 5:30 PM ET and next day.");
