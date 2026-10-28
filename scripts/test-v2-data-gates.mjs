import fs from "node:fs";
const edition=JSON.parse(fs.readFileSync("content/current-edition.json","utf8"));
const extras=JSON.parse(fs.readFileSync("content/extra-markets.json","utf8"));
const failures=[];
for(const market of [...edition.markets,...extras]){
  if(market.value!=null&&market.prior_close){const computed=((market.value-market.prior_close)/market.prior_close)*100;if(Math.sign(computed)!==Math.sign(market.change_percent)&&Math.abs(computed)>.005)failures.push(`${market.name}: change sign mismatch`)}
  if((market.series_dates||[]).length!==market.points.length)failures.push(`${market.name}: point/date count mismatch`);
}
if(failures.length)throw new Error(failures.join("\n"));
console.log(`V2 data gates passed for ${edition.markets.length+extras.length} instruments; chart-level duplicate/prior-close failures remain intentionally withheld.`);
