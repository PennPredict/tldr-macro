import fs from "node:fs";
const headlines=JSON.parse(fs.readFileSync("content/headlines.json","utf8"));
const globals=JSON.parse(fs.readFileSync("content/global-items.json","utf8"));
const words=value=>value.trim().split(/\s+/).filter(Boolean).length;
const failures=[];
for(const item of headlines){if(!item.sources?.length)failures.push(`${item.headline}: no source`);if(words(item.headline)>12)failures.push(`${item.headline}: source headline too long for safe clamp`)}
for(const item of globals){if(item.qualifies!==false&&item.sources?.length<2)failures.push(`${item.headline}: fewer than two sources`)}
if(failures.length)throw new Error(failures.join("\n"));
console.log("V2 copy/source checks passed.");
