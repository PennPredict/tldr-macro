import fs from "node:fs";
import path from "node:path";
import {excerpt,root} from "./thread-policy.mjs";

const evidenceRoot=path.join(root,"data/thread-evidence"),cutoff=Date.now()-14*86400000,results=[];
for(const name of fs.existsSync(evidenceRoot)?fs.readdirSync(evidenceRoot):[]){
  if(!name.endsWith(".json")||new Date(name.slice(0,10)).getTime()<cutoff)continue;
  for(const item of JSON.parse(fs.readFileSync(path.join(evidenceRoot,name),"utf8"))){
    if(!item.source_url?.startsWith("http")||!item.matched_excerpt)continue;
    try{const response=await fetch(item.source_url,{redirect:"follow"}),body=await response.text(),needle=excerpt(item.matched_excerpt).replace(/\s+/g," ");results.push({date:name.slice(0,10),element_id:item.element_id,status:!response.ok?`HTTP ${response.status}`:body.replace(/\s+/g," ").includes(needle)?"ok":"excerpt missing",source_url:item.source_url})}catch(error){results.push({date:name.slice(0,10),element_id:item.element_id,status:`fetch failed: ${error.message}`,source_url:item.source_url})}
  }
}
const flagged=results.filter(item=>item.status!=="ok"),lines=["# Thread evidence recheck","",`Generated: ${new Date().toISOString()}`,"",...(results.length?results.map(item=>`- ${item.element_id} (${item.date}): ${item.status} — ${item.source_url}`):["- No thread evidence from the last 14 days."]),"","## Proposed corrections","",...(flagged.length?flagged.map(item=>`- Review ${item.element_id}; propose a data/corrections.json entry only after human confirmation.`):["- None."]),""];
fs.writeFileSync(path.join(root,"THREAD_RECHECK.md"),lines.join("\n"));
if(flagged.length)process.exitCode=1;
console.log(`Rechecked ${results.length} evidence item(s); ${flagged.length} flagged.`);
