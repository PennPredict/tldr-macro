import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import {spawn} from "node:child_process";
import {chromium} from "playwright";
import edition from "../content/current-edition.json" with {type:"json"};
import {generateHeroCopy} from "../lib/hero-copy.mjs";

const root=process.cwd(),port=4191,base=`http://127.0.0.1:${port}`,server=spawn("python3",["-m","http.server",String(port),"--directory","out"],{stdio:"ignore"});
for(let attempt=0;attempt<30;attempt++){const ready=await new Promise(resolve=>{const request=http.get(base,response=>{response.resume();resolve(response.statusCode===200)});request.on("error",()=>resolve(false))});if(ready)break;await new Promise(resolve=>setTimeout(resolve,200))}
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto(base,{waitUntil:"networkidle"});
const measured=await page.evaluate(()=>{const root=document.querySelector("main").cloneNode(true);root.querySelectorAll("nav,footer,.sr-only,script,style,[hidden],details:not([open])>*:not(summary)").forEach(node=>node.remove());const text=root.innerText.replace(/\b[$+−-]?\d[\d,.:%$]*\b/g,"");const words=(text.match(/[A-Za-z][A-Za-z’'-]*/g)||[]).length;const blocks=[...root.querySelectorAll("p")].map(node=>(node.textContent||"").trim()).filter(Boolean),overlong=[];for(const block of blocks)for(const sentence of block.split(/(?<=[.!?])\s+/)){const count=(sentence.match(/[A-Za-z][A-Za-z’'-]*/g)||[]).length;if(count>15)overlong.push({words:count,text:sentence})}return{words,overlong}});
await browser.close();server.kill();
const themes=JSON.parse(fs.readFileSync(path.join(root,"content/macro-themes.json"),"utf8")),hiddenFields=themes.flatMap(theme=>[["Today",theme.today],["Past six months",theme.six_month],["Three to five years",theme.long_term]].filter(([,field])=>field.has_data===false).map(([label])=>`${theme.title}: ${label}`));
const report={generated_at:new Date().toISOString(),budget:700,before_visible_words:1188,visible_words:measured.words,hidden_empty_fields:hiddenFields,overlong_visible_sentences:measured.overlong};fs.writeFileSync(path.join(root,"reports/prose-budget.json"),JSON.stringify(report,null,2)+"\n");
console.log(`Visible prose: ${measured.words} words (before: 1188; budget: 700).`);console.log(`Hidden empty fields: ${hiddenFields.join("; ")||"none"}.`);if(measured.words>700)console.warn(`Warning: visible prose exceeds 700 words by ${measured.words-700}.`);for(const item of measured.overlong)console.warn(`Warning: ${item.words}-word sentence: ${item.text}`);
for(const warning of generateHeroCopy(edition).warnings||[])console.warn(`Warning: ${warning}.`);
