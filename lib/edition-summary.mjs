import config from "../config/edition-summary.json" with {type:"json"};
import thread from "../content/economic-thread.json" with {type:"json"};
import threadConfig from "../config/thread.json" with {type:"json"};

const required={stocks:"S&P 500",rates:"10-year Treasury yield",oil:"Brent crude oil"};
const get=(markets,name)=>markets.find(item=>item.name===name);
const bucket=(change,limits)=>{const size=Math.abs(change);if(size<limits[0])return "flat";if(size<limits[1])return change>0?"small_up":"small_down";if(size<limits[2])return change>0?"medium_up":"medium_down";return change>0?"large_up":"large_down";};
const directionOf=name=>name.endsWith("_up")?"up":name.endsWith("_down")?"down":"flat";
const phraseDays=days=>days>=10&&days<=14?"two weeks":days>=5&&days<=7?"a week":`${days} days`;

function deriveContext(market,bucketName,{stocks=false}={}){
  const context=market.summary_context||{},move=directionOf(bucketName);
  const record=stocks?(market.set_record===true?"at":Number.isFinite(market.all_time_closing_high)&&market.value<=market.all_time_closing_high&&((market.all_time_closing_high-market.value)/market.all_time_closing_high)*100<=config.record_distance_percent?"near":null):null;
  const streak=Number.isInteger(context.prior_streak_length)&&context.prior_streak_length>=config.qualifiers.streak_min?{length:context.prior_streak_length,direction:context.prior_streak_direction}:null;
  const firstIn=Number.isInteger(context.first_in_days)&&context.first_in_days>=config.qualifiers.first_in_min_days?{days:context.first_in_days,direction:context.first_in_direction}:null;
  const range=["one_month_high","one_month_low","three_month_high","three_month_low"].includes(context.range_position)?context.range_position:null;
  return {record,streak,first_in:firstIn,range_position:range,move};
}

function chooseQualifier(item,{stocks=false}={}){
  if(stocks&&item.record)return {type:"record",value:item.record,text:item.record==="at"?"at a record high":"just below a record high"};
  if(item.streak){
    if(item.move!=="flat"&&item.move===item.streak.direction)return {type:"streak",length:item.streak.length,direction:item.streak.direction,text:`after ${item.streak.length} straight ${item.streak.direction==="up"?"gains":"declines"}`};
    if(item.move!=="flat")return {type:"streak_reversal",length:item.streak.length,direction:item.streak.direction,text:item.streak.direction==="up"?`ending a ${item.streak.length}-day winning streak`:`ending a ${item.streak.length}-day slide`};
  }
  if(item.first_in&&item.move!=="flat"&&item.first_in.direction===item.move)return {type:"first_in",days:item.first_in.days,direction:item.first_in.direction,text:`the first ${item.move==="up"?"rise":"drop"} in ${phraseDays(item.first_in.days)}`};
  if(item.range_position){const parts=item.range_position.split("_");return {type:"range",window:`${parts[0]}_${parts[1]}`,side:parts[2],text:`a ${parts[0]}-${parts[1]} ${parts[2]}`};}
  if(item.bucket.startsWith("small_"))return {type:"size",bucket:item.bucket,text:"slightly"};
  if(item.bucket.startsWith("large_"))return {type:"size",bucket:item.bucket,text:"sharply"};
  return null;
}

export function buildSummaryFacts(edition){
  const stocks=get(edition.markets,required.stocks),rates=get(edition.markets,required.rates),oil=get(edition.markets,required.oil);
  if(!stocks||!rates||!oil)throw new Error("Summary requires S&P 500, 10-year Treasury yield, and Brent crude oil snapshot cards");
  const yieldBasisPoints=Number(((rates.value-rates.prior_close)*100).toFixed(2));
  const stockBucket=bucket(stocks.change_percent,config.thresholds.stocks_percent),rateBucket=bucket(yieldBasisPoints,config.thresholds.yield_basis_points),oilBucket=bucket(oil.change_percent,config.thresholds.oil_percent);
  const releaseNode=thread.nodes.find(node=>node.id==="cpi-release"),release=threadConfig.enabled&&releaseNode?.event_time?.slice(0,10)===edition.edition_date?releaseNode:null,nasdaq=get(edition.markets,"Nasdaq Composite");
  const releaseKind=release?.source_url?.includes("/ppi_")?"Wholesale prices":"Prices";
  const facts={edition_date:edition.edition_date,
    stocks:{name:stocks.name,value:stocks.value,change_percent:stocks.change_percent,bucket:stockBucket,...deriveContext(stocks,stockBucket,{stocks:true})},
    rates:{name:rates.name,value:rates.value,change_basis_points:yieldBasisPoints,bucket:rateBucket,...deriveContext(rates,rateBucket)},
    oil:{name:oil.name,value:oil.value,change_percent:oil.change_percent,bucket:oilBucket,...deriveContext(oil,oilBucket)},
    release:release?{label:`${releaseKind} rose ${release.value.match(/[+-]?\d+(?:\.\d+)?%/)?.[0]?.replace(/^\+/,"")||""} in ${release.reference_period.split(/\s+/)[0]}`,source_url:release.source_url}:null,
    nasdaq:nasdaq?{name:nasdaq.name,value:nasdaq.value,change_percent:nasdaq.change_percent,bucket:bucket(nasdaq.change_percent,config.thresholds.stocks_percent)}:null};
  facts.stocks.qualifier=chooseQualifier(facts.stocks,{stocks:true});facts.rates.qualifier=chooseQualifier(facts.rates);facts.oil.qualifier=chooseQualifier(facts.oil);
  return facts;
}

