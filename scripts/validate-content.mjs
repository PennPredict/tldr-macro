import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const sourcePolicy=read("config/approved-sources.json");
const editorial=read("config/editorial-policy.json");
const integrity=read("config/data-integrity.json");
const lensDefinitions=read("config/lens-definitions.json");
const lensMapping=read("config/lens-mapping.json");
const edition=read("content/current-edition.json");
const headlines=read("content/headlines.json");
const allowed=new Set([...sourcePolicy.primary,...sourcePolicy.market_data,...sourcePolicy.company_evidence,...sourcePolicy.reporting,...sourcePolicy.approved_commentary]);
const failures=[];
const warnings=[];
const approved=host=>[...allowed].some(domain=>host===domain||host.endsWith(`.${domain}`));
const collect=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?collect(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const copyFiles=[...collect(path.join(root,"app")).filter(file=>/\.(tsx|ts)$/.test(file)),path.join(root,"content/current-edition.json"),path.join(root,"content/headlines.json")];

for(const file of copyFiles){
  const relative=path.relative(root,file),text=fs.readFileSync(file,"utf8");
  for(const match of text.matchAll(/https?:\/\/[^\s"'<>`)]+/g)){
    const url=new URL(match[0]);
    if(!approved(url.hostname))failures.push(`${relative}: unapproved source domain ${url.hostname}`);
  }
  for(const phrase of editorial.style.banned_phrases)if(text.toLowerCase().includes(phrase.toLowerCase()))failures.push(`${relative}: banned phrase “${phrase}”`);
  for(const word of editorial.style.banned_words)if(new RegExp(`\\b${word}\\b`,"i").test(text))failures.push(`${relative}: banned word “${word}”`);
  for(const character of editorial.style.banned_characters)if(text.includes(character))failures.push(`${relative}: banned character “${character}”`);
}

const required=["topic_tag","display_tag","headline","summary","everyday","how_it_works","data_series","sources","lenses"];
const stop=new Set(["the","a","an","and","or","to","of","in","for","with","while","can","may","is","are","that","this","when","from","more","less","their","same"]);
const words=text=>new Set(text.toLowerCase().match(/[a-z]+/g)?.filter(word=>word.length>3&&!stop.has(word))||[]);
const similarity=(a,b)=>{const one=words(a),two=words(b),shared=[...one].filter(word=>two.has(word)).length,total=new Set([...one,...two]).size;return total?shared/total:0;};
const sentenceCount=text=>(text.match(/[.!?]+(?=\s|$)/g)||[]).length;

for(const headline of headlines){
  for(const field of required)if(headline[field]===null||headline[field]===undefined||headline[field]===""||(Array.isArray(headline[field])&&!headline[field].length))failures.push(`${headline.headline||headline.topic_tag||"Headline"}: missing ${field}`);
  const mapped=lensMapping[headline.topic_tag];
  if(!mapped)failures.push(`${headline.topic_tag}: no topic-to-lens mapping`);
  if(!Array.isArray(headline.how_it_works)||headline.how_it_works.length<3||headline.how_it_works.length>4)failures.push(`${headline.headline}: how_it_works must contain 3 or 4 steps`);
  if(!Array.isArray(headline.lenses)||headline.lenses.length<2||headline.lenses.length>3)failures.push(`${headline.headline}: include 2 or 3 lenses`);
  const actualIds=headline.lenses.map(lens=>lens.lens_id);
  if(mapped&&JSON.stringify(actualIds)!==JSON.stringify(mapped))failures.push(`${headline.headline}: lenses must match the mapped order ${mapped.join(", ")}`);
  for(const source of headline.sources||[]){
    if(!source.name||!source.href)failures.push(`${headline.headline}: source requires name and href`);
    else if(!approved(new URL(source.href).hostname))failures.push(`${headline.headline}: unapproved source domain ${new URL(source.href).hostname}`);
  }
  for(const lens of headline.lenses||[]){
    if(!lensDefinitions[lens.lens_id])failures.push(`${headline.headline}: unknown lens ${lens.lens_id}`);
    const count=sentenceCount(lens.body||"");
    if(count<2||count>4)failures.push(`${headline.headline} / ${lens.lens_id}: lens body must contain 2 to 4 sentences`);
    if(!(lens.keep_wondering||"").trim().endsWith("?"))failures.push(`${headline.headline} / ${lens.lens_id}: Keep wondering must end with a question`);
    if(/\d/.test(lens.body||"")||/\b(historically|often|tends?|associated|typically|generally)\b/i.test(lens.body||""))warnings.push(`${headline.headline} / ${lens.lens_id}: manual review requested for a numerical or historical claim`);
  }
  for(let i=0;i<(headline.lenses||[]).length;i++)for(let j=i+1;j<headline.lenses.length;j++){
    const score=similarity(headline.lenses[i].body,headline.lenses[j].body);
    if(score>=.4)warnings.push(`${headline.headline}: likely lens overlap between ${headline.lenses[i].lens_id} and ${headline.lenses[j].lens_id} (${score.toFixed(2)})`);
  }
}

const now=Date.now(),observations=[];
for(const market of edition.markets){
  for(const field of ["name","kind","value","prior_close","change_percent","data_source","href","fetched_at"])if(market[field]===null||market[field]===undefined||market[field]==="")failures.push(`${market.name||"Market item"}: missing ${field}`);
  if(!Number.isFinite(market.value)||market.value===0)failures.push(`${market.name}: value must be non-zero`);
  if(!Number.isFinite(market.prior_close)||market.prior_close===0)failures.push(`${market.name}: prior close must be non-zero`);
  const calculated=((market.value-market.prior_close)/market.prior_close)*100,threshold=integrity.max_move_percent[market.kind];
  if(Math.abs(calculated)>threshold)failures.push(`${market.name}: move ${calculated.toFixed(2)}% exceeds ${threshold}% threshold`);
  if(Math.abs(calculated-market.change_percent)>0.25)failures.push(`${market.name}: displayed change does not match value and prior close`);
  const ageMinutes=(now-new Date(market.fetched_at).getTime())/60000;
  if(ageMinutes<0)failures.push(`${market.name}: fetch time is in the future`);
  if(ageMinutes>integrity.freshness_minutes)failures.push(`${market.name}: data is ${Math.round(ageMinutes)} minutes old, beyond ${integrity.freshness_minutes} minutes`);
  observations.push({name:market.name,value:market.value,prior_close:market.prior_close,change_percent:market.change_percent,source:market.data_source,source_url:market.href,fetched_at:market.fetched_at,age_minutes:Math.max(0,Math.round(ageMinutes)),status:"checked"});
}
for(const event of edition.calendar){
  if(event.verified!==integrity.calendar_last_verified)failures.push(`${event.title}: calendar verification date is not current`);
  if(!event.time||!event.prior||!event.consensus||!event.href)failures.push(`${event.title}: incomplete calendar metadata`);
}

const report={generated_at:new Date().toISOString(),edition_date:edition.edition_date,policy_version:sourcePolicy.policy_version,status:failures.length?"failed":"passed",freshness_limit_minutes:integrity.freshness_minutes,calendar_last_verified:integrity.calendar_last_verified,headline_checks:{count:headlines.length,lenses:headlines.reduce((sum,item)=>sum+item.lenses.length,0),definitions:Object.keys(lensDefinitions)},observations,warnings,failures};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/build-report.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length){console.error("Content policy validation failed:\n"+failures.map(item=>`- ${item}`).join("\n"));process.exit(1);}
console.log(`Content policy passed: ${headlines.length} headlines, ${observations.length} market values, and ${edition.calendar.length} calendar entries checked.`);
if(warnings.length)console.warn("Manual review warnings:\n"+warnings.map(item=>`- ${item}`).join("\n"));
