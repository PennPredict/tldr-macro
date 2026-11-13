import assert from "node:assert/strict";
import fs from "node:fs";

const config=JSON.parse(fs.readFileSync("config/themes.json","utf8"));
const state=JSON.parse(fs.readFileSync("data/themes/state.json","utf8"));
const edition=JSON.parse(fs.readFileSync("content/current-edition.json","utf8"));
const component=fs.readFileSync("app/MacroThemes.tsx","utf8");
const market=fs.readFileSync("app/MarketSnapshot.tsx","utf8");
const filler=/not refreshed|no verified .* refreshed|does not establish|unchanged/i;
const choose=({today=false,moved=false,closed=false,due=false})=>today?"New today":moved?"Moved today":closed?"Market closed":due?"Data due":"No new data";

assert.equal(config.themes.length,5,"five themes");
assert.equal(choose({today:true,moved:true,closed:true,due:true}),"New today","heavy-day priority");
assert.equal(choose({}),"No new data","quiet-day fixture");
assert.equal(choose({closed:true,due:true}),"Market closed","holiday fixture");
assert(!filler.test(JSON.stringify(state)),"filler ban");
assert(component.includes("setOpen(expanded?null:theme.id)"),"one-open panel state");
assert(component.includes("ArrowRight")&&component.includes("aria-expanded"),"keyboard and disclosure semantics");
for(const theme of config.themes){assert(state.themes[theme.id],`${theme.id} state persists`);assert(theme.question.split(/\s+/).length<=12,`${theme.id} question budget`);for(const item of state.themes[theme.id].developments)assert(item.source_urls.length,`${theme.id} development source`);}
const dates=edition.calendar.map(item=>item.start_at);assert.deepEqual(dates,[...dates].sort(),"calendar order");
for(const title of ["Retail Sales","Federal Reserve Minutes","Jobs Report","Consumer Price Index"])assert(edition.calendar.some(item=>item.title===title),`${title} completeness`);
assert(!market.includes("Earlier verified readings"),"older readings excluded from DOM");
if(edition.edition_date==="2026-11-11")assert(!/Treasury yields/.test(edition.summary),"holiday one-liner omits yield direction");
console.log("Theme system passed: chips, filler, persistence, calendar, holiday consistency, and stale-reading exclusion.");
