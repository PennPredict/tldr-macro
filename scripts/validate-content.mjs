import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const sourcePolicy=read("config/approved-sources.json");
const editorial=read("config/editorial-policy.json");
const integrity=read("config/data-integrity.json");
const lensDefinitions=read("config/lens-definitions.json");
const lensMapping=read("config/lens-mapping.json");
const viewSettings=read("config/view-settings.json");
const edition=read("content/current-edition.json");
const headlines=read("content/headlines.json");
const terms=read("content/terms.json").terms;
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

const required=["topic_tag","headline","commentary","defines","explains","visual","views","sources"];
const stop=new Set(["the","a","an","and","or","to","of","in","for","with","while","can","may","is","are","that","this","when","from","more","less","their","same"]);
const words=text=>new Set(text.toLowerCase().match(/[a-z]+/g)?.filter(word=>word.length>3&&!stop.has(word))||[]);
const similarity=(a,b)=>{const one=words(a),two=words(b),shared=[...one].filter(word=>two.has(word)).length,total=new Set([...one,...two]).size;return total?shared/total:0;};
const sentenceCount=text=>(text.match(/[.!?]+(?=\s|$)/g)||[]).length;
const causalPattern=/\b(supported|pressured|lifted|pushed|weighed on|drove|boosted|hurt|helped|fueled)\b/gi;
const checkCausality=(label,text,explains)=>{const matches=[...(text||"").matchAll(causalPattern)];const covered=(explains||[]).filter(item=>(text||"").includes(item.anchor_text)).length;const uncovered=Math.max(0,matches.length-covered);if(uncovered)warnings.push(`${label}: ${uncovered} causal verb${uncovered===1?"":"s"} may lack a matching explains entry`);if(uncovered>1)failures.push(`${label}: more than one causal verb lacks an explains entry`);};
const now=Date.now();

