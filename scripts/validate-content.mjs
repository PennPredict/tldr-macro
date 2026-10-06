import fs from "node:fs";
import path from "node:path";
import {badExamples,generateSummary,lintSummary,summarySamples} from "../lib/edition-summary.mjs";

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
const snapshotConfig=read("config/snapshot.json");
const extraMarkets=read("content/extra-markets.json");
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
const editionReference=new Date(edition.updated_at).getTime();
const wordCount=text=>(text||"").trim().split(/\s+/).filter(Boolean).length;
const generatedSummary=generateSummary(edition);
const summaryLint=lintSummary(edition.summary,generatedSummary.facts);
for(const failure of summaryLint.errors)failures.push(`Edition summary: ${failure}`);
for(const warning of summaryLint.warnings)warnings.push(`Edition summary: ${warning}`);
if(!Number.isInteger(snapshotConfig.chart_span_days)||snapshotConfig.chart_span_days<1)failures.push("Snapshot chart span must be a positive integer");

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
  if(wordCount(headline.visual?.title)>5)failures.push(`${headline.headline}: visual title exceeds 5 words`);
  if(headline.visual?.type==="context"&&wordCount(headline.visual?.caption)>8)failures.push(`${headline.headline}: chart caption exceeds 8 words`);
  for(const value of Object.values(headline.visual?.data||{}))if(Array.isArray(value))for(const label of value)if(typeof label==="string"&&wordCount(label)>3)failures.push(`${headline.headline}: visual label “${label}” exceeds 3 words`);
  if(headline.visual?.as_of){const visualAge=(editionReference-new Date(headline.visual.as_of).getTime())/60000;if(visualAge<0)failures.push(`${headline.headline}: visual timestamp is later than the edition timestamp`);if(visualAge>integrity.freshness_minutes)failures.push(`${headline.headline}: visual data is ${Math.round(visualAge)} minutes older than the edition, beyond ${integrity.freshness_minutes} minutes`);}
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
  const ageMinutes=(editionReference-new Date(market.fetched_at).getTime())/60000;
  if(ageMinutes<0)failures.push(`${market.name}: fetch time is later than the edition timestamp`);
  if(ageMinutes>integrity.freshness_minutes)failures.push(`${market.name}: data is ${Math.round(ageMinutes)} minutes older than the edition, beyond ${integrity.freshness_minutes} minutes`);
  if(!Array.isArray(market.sources)||market.sources.length<1||market.sources.length>3)failures.push(`${market.name}: include 1 to 3 sources`);
  if(sentenceCount(market.description.replaceAll("U.S.","US"))>2||wordCount(market.description)>32)failures.push(`${market.name}: snapshot description must be at most 2 sentences and about 30 words`);
  const marketHosts=(market.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""));
  if(!marketHosts.some(host=>[...sourcePolicy.primary,...sourcePolicy.market_data].some(domain=>host===domain||host.endsWith(`.${domain}`))))failures.push(`${market.name}: at least one source must be primary or official`);
  if(marketHosts.filter(host=>sourcePolicy.reporting.some(domain=>host===domain||host.endsWith(`.${domain}`))).length>1)failures.push(`${market.name}: no more than one news outlet is allowed`);
  for(const source of market.sources||[])allSources.push({card:market.name,...source});
  for(const explain of market.explains||[])if(!explain.anchor_text||!explain.why||!explain.other_reading)failures.push(`${market.name}: explanation entries require anchor_text, why, and other_reading`);
  checkCausality(market.name,market.description,market.explains);
  observations.push({name:market.name,value:market.value,prior_close:market.prior_close,change_percent:market.change_percent,source:market.data_source,source_url:market.sources?.[0]?.href,fetched_at:market.fetched_at,age_minutes:Math.max(0,Math.round(ageMinutes)),status:"checked"});
}
const visibleNames=edition.markets.map(item=>item.name==="Gold futures"?"Gold":item.name==="Expected volatility"?"Expected volatility (VIX)":item.name);
const renderedNames=[...visibleNames].sort((a,b)=>snapshotConfig.priority_order.indexOf(a)-snapshotConfig.priority_order.indexOf(b));
if(JSON.stringify(renderedNames)!==JSON.stringify(snapshotConfig.priority_order))failures.push(`Snapshot order must match config: ${snapshotConfig.priority_order.join(", ")}`);
const extraProviderReport=[];
for(const market of extraMarkets){if(market.available===false)continue;if(sentenceCount(market.description)>3||wordCount(market.description)>50)failures.push(`${market.name}: extra-market description must be at most 3 sentences and 50 words`);if(!market.data_provider||!market.licensing_note)failures.push(`${market.name}: provider and licensing note are required`);if(!(market.sources||[]).length)failures.push(`${market.name}: primary source is required`);if(!market.points||market.points.length<2)failures.push(`${market.name}: visible extra markets require a trendline`);extraProviderReport.push({name:market.name,current_provider:market.data_provider,historical_provider:market.points?.length?market.data_provider:"No historical series published",licensing_note:market.licensing_note});}
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

