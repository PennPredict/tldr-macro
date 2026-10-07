import fs from "node:fs";
import path from "node:path";
import {badExamples,generateSummary,gradeLevel,lintSummary,summarySamples} from "../lib/edition-summary.mjs";

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
const globalItems=read("content/global-items.json");
const channelConfig=read("config/channel-lines.json");
const headlineVocabulary=read("config/headline-vocabulary.json");
const onelinerHistory=read("data/oneliner_history.json");
const headlineHistory=read("data/headline_history.json");
const allowed=new Set([...sourcePolicy.primary,...sourcePolicy.market_data,...sourcePolicy.company_evidence,...sourcePolicy.reporting,...sourcePolicy.approved_commentary]);
const failures=[];
const warnings=[];
const approved=host=>[...allowed].some(domain=>host===domain||host.endsWith(`.${domain}`));
const collect=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?collect(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const copyFiles=[...collect(path.join(root,"app")).filter(file=>/\.(tsx|ts)$/.test(file)),path.join(root,"content/current-edition.json"),path.join(root,"content/headlines.json"),path.join(root,"content/global-items.json")];

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

const required=["topic_tag","headline","commentary","defines","explains","views","sources","claims","headline_evidence"];
const stop=new Set(["the","a","an","and","or","to","of","in","for","with","while","can","may","is","are","that","this","when","from","more","less","their","same"]);
const words=text=>new Set(text.toLowerCase().match(/[a-z]+/g)?.filter(word=>word.length>3&&!stop.has(word))||[]);
const similarity=(a,b)=>{const one=words(a),two=words(b),shared=[...one].filter(word=>two.has(word)).length,total=new Set([...one,...two]).size;return total?shared/total:0;};
const sentenceCount=text=>(text.match(/[.!?]+(?=\s|$)/g)||[]).length;
const claimSentenceCount=text=>sentenceCount((text||"").replaceAll("U.S.","US").replaceAll("a.m.","AM").replaceAll("p.m.","PM"));
const checkClaims=(label,text,claims)=>{
  const count=claimSentenceCount(text),ledger=Array.isArray(claims)?claims:[];
  if(ledger.length!==count)failures.push(`${label}: ${count} sentences but ${ledger.length} claim-ledger entries`);
  const ids=new Set();let causes=0;
  for(const claim of ledger){if(!claim.sentence_id||!claim.type||!claim.evidence)failures.push(`${label}: claim entries require sentence_id, type, and evidence`);if(ids.has(claim.sentence_id))failures.push(`${label}: duplicate claim id ${claim.sentence_id}`);ids.add(claim.sentence_id);if(!["fact","mechanism","attributed_cause","interpretation"].includes(claim.type))failures.push(`${label}: invalid claim type ${claim.type}`);if(claim.type==="attributed_cause"&&!claim.attribution)failures.push(`${label}: attributed cause lacks attribution`);if(["attributed_cause","interpretation"].includes(claim.type))causes++;}
  if(causes>1)failures.push(`${label}: more than one cause or interpretation sentence`);
};
const causalPattern=/\b(supported|pressured|lifted|pushed|weighed on|drove|boosted|hurt|helped|fueled)\b/gi;
const checkCausality=(label,text,explains)=>{const matches=[...(text||"").matchAll(causalPattern)];const covered=(explains||[]).filter(item=>(text||"").includes(item.anchor_text)).length;const uncovered=Math.max(0,matches.length-covered);if(uncovered)warnings.push(`${label}: ${uncovered} causal verb${uncovered===1?"":"s"} may lack a matching explains entry`);if(uncovered>1)failures.push(`${label}: more than one causal verb lacks an explains entry`);};
const editionReference=new Date(edition.updated_at).getTime();
const wordCount=text=>(text||"").trim().split(/\s+/).filter(Boolean).length;
const normalized=text=>(text||"").toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim();
const tokenSet=text=>new Set(normalized(text).split(" ").filter(Boolean));
const tokenSimilarity=(a,b)=>{const one=tokenSet(a),two=tokenSet(b),shared=[...one].filter(token=>two.has(token)).length;return shared/Math.max(1,new Set([...one,...two]).size);};
const editDistance=(a,b)=>{a=normalized(a);b=normalized(b);const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let previous=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(a[i-1]===b[j-1]?0:1));previous=old;}}return row[b.length];};
const editSimilarity=(a,b)=>1-editDistance(a,b)/Math.max(1,normalized(a).length,normalized(b).length);
const generatedSummary=generateSummary(edition);
const summaryLint=lintSummary(edition.summary,generatedSummary.facts);
for(const failure of summaryLint.errors)failures.push(`Edition summary: ${failure}`);
for(const warning of summaryLint.warnings)warnings.push(`Edition summary: ${warning}`);
if(!Number.isInteger(snapshotConfig.chart_span_days)||snapshotConfig.chart_span_days<1)failures.push("Snapshot chart span must be a positive integer");
const historyRecent=onelinerHistory.filter(item=>item.date!==edition.edition_date).slice(-14).reverse();
const onelinerScores=historyRecent.map((item,index)=>({date:item.date,edit_similarity:Number(editSimilarity(edition.summary,item.final_sentence).toFixed(3)),token_similarity:Number(tokenSimilarity(edition.summary,item.final_sentence).toFixed(3)),first_four_match:normalized(edition.summary).split(" ").slice(0,4).join(" ")===normalized(item.final_sentence).split(" ").slice(0,4).join(" "),limit:index===0?.6:.75}));
for(const score of onelinerScores)if(Math.max(score.edit_similarity,score.token_similarity)>score.limit||score.first_four_match)failures.push(`Edition summary duplicates ${score.date}`);

