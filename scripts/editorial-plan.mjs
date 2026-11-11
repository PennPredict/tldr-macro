import fs from "node:fs";
import path from "node:path";
import {buildEditorialPlan,readJson} from "../lib/editorial-intelligence.mjs";
const args=process.argv.slice(2),value=flag=>{const index=args.indexOf(flag);return index>=0?args[index+1]:null;};
const input=value("--input"),edition=value("--edition")||"morning",output=value("--output")||"reports/editorial-plan.json";
if(!input){console.error("Usage: npm run editorial:plan -- --input <candidate-json> --edition morning|afternoon [--output <path>]");process.exit(2);}
try{const config=readJson("config/editorial-system.json"),sourcePolicy=readJson("config/approved-sources.json"),candidates=JSON.parse(fs.readFileSync(path.resolve(input),"utf8")),plan=buildEditorialPlan(candidates,{config,sourcePolicy,edition});fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),JSON.stringify(plan,null,2)+"\n");console.log(`Editorial plan ready: ${plan.major_stories.length} major stories, ${plan.notable_updates.length} concise updates, ${plan.rejected.length} rejected.`);}catch(error){console.error(`Editorial refresh stopped: ${error.message}`);process.exit(1);}