for(const headline of headlines){
  for(const field of required)if(headline[field]===null||headline[field]===undefined||headline[field]===""||(Array.isArray(headline[field])&&!headline[field].length))failures.push(`${headline.headline||headline.topic_tag||"Headline"}: missing ${field}`);
  const mapped=lensMapping[headline.topic_tag];
  if(!mapped)failures.push(`${headline.topic_tag}: no topic-to-view mapping`);
  if(headline.headline.length>80)failures.push(`${headline.headline}: headline exceeds 80 characters`);
  else if(headline.headline.length>48)warnings.push(`${headline.headline}: headline exceeds the preferred 48 characters`);
  const commentarySentences=sentenceCount(headline.commentary||"");
  if(commentarySentences<2||commentarySentences>4)failures.push(`${headline.headline}: commentary must contain 2 to 4 sentences`);
  const commentaryWords=(headline.commentary||"").trim().split(/\s+/).filter(Boolean).length;
  if(commentaryWords>85)failures.push(`${headline.headline}: commentary exceeds 85 words`);
  if(!Array.isArray(headline.defines)||!headline.defines.length)failures.push(`${headline.headline}: at least one definition is required`);
  for(const definition of headline.defines||[]){
    if(!definition.term||!definition.definition||!definition.used_by_and_why)failures.push(`${headline.headline}: definition entries require term, definition, and used_by_and_why`);
    else if(!(headline.commentary||"").toLowerCase().includes(definition.term.toLowerCase()))failures.push(`${headline.headline}: defined term “${definition.term}” does not appear in commentary`);
  }
  for(const field of ["type","title","as_of","source","caption","alt"])if(headline.visual?.[field]===null||headline.visual?.[field]===undefined||headline.visual?.[field]==="")failures.push(`${headline.headline}: visual is missing ${field}`);
  if(!["transmission","context","fact"].includes(headline.visual?.type))failures.push(`${headline.headline}: visual type must be transmission, context, or fact`);
  if(headline.visual?.type!=="fact"&&!headline.visual?.data)failures.push(`${headline.headline}: non-fact visual requires data`);
  if(headline.visual?.type==="fact"){if(!headline.visual.fact_text)failures.push(`${headline.headline}: fact visual requires fact_text`);warnings.push(`${headline.headline}: fact card requires manual review before publish`);}
  if(similarity(headline.visual?.caption||"",headline.commentary||"")>.55)failures.push(`${headline.headline}: visual caption duplicates the commentary`);
  if(headline.visual?.as_of){const visualAge=(now-new Date(headline.visual.as_of).getTime())/60000;if(visualAge<0)failures.push(`${headline.headline}: visual timestamp is in the future`);if(visualAge>integrity.freshness_minutes)failures.push(`${headline.headline}: visual data is ${Math.round(visualAge)} minutes old, beyond ${integrity.freshness_minutes} minutes`);}
  if(!Array.isArray(headline.views)||headline.views.length<2||headline.views.length>3)failures.push(`${headline.headline}: include 2 or 3 views`);
  const actualIds=(headline.views||[]).map(view=>view.view_id);
  const rankSorted=[...actualIds].sort((a,b)=>viewSettings.global_rank.indexOf(a)-viewSettings.global_rank.indexOf(b));
  if(JSON.stringify(actualIds)!==JSON.stringify(rankSorted))failures.push(`${headline.headline}: rendered view order does not match the global rank`);
  if(mapped&&JSON.stringify(actualIds)!==JSON.stringify(mapped))failures.push(`${headline.headline}: views must match the mapped rank order ${mapped.join(", ")}`);
  for(const source of headline.sources||[]){
    if(!source.name||!source.href)failures.push(`${headline.headline}: source requires name and href`);
    else if(!approved(new URL(source.href).hostname))failures.push(`${headline.headline}: unapproved source domain ${new URL(source.href).hostname}`);
  }
  if((headline.sources||[]).length<1||(headline.sources||[]).length>3)failures.push(`${headline.headline}: include 1 to 3 sources`);
  const headlineHosts=(headline.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""));
  if(!headlineHosts.some(host=>[...sourcePolicy.primary,...sourcePolicy.market_data].some(domain=>host===domain||host.endsWith(`.${domain}`))))failures.push(`${headline.headline}: at least one source must be primary or official`);
  if(headlineHosts.filter(host=>sourcePolicy.reporting.some(domain=>host===domain||host.endsWith(`.${domain}`))).length>1)failures.push(`${headline.headline}: no more than one news outlet is allowed`);
  for(const explain of headline.explains||[])if(!explain.anchor_text||!explain.why||!explain.other_reading)failures.push(`${headline.headline}: explanation entries require anchor_text, why, and other_reading`);
  checkCausality(headline.headline,[headline.commentary,...(headline.views||[]).map(view=>view.body)].join(" "),headline.explains);
  for(const view of headline.views||[]){
    if(!lensDefinitions[view.view_id])failures.push(`${headline.headline}: unknown view ${view.view_id}`);
    const count=sentenceCount(view.body||"");
    if(count<2||count>4)failures.push(`${headline.headline} / ${view.view_id}: view body must contain 2 to 4 sentences`);
    if(!(view.keep_wondering||"").trim().endsWith("?"))failures.push(`${headline.headline} / ${view.view_id}: Keep wondering must end with a question`);
    if(/\d/.test(view.body||"")||/\b(historically|often|tends?|associated|typically|generally)\b/i.test(view.body||""))warnings.push(`${headline.headline} / ${view.view_id}: manual review requested for a numerical or historical claim`);
  }
  for(let i=0;i<(headline.views||[]).length;i++)for(let j=i+1;j<headline.views.length;j++){
    const score=similarity(headline.views[i].body,headline.views[j].body);
    if(score>=.4)warnings.push(`${headline.headline}: likely view overlap between ${headline.views[i].view_id} and ${headline.views[j].view_id} (${score.toFixed(2)})`);
  }
}