const headlineVerbStem=word=>({rises:"rise",rose:"rise",falls:"fall",fell:"fall",climbs:"climb",climbed:"climb",gains:"gain",gained:"gain",drops:"drop",dropped:"drop",slips:"slip",slipped:"slip",jumps:"jump",jumped:"jump",arrives:"arrive",urges:"urge",clouds:"cloud"}[word]||word);
const actionWords=new Set(["rise","rises","rose","fall","falls","fell","climb","climbs","climbed","gain","gains","gained","drop","drops","dropped","slip","slips","slipped","jump","jumps","jumped","arrive","arrives","urge","urges","cloud","clouds"]);
const actionUse=new Map();
for(const title of [...headlines.map(item=>item.headline),...globalItems.filter(item=>item.tag!=="Company"&&item.qualifies!==false).map(item=>item.headline)])for(const word of title.toLowerCase().match(/[a-z]+/g)||[])if(actionWords.has(word)){const stem=headlineVerbStem(word),uses=actionUse.get(stem)||[];uses.push(title);actionUse.set(stem,uses)}
for(const [stem,titles] of actionUse)if(titles.length>1)failures.push(`Headline verb “${stem}” repeats across: ${titles.join(" | ")}`);

for(const headline of headlines){
  for(const field of required)if(headline[field]===null||headline[field]===undefined||headline[field]===""||(Array.isArray(headline[field])&&!headline[field].length))failures.push(`${headline.headline||headline.topic_tag||"Headline"}: missing ${field}`);
  const mapped=lensMapping[headline.topic_tag];
  if(!mapped)failures.push(`${headline.topic_tag}: no topic-to-view mapping`);
  if(headline.headline.length>60)failures.push(`${headline.headline}: headline exceeds 60 characters`);
  else if(headline.headline.length>40)warnings.push(`${headline.headline}: headline exceeds 40 characters`);
  if(wordCount(headline.headline)<2||wordCount(headline.headline)>6)failures.push(`${headline.headline}: headline must contain 2 to 6 words`);
  if(/[0-9%$]/.test(headline.headline))failures.push(`${headline.headline}: headline contains a number, price, or date`);
  for(const phrase of headlineVocabulary.banned)if(headline.headline.toLowerCase().includes(phrase))failures.push(`${headline.headline}: unanchored headline phrase “${phrase}”`);
  if(/\b(on|after|as|amid|because|despite|fears|hopes|bets)\b/i.test(headline.headline))failures.push(`${headline.headline}: causal or loaded connector in headline`);
  const commentarySentences=sentenceCount(headline.commentary||"");
  if(commentarySentences<2||commentarySentences>4)failures.push(`${headline.headline}: commentary must contain 2 to 4 sentences`);
  const commentaryWords=(headline.commentary||"").trim().split(/\s+/).filter(Boolean).length;
  if(commentaryWords>85)failures.push(`${headline.headline}: commentary exceeds 85 words`);
  if(gradeLevel(headline.commentary)>9)failures.push(`${headline.headline}: commentary reading grade exceeds 9 (${gradeLevel(headline.commentary)})`);
  checkClaims(`${headline.headline} commentary`,headline.commentary,headline.claims);
  if(!Array.isArray(headline.defines)||!headline.defines.length)failures.push(`${headline.headline}: at least one definition is required`);
  for(const definition of headline.defines||[]){
    if(!definition.term||!definition.definition||!definition.used_by_and_why)failures.push(`${headline.headline}: definition entries require term, definition, and used_by_and_why`);
    else if(!(headline.commentary||"").toLowerCase().includes(definition.term.toLowerCase()))failures.push(`${headline.headline}: defined term “${definition.term}” does not appear in commentary`);
    else if(normalized(headline.commentary).includes(normalized(definition.definition))||similarity(headline.commentary,`${definition.definition} ${definition.used_by_and_why}`)>=.55)failures.push(`${headline.headline}: popup for “${definition.term}” duplicates nearby commentary`);
  }
  if(headline.visual)for(const field of ["type","title","as_of","source","caption","alt"])if(headline.visual?.[field]===null||headline.visual?.[field]===undefined||headline.visual?.[field]==="")failures.push(`${headline.headline}: visual is missing ${field}`);
  if(headline.visual&&!["transmission","context","fact"].includes(headline.visual?.type))failures.push(`${headline.headline}: visual type must be transmission, context, or fact`);
  if(headline.visual?.type!=="fact"&&headline.visual&&!headline.visual?.data&&!headline.visual?.nodes)failures.push(`${headline.headline}: non-fact visual requires data or nodes`);
  if(headline.visual?.type==="fact"){if(!headline.visual.fact_text)failures.push(`${headline.headline}: fact visual requires fact_text`);warnings.push(`${headline.headline}: fact card requires manual review before publish`);}
  if(similarity(headline.visual?.caption||"",headline.commentary||"")>=.5)failures.push(`${headline.headline}: visual caption duplicates the commentary`);
  if(wordCount(headline.visual?.title)>5)failures.push(`${headline.headline}: visual title exceeds 5 words`);
  if(headline.visual?.type==="context"&&wordCount(headline.visual?.caption)>8)failures.push(`${headline.headline}: chart caption exceeds 8 words`);
  for(const value of Object.values(headline.visual?.data||{}))if(Array.isArray(value))for(const label of value)if(typeof label==="string"&&wordCount(label)>3)failures.push(`${headline.headline}: visual label “${label}” exceeds 3 words`);
  if(headline.visual?.nodes){if(headline.visual.nodes.length<3)failures.push(`${headline.headline}: visual has fewer than 3 nodes`);for(const node of headline.visual.nodes){if(wordCount(node.label)>3)failures.push(`${headline.headline}: visual node label exceeds 3 words`);if(!node.source||!node.as_of)failures.push(`${headline.headline}: visual node needs source and date`);}}
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
    checkClaims(`${headline.headline} / ${view.view_id}`,view.body,view.claims);
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
  if(gradeLevel(market.description)>8)failures.push(`${market.name}: snapshot description reading grade exceeds 8 (${gradeLevel(market.description)})`);
  checkClaims(`${market.name} description`,market.description,market.claims);
  if(!market.baseline||!['prior_close','yesterday_reading'].includes(market.baseline))failures.push(`${market.name}: baseline must match prior_close or yesterday_reading`);
  const marketHosts=(market.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""));
  if(!marketHosts.some(host=>[...sourcePolicy.primary,...sourcePolicy.market_data].some(domain=>host===domain||host.endsWith(`.${domain}`))))failures.push(`${market.name}: at least one source must be primary or official`);
  if(marketHosts.filter(host=>sourcePolicy.reporting.some(domain=>host===domain||host.endsWith(`.${domain}`))).length>1)failures.push(`${market.name}: no more than one news outlet is allowed`);
  for(const source of market.sources||[])allSources.push({card:market.name,...source});
  for(const explain of market.explains||[])if(!explain.anchor_text||!explain.why||!explain.other_reading)failures.push(`${market.name}: explanation entries require anchor_text, why, and other_reading`);
  checkCausality(market.name,market.description,market.explains);
  if(!market.so_what?.channel_id||!channelConfig.lines[market.so_what.channel_id])failures.push(`${market.name}: missing or unknown So-what channel_id`);
  if(wordCount(`${channelConfig.lines[market.so_what?.channel_id]?.channel_line||""} ${market.so_what?.context?.text||""}`)>40)failures.push(`${market.name}: So-what exceeds 40 words`);
  if(/\b(because|due to|driven by|caused|thanks to|led to|as a result of)\b/i.test(market.so_what?.context?.text||""))failures.push(`${market.name}: banned So-what connector`);
  if(market.so_what?.context?.type==="attributed"&&!market.so_what.context.source_url)failures.push(`${market.name}: attributed So-what lacks source_url`);
  observations.push({name:market.name,value:market.value,prior_close:market.prior_close,change_percent:market.change_percent,source:market.data_source,source_url:market.sources?.[0]?.href,fetched_at:market.fetched_at,age_minutes:Math.max(0,Math.round(ageMinutes)),status:"checked"});
}
const visibleNames=edition.markets.map(item=>item.name==="Gold futures"?"Gold":item.name==="Expected volatility"?"Expected volatility (VIX)":item.name);
const renderedNames=[...visibleNames].sort((a,b)=>snapshotConfig.priority_order.indexOf(a)-snapshotConfig.priority_order.indexOf(b));
if(JSON.stringify(renderedNames)!==JSON.stringify(snapshotConfig.priority_order))failures.push(`Snapshot order must match config: ${snapshotConfig.priority_order.join(", ")}`);
const extraProviderReport=[];
for(const market of extraMarkets){if(market.available===false)continue;if(sentenceCount(market.description)>3||wordCount(market.description)>50)failures.push(`${market.name}: extra-market description must be at most 3 sentences and 50 words`);if(!market.data_provider||!market.licensing_note)failures.push(`${market.name}: provider and licensing note are required`);if(!(market.sources||[]).length)failures.push(`${market.name}: primary source is required`);if(!market.points||market.points.length<2)failures.push(`${market.name}: visible extra markets require a trendline`);const channel=Object.values(channelConfig.lines).find(item=>item.instrument===market.name);if(!channel)failures.push(`${market.name}: missing So-what channel line`);extraProviderReport.push({name:market.name,current_provider:market.data_provider,historical_provider:market.points?.length?market.data_provider:"No historical series published",licensing_note:market.licensing_note});}
let companyItems=0;
for(const item of globalItems){
  if(!["Conflict","Policy","Trade","Global markets","Energy","Company"].includes(item.tag))failures.push(`${item.headline}: invalid TL;DR Global tag`);
  if(wordCount(item.headline)>6||item.headline.length>60)failures.push(`${item.headline}: TL;DR Global headline exceeds headline limits`);
  if(/[0-9%$]/.test(item.headline))failures.push(`${item.headline}: TL;DR Global headline contains a number`);
  if(wordCount(`${item.what} ${item.context||""} ${item.why_it_matters}`)>55)failures.push(`${item.headline}: TL;DR Global body exceeds 55 words`);
  if(!item.why_it_matters?.startsWith("Why it matters:"))failures.push(`${item.headline}: missing Why it matters line`);
  if(!Array.isArray(item.sources)||item.sources.length<2)failures.push(`${item.headline}: TL;DR Global needs at least two sources`);
  if(!(item.sources||[]).some(source=>["wire","primary"].includes(source.type)))failures.push(`${item.headline}: TL;DR Global needs a wire or primary source`);
  if(item.tag==="Company")companyItems++;
  if(["Conflict","Policy"].includes(item.tag)&&item.needs_human_check!==true)failures.push(`${item.headline}: conflict and policy items need human check`);
  for(const source of item.sources||[])allSources.push({card:item.headline,...source});
}
if(companyItems>1)failures.push("TL;DR Global includes more than one company item");
for(const headline of headlines)for(const source of headline.sources||[])allSources.push({card:headline.headline,...source});
const domainCounts={};for(const source of allSources){const host=new URL(source.href).hostname.replace(/^www\./,"");domainCounts[host]=(domainCounts[host]||0)+1;}
for(const [domain,count] of Object.entries(domainCounts))if(count/allSources.length>.25)failures.push(`Source diversity: ${domain} accounts for ${count} of ${allSources.length} links, above 25%`);
const snapshotDomainCards={};for(const market of edition.markets)for(const domain of new Set((market.sources||[]).map(source=>new URL(source.href).hostname.replace(/^www\./,""))))snapshotDomainCards[domain]=(snapshotDomainCards[domain]||0)+1;
for(const [domain,count] of Object.entries(snapshotDomainCards))if(count>2)failures.push(`Snapshot diversity: ${domain} appears on ${count} cards, above 2`);
for(const term of terms){if(!term.id||!term.surface_forms?.length||!term.type||!term.definition||!term.used_by_and_why)failures.push(`Terms file: ${term.id||"unnamed term"} has an empty required field`);if(term.type==="also_called"&&!term.also_called?.length)failures.push(`Terms file: ${term.id} needs also_called entries`);}
if(edition.calendar.length<3||edition.calendar.length>5)failures.push(`Upcoming calendar must contain 3 to 5 events; found ${edition.calendar.length}`);
let previousEventTime=0;
for(const event of edition.calendar){
  if(!event.time||!event.href||!event.hot_label||!event.cool_label)failures.push(`${event.title}: incomplete calendar metadata`);
  if(!/\b(?:AM|PM) ET\b/.test(event.time))failures.push(`${event.title}: time must use AM or PM followed by ET`);
  if(!event.start_at)failures.push(`${event.title}: missing exact start_at timestamp`);
  else {const eventTime=new Date(event.start_at).getTime();if(eventTime<=editionReference)failures.push(`${event.title}: released events cannot appear in Next on TL;DRM`);if(eventTime<previousEventTime)failures.push(`${event.title}: calendar is not chronological`);previousEventTime=eventTime;}
}
const renderedCopy=[...copyFiles.map(file=>fs.readFileSync(file,"utf8")),JSON.stringify(extraMarkets)].join("\n");
for(const token of [/\bverify\b/i,/\bTODO\b/i,/\bTBD\b/i,/\bplaceholder\b/i,/not listed/i,/\bN\/A\b/i])if(token.test(renderedCopy))failures.push(`Rendered copy contains prohibited placeholder text matching ${token}`);
const brandCorpus=renderedCopy.replaceAll("Next on TL;DRM","").replaceAll("TLDRM","");
for(const token of [/TL;DRM/i,/TLDR Macro/i])if(token.test(brandCorpus))failures.push(`Brand copy contains prohibited form matching ${token}`);
if(/\b(?:EDT|EST)\b/.test(renderedCopy))failures.push("Rendered copy contains EDT or EST instead of ET");
const pressureCount=(renderedCopy.match(/\bpressure\b/gi)||[]).length,easedCount=(renderedCopy.match(/\beased\b/gi)||[]).length;
if(pressureCount>2)failures.push(`Rendered copy uses pressure ${pressureCount} times; maximum is 2`);
if(easedCount>2)failures.push(`Rendered copy uses eased ${easedCount} times; maximum is 2`);

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
const headlineSamples=[
  {case:"flat",headline:"Stocks hold steady",evidence:"+0.10%",rule:"under 0.15%"},
  {case:"big up",headline:"Stocks jump",evidence:"+1.8%",rule:"over 1.5%"},
  {case:"big down",headline:"Oil drops",evidence:"−2.1%",rule:"over 1.5%"},
  {case:"near record",headline:"Stocks hold near records",evidence:"0.4% below closing high",rule:"within 1% flag"},
  {case:"streak",headline:"Oil keeps rising",evidence:"four prior gains",rule:"streak at least 3"},
  {case:"mixed",headline:"Markets look mixed",evidence:"stocks up; oil down; rates flat",rule:"mixed directions"},
  {case:"rates up",headline:"Borrowing rates rise",evidence:"+8 basis points",rule:"6–15 basis points"},
  {case:"jobs cooled",headline:"Hiring cools",evidence:"below prior and recent average",rule:"cooling flags"},
  {case:"company deal",headline:"Google signs power deal",evidence:"company filing",rule:"plain event"},
  {case:"ongoing conflict",headline:"Iran conflict continues",evidence:"two current sources",rule:"plain event; developing"}
];
const rejectedHeadlineSamples=[
  {headline:"Stocks stay strong",reason:"unanchored strong; direction conflict on a down day"},
  {headline:"Oil jumps on war fears",reason:"cause and loaded wording"},
  {headline:"S&P 500 falls 0.5%",reason:"number and technical index name"},
  {headline:"Oil keeps rising",reason:"streak phrase without a three-close streak flag"}
];
const report={generated_at:new Date().toISOString(),edition_date:edition.edition_date,policy_version:sourcePolicy.policy_version,status:failures.length?"failed":"passed",freshness_limit_minutes:integrity.freshness_minutes,calendar_last_verified:integrity.calendar_last_verified,copy_counts:{pressure:pressureCount,eased:easedCount},claim_ledger:{headline_claims:headlines.reduce((sum,item)=>sum+item.claims.length,0),view_claims:headlines.reduce((sum,item)=>sum+item.views.reduce((inner,view)=>inner+view.claims.length,0),0),market_claims:edition.markets.reduce((sum,item)=>sum+(item.claims?.length||0),0)},snapshot_checks:{summary_words:wordCount(edition.summary),summary_characters:edition.summary.length,priority_order:renderedNames,chart_span_days:snapshotConfig.chart_span_days,axis_labels:2,so_what:edition.markets.map(item=>({name:item.name,...item.so_what}))},edition_summary:{facts:generatedSummary.facts,generated_sentence:generatedSummary.sentence,lint:summaryLint,similarity_scores:onelinerScores,retries:0,consistency_flags:summaryConsistency,bad_examples:badExampleChecks,samples:summarySamples},headline_checks:{count:headlines.length,items:headlines.map(item=>({headline:item.headline,evidence:item.headline_evidence,visual_gate:item.visual?.gate_results||item.visual_gate})),samples:headlineSamples,rejected_samples:rejectedHeadlineSamples,history_count:headlineHistory.length,views:headlines.reduce((sum,item)=>sum+item.views.length,0),definitions:Object.keys(lensDefinitions)},global_items:globalItems.map(item=>({headline:item.headline,sources:item.sources,needs_human_check:item.needs_human_check})),source_diversity:{total_links:allSources.length,counts_by_domain:domainCounts,snapshot_cards_by_domain:snapshotDomainCards},data_provider_and_licensing:providerLicensing,fact_cards:headlines.filter(item=>item.visual?.type==="fact").map(item=>({headline:item.headline,source:item.visual.source,date:item.visual.as_of})),observations,warnings,failures};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/build-report.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length){console.error("Content policy validation failed:\n"+failures.map(item=>`- ${item}`).join("\n"));process.exit(1);}
console.log(`Content policy passed: ${headlines.length} headlines, ${observations.length} market values, and ${edition.calendar.length} calendar entries checked.`);
if(warnings.length)console.warn("Manual review warnings:\n"+warnings.map(item=>`- ${item}`).join("\n"));
