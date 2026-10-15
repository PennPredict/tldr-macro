import assert from "node:assert/strict";
import {monthlyPayment,paymentIllustration} from "../lib/mortgage.mjs";

assert.equal(Math.round(monthlyPayment(100000,0,30)),278);
assert.equal(Math.round(monthlyPayment(100000,6,30)),600);
assert.deepEqual(paymentIllustration({principal:300000,rate:7.4}),{base:2077,higher:2286,difference:209});
assert.throws(()=>monthlyPayment(0,5,30));
console.log("Mortgage amortization tests passed, including the 7.40% to 8.40% illustration.");