const observations=[];
const allSources=[];
for(const market of edition.markets){
  for(const field of ["name","kind","value","prior_close","change_percent","data_source","fetched_at","sources","explains"])if(market[field]===null||market[field]===undefined||market[field]==="")failures.push(`${market.name||"Market item"}: missing ${field}`);
  if(!Number.isFinite(market.value)||market.value===0)failures.push(`${market.name}: value must be non-zero`);
  if(!Number.isFinite(market.prior_close)||market.prior_close===0)failures.push(`${market.name}: prior close must be non-zero`);
  const calculated=((market.value-market.prior_close)/market.prior_close)*100,threshold=integrity.max_move_percent[market.kind];
  if(Math.abs(calculated)>threshold)failures.push(`${market.name}: move ${calculated.toFixed(2)}% exceeds ${threshold}% threshold`);
  if(Math.abs(calculated-market.change_percent)>0.25)failures.push(`${market.name}: displayed change does not match value and prior close`);
  const ageMinutes=(now-new Date(market.fetched_at).getTime())/60000;
  if(ageMinutes<0)failures.push(`${market.name}: fetch time is in the future`);
  if(ageMinutes>integrity.freshness_minutes)failures.push(`${market.name}: data is ${Math.round(ageMinutes)} minutes old, beyond ${integrity.freshness_minutes} minutes`);
  if(!Array.isArray(market.sources)||market.sources.length<1||market.sources.length>3)failures.push(`${market.name}: include 1 to 3 sources`);
  const marketHosts=(market.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""));
  if(!marketHosts.some(host=>[...sourcePolicy.primary,...sourcePolicy.market_data].some(domain=>host===domain||host.endsWith(`.${domain}`))))failures.push(`${market.name}: at least one source must be primary or official`);
  if(marketHosts.filter(host=>sourcePolicy.reporting.some(domain=>host===domain||host.endsWith(`.${domain}`))).length>1)failures.push(`${market.name}: no more than one news outlet is allowed`);
  for(const source of market.sources||[])allSources.push({card:market.name,...source});
  for(const explain of market.explains||[])if(!explain.anchor_text||!explain.why||!explain.other_reading)failures.push(`${market.name}: explanation entries require anchor_text, why, and other_reading`);
  checkCausality(market.name,market.description,market.explains);
  observations.push({name:market.name,value:market.value,prior_close:market.prior_close,change_percent:market.change_percent,source:market.data_source,source_url:market.sources?.[0]?.href,fetched_at:market.fetched_at,age_minutes:Math.max(0,Math.round(ageMinutes)),status:"checked"});
}
for(const headline of headlines)for(const source of headline.sources||[])allSources.push({card:headline.headline,...source});
const domainCounts={};for(const source of allSources){const host=new URL(source.href).hostname.replace(/^www\./,"");domainCounts[host]=(domainCounts[host]||0)+1;}
for(const [domain,count] of Object.entries(domainCounts))if(count/allSources.length>.25)failures.push(`Source diversity: ${domain} accounts for ${count} of ${allSources.length} links, above 25%`);
const snapshotDomainCards={};for(const market of edition.markets)for(const domain of new Set((market.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""))))snapshotDomainCards[domain]=(snapshotDomainCards[domain]||0)+1;
for(const [domain,count] of Object.entries(snapshotDomainCards))if(count>2)failures.push(`Snapshot diversity: ${domain} appears on ${count} cards, above 2`);
for(const term of terms){if(!term.id||!term.surface_forms?.length||!term.type||!term.definition||!term.used_by_and_why)failures.push(`Terms file: ${term.id||"unnamed term"} has an empty required field`);if(term.type==="also_called"&&!term.also_called?.length)failures.push(`Terms file: ${term.id} needs also_called entries`);}
for(const event of edition.calendar){
  if(event.verified!==integrity.calendar_last_verified)failures.push(`${event.title}: calendar verification date is not current`);
  if(!event.time||!event.prior||!event.consensus||!event.href)failures.push(`${event.title}: incomplete calendar metadata`);
}

const report={generated_at:new Date().toISOString(),edition_date:edition.edition_date,policy_version:sourcePolicy.policy_version,status:failures.length?"failed":"passed",freshness_limit_minutes:integrity.freshness_minutes,calendar_last_verified:integrity.calendar_last_verified,headline_checks:{count:headlines.length,views:headlines.reduce((sum,item)=>sum+item.views.length,0),definitions:Object.keys(lensDefinitions)},source_diversity:{total_links:allSources.length,counts_by_domain:domainCounts,snapshot_cards_by_domain:snapshotDomainCards},fact_cards:headlines.filter(item=>item.visual.type==="fact").map(item=>({headline:item.headline,source:item.visual.source,date:item.visual.as_of})),observations,warnings,failures};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/build-report.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length){console.error("Content policy validation failed:\n"+failures.map(item=>`- ${item}`).join("\n"));process.exit(1);}
console.log(`Content policy passed: ${headlines.length} headlines, ${observations.length} market values, and ${edition.calendar.length} calendar entries checked.`);
if(warnings.length)console.warn("Manual review warnings:\n"+warnings.map(item=>`- ${item}`).join("\n"));