export function generateSummaryFromFacts(facts){
  const verbs={flat:"held steady",small_up:"edged up",small_down:"slipped",medium_up:"rose",medium_down:"fell",large_up:"jumped",large_down:"dropped"};
  if(facts.release&&facts.nasdaq)return `${facts.release.label.replace(/[.!?]+$/,"")}; government borrowing rates ${verbs[facts.rates.bucket]}; Nasdaq ${verbs[facts.nasdaq.bucket]}.`;
  return `Shares ${verbs[facts.stocks.bucket]}; Treasury yields ${verbs[facts.rates.bucket]}; crude oil ${verbs[facts.oil.bucket]}.`;
}

export function generateSummary(edition){const facts=buildSummaryFacts(edition);return {facts,sentence:generateSummaryFromFacts(facts)};}
const syllables=word=>{const clean=word.toLowerCase().replace(/[^a-z]/g,"");if(!clean)return 0;if(clean.length<=3)return 1;const reduced=clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,"").replace(/^y/,"");return Math.max(1,(reduced.match(/[aeiouy]{1,2}/g)||[]).length);};
export function gradeLevel(text){const words=text.match(/[A-Za-z]+/g)||[],sentences=Math.max(1,(text.match(/[.!?]+/g)||[]).length),count=words.reduce((sum,word)=>sum+syllables(word),0);return Number((0.39*(words.length/sentences)+11.8*(count/words.length)-15.59).toFixed(1));}
const causal=/\b(because|amid|driven by|thanks to|on account of|as a result of)\b/i;
export function lintSummary(sentence,facts){const errors=[],warnings=[],lower=sentence.toLowerCase(),expected=generateSummaryFromFacts(facts),grade=gradeLevel(sentence);if(sentence!==expected)errors.push("Unsupported or mismatched claim: summary must equal the checked template output");for(const phrase of config.banned)if(lower.includes(phrase))errors.push(`Banned summary wording: ${phrase}`);const count=(sentence.match(/[.!?]+(?=\s|$)/g)||[]).length;if(count<1||count>2)errors.push("Summary must contain one or two sentences");if(sentence.length>260)errors.push(`Summary exceeds 260 characters (${sentence.length})`);else if(sentence.length>220)warnings.push(`Summary exceeds 220 characters (${sentence.length})`);if(grade>10)errors.push(`Summary reading grade exceeds 10 (${grade})`);if(causal.test(sentence))errors.push("Summary contains causal wording");const early=(lower.match(/\b(early|this morning)\b/g)||[]).length;if(early>1)errors.push("Morning timing may appear at most once");return {passed:errors.length===0,errors,warnings,characters:sentence.length,words:(sentence.match(/[A-Za-z0-9%]+/g)||[]).length,grade};}

export const badExamples={unsupported:"The stock market rose early to a one-month high, government borrowing rates fell, and oil prices dropped.",causal:"The stock market rose early because oil prices fell, while government borrowing rates slipped."};
const sample=(label,stocks,rates,oil)=>{const edition={edition_date:label,markets:[{name:required.stocks,...stocks},{name:required.rates,...rates},{name:required.oil,...oil}]};return {label,...generateSummary(edition)};};
export const summarySamples=[
  sample("strong streak",{value:103,prior_close:102,change_percent:.98,summary_context:{prior_streak_length:4,prior_streak_direction:"up"}},{value:4.02,prior_close:4,change_percent:.5},{value:81,prior_close:80,change_percent:1.25}),
  sample("record proximity",{value:100.5,prior_close:100.2,change_percent:.3,all_time_closing_high:101},{value:3.96,prior_close:4,change_percent:-1},{value:79.2,prior_close:80,change_percent:-1}),
  sample("reversal",{value:99,prior_close:100,change_percent:-1,summary_context:{prior_streak_length:5,prior_streak_direction:"up"}},{value:4,prior_close:4,change_percent:0},{value:80.3,prior_close:80,change_percent:.375,summary_context:{first_in_days:6,first_in_direction:"up"}}),
  sample("quiet day",{value:100.1,prior_close:100,change_percent:.1},{value:4.01,prior_close:4,change_percent:.25},{value:80.08,prior_close:80,change_percent:.1}),
  sample("mixed day",{value:101,prior_close:100,change_percent:1},{value:4.04,prior_close:4,change_percent:1},{value:78,prior_close:80,change_percent:-2.5,summary_context:{range_position:"three_month_low"}})
];
export {config as summaryConfig};
