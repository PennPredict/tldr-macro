import fs from "node:fs";
import path from "node:path";
import {renderThread,root} from "./thread-policy.mjs";
import {gradeLevel} from "../lib/edition-summary.mjs";

const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const thread=read("content/economic-thread.json");
const config=read("config/thread.json");
const mechanisms=read("config/mechanisms.json");
const failures=[];
const nodes=new Map(thread.nodes.map(node=>[node.id,node]));
const wordCount=text=>(text.match(/[A-Za-z0-9%]+/g)||[]).length;

if(thread.nodes.length<3||thread.nodes.length>4)failures.push("Economic Thread must contain 3–4 nodes");
if(thread.edges.length!==thread.nodes.length-1)failures.push("Economic Thread must be one linear chain");
if(new Set(thread.nodes.map(node=>node.id)).size!==thread.nodes.length)failures.push("Economic Thread node ids must be unique");
const banned=/\b(portfolios?|investor confidence|sentiment|for you|may stay|may remain)\b/i;
const tokens=text=>new Set(text.toLowerCase().match(/[a-z]+/g)?.filter(word=>!["can","to","and","the","a"].includes(word))||[]);
const similarity=(a,b)=>{const x=tokens(a.label),y=tokens(b.label),shared=[...x].filter(word=>y.has(word)).length,textScore=shared/(x.size+y.size-shared||1),mechanismScore=a.mechanism_id&&a.mechanism_id===b.mechanism_id?1:0;return Math.max(textScore,mechanismScore)};
for(const node of thread.nodes){if(wordCount(node.label)>5)failures.push(`${node.id}: visible node text exceeds five words`);if(banned.test(node.label))failures.push(`${node.id}: banned flow-node wording`);if(!node.subline||!node.precise||!node.source||!node.source_url)failures.push(`${node.id}: three-part popover detail and source are required`);if(/\bU\.\s+S\./.test(`${node.label} ${node.subline} ${node.precise}`))failures.push(`${node.id}: contains broken U.S. spacing`)}
for(let i=0;i<thread.nodes.length;i++)for(let j=i+1;j<thread.nodes.length;j++)if(similarity(thread.nodes[i],thread.nodes[j])>=.5)failures.push(`${thread.nodes[i].id}/${thread.nodes[j].id}: duplicate flow ideas`);
if(wordCount(thread.other_factors_note)>10)failures.push("Economic Thread legend exceeds 10 words");
if(gradeLevel(`${thread.nodes.map(node=>node.label).join(". ")}. ${thread.other_factors_note}`)>8)failures.push("Economic Thread visible copy exceeds FK grade 8");
if(!config.flow||!["inline_chain","node_cards","icon_flow"].includes(config.flow.variant))failures.push("Economic Thread flow.variant is invalid");
if(thread.mobile_order.length!==thread.nodes.length||new Set(thread.mobile_order).size!==thread.nodes.length||thread.mobile_order.some(id=>!nodes.has(id)))failures.push("Economic Thread mobile order must include every node exactly once");

const adjacency=new Map(thread.nodes.map(node=>[node.id,[]]));
const incoming=new Map();
for(const edge of thread.edges){
  if(!nodes.has(edge.from)||!nodes.has(edge.to)){failures.push(`${edge.id}: missing endpoint`);continue}
  adjacency.get(edge.from).push(edge.to);
  incoming.set(edge.to,(incoming.get(edge.to)||0)+1);
  if(adjacency.get(edge.from).length>1)failures.push(`${edge.from}: branches to more than one node`);
  if(incoming.get(edge.to)>1)failures.push(`${edge.to}: has more than one incoming link`);
  if(!mechanisms[edge.mechanism_id])failures.push(`${edge.id}: unregistered mechanism ${edge.mechanism_id}`);
}
const visiting=new Set(),visited=new Set();
function visit(id){
  if(visiting.has(id)){failures.push("Economic Thread contains a cycle");return}
  if(visited.has(id))return;
  visiting.add(id);
  for(const next of adjacency.get(id)||[])visit(next);
  visiting.delete(id);visited.add(id);
}
for(const id of nodes.keys())visit(id);

const directionRules={
  "oil-to-inflation":{from:/less expensive|lower|fell/i,to:/ease|lower/i,direction:"down"},
  "oil-to-inflation-up":{from:/higher|rose|climbed|moved higher|jumps?|jumped/i,to:/inflation|price pressure|prices/i,direction:"up"},
  "inflation-to-yield":{from:/ease|lower/i,to:/rate|yield/i,direction:"down"},
  "rates-to-borrowing":{from:/rate|yield/i,to:/loan|borrow/i,direction:"up"},
  "rates-to-housing":{from:/rate|yield/i,to:/home|housing/i,direction:"down"}
};
for(const edge of thread.edges){
  const rule=directionRules[edge.mechanism_id];
  if(rule&&(!rule.from.test(nodes.get(edge.from)?.label||"")||!rule.to.test(nodes.get(edge.to)?.label||"")||edge.direction!==rule.direction))failures.push(`${edge.id}: economically inconsistent direction`);
}

const appCopy=fs.readdirSync(path.join(root,"app")).filter(name=>name.endsWith(".tsx")).map(name=>fs.readFileSync(path.join(root,"app",name),"utf8")).join("\n");
const ids=new Set([...appCopy.matchAll(/id=["'`]([^"'`{]+)["'`]/g)].map(match=>match[1]));
for(const id of["story-inflation","story-rates","story-background"])ids.add(id);
for(const node of thread.nodes)if(node.story_anchor&&!ids.has(node.story_anchor))failures.push(`${node.id}: broken story anchor #${node.story_anchor}`);

const rendered=renderThread(thread,config,[]);
fs.writeFileSync(path.join(root,"content/economic-thread.rendered.json"),JSON.stringify(rendered,null,2)+"\n");
if(failures.length){console.error(failures.join("\n"));process.exit(1)}
console.log(`Economic Thread passed: ${thread.nodes.length} concise nodes; mechanisms, directions, evidence, and anchors checked.`);