const providerLicensing=[...edition.markets.map(item=>({name:item.name,current_provider:item.data_source,historical_provider:"Existing edition series; redistribution terms require provider review",licensing_note:"Official or approved-source links are published; raw historical datasets are not redistributed."})),...extraProviderReport];
const consistencyCorpus=[...edition.markets.map(item=>`${item.name}: ${item.description}`),...headlines.map(item=>`${item.headline}: ${item.commentary}`)];
const consistencyRules=[
  {label:"stocks",positive:generatedSummary.facts.stocks.change_percent>0,subject:/stock market|s&p 500/i},
  {label:"rates",positive:generatedSummary.facts.rates.change_basis_points>0,subject:/10-year|treasury yield|government borrowing rates/i},
  {label:"oil",positive:generatedSummary.facts.oil.change_percent>0,subject:/oil|brent/i}
];
const summaryConsistency=[];
for(const rule of consistencyRules)for(const text of consistencyCorpus)for(const sentence of text.split(/(?<=[.!?])\s+/)){if(!rule.subject.test(sentence))continue;const saysUp=/\b(rose|climbed|gained|jumped|edged up|moved higher)\b/i.test(sentence),saysDown=/\b(fell|dropped|declined|edged down|moved lower|retreated|eased)\b/i.test(sentence);if((rule.positive&&saysDown)||(!rule.positive&&saysUp))summaryConsistency.push(`${rule.label}: possible direction conflict in “${sentence}”`);}
for(const flag of summaryConsistency)failures.push(`Edition summary consistency: ${flag}`);
const badExampleChecks=Object.fromEntries(Object.entries(badExamples).map(([name,sentence])=>[name,{sentence,lint:lintSummary(sentence,generatedSummary.facts)}]));
if(badExampleChecks.unsupported.lint.passed)failures.push("Edition summary checker accepted an unsupported qualifier");
if(badExampleChecks.causal.lint.passed)failures.push("Edition summary checker accepted causal wording");
const report={generated_at:new Date().toISOString(),edition_date:edition.edition_date,policy_version:sourcePolicy.policy_version,status:failures.length?"failed":"passed",freshness_limit_minutes:integrity.freshness_minutes,calendar_last_verified:integrity.calendar_last_verified,snapshot_checks:{summary_words:wordCount(edition.summary),summary_characters:edition.summary.length,priority_order:renderedNames,chart_span_days:snapshotConfig.chart_span_days,axis_labels:2},edition_summary:{facts:generatedSummary.facts,chosen_qualifiers:{stocks:generatedSummary.facts.stocks.qualifier,rates:generatedSummary.facts.rates.qualifier,oil:generatedSummary.facts.oil.qualifier},generated_sentence:generatedSummary.sentence,lint:summaryLint,consistency_flags:summaryConsistency,bad_examples:badExampleChecks,samples:summarySamples},headline_checks:{count:headlines.length,views:headlines.reduce((sum,item)=>sum+item.views.length,0),definitions:Object.keys(lensDefinitions)},source_diversity:{total_links:allSources.length,counts_by_domain:domainCounts,snapshot_cards_by_domain:snapshotDomainCards},data_provider_and_licensing:providerLicensing,fact_cards:headlines.filter(item=>item.visual.type==="fact").map(item=>({headline:item.headline,source:item.visual.source,date:item.visual.as_of})),observations,warnings,failures};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/build-report.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length){console.error("Content policy validation failed:\n"+failures.map(item=>`- ${item}`).join("\n"));process.exit(1);}
console.log(`Content policy passed: ${headlines.length} headlines, ${observations.length} market values, and ${edition.calendar.length} calendar entries checked.`);
if(warnings.length)console.warn("Manual review warnings:\n"+warnings.map(item=>`- ${item}`).join("\n"));
