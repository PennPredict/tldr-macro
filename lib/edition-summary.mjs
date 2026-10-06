import config from "../config/edition-summary.json" with {type:"json"};

const required={stocks:"S&P 500",rates:"10-year Treasury yield",oil:"Brent crude oil"};
const get=(markets,name)=>markets.find(item=>item.name===name);
const bucket=(change,limits)=>{const size=Math.abs(change);if(size<limits[0])return "flat";if(size<limits[1])return change>0?"small_up":"small_down";if(size<limits[2])return change>0?"medium_up":"medium_down";return change>0?"large_up":"large_down";};
const pick=(list,seed)=>list[Math.abs(seed)%list.length];
const seedFor=date=>[...String(date)].reduce((sum,char)=>sum+char.charCodeAt(0),0);
const direction=(bucketName,seed,plural=false)=>{const phrase=pick(config.vocabulary.directions[bucketName],seed);return plural&&phrase==="was little changed"?"were little changed":phrase;};

export function buildSummaryFacts(edition){
  const stocks=get(edition.markets,required.stocks),rates=get(edition.markets,required.rates),oil=get(edition.markets,required.oil);
  if(!stocks||!rates||!oil)throw new Error("Summary requires S&P 500, 10-year Treasury yield, and Brent crude oil snapshot cards");
  const yieldBasisPoints=Number(((rates.value-rates.prior_close)*100).toFixed(2));
  const distanceToRecord=Number.isFinite(stocks.all_time_closing_high)?((stocks.all_time_closing_high-stocks.value)/stocks.all_time_closing_high)*100:null;
  const stockRecord=stocks.set_record===true?"at":distanceToRecord!==null&&distanceToRecord>=0&&distanceToRecord<=config.record_distance_percent?"near":null;
  const candidates=edition.markets.filter(item=>Object.hasOwn(config.override_normal_daily_percent,item.name)&&Math.abs(item.change_percent)>2*config.override_normal_daily_percent[item.name]);
  const override=candidates.sort((a,b)=>Math.abs(b.change_percent/config.override_normal_daily_percent[b.name])-Math.abs(a.change_percent/config.override_normal_daily_percent[a.name]))[0];
  return {
    edition_date:edition.edition_date,
    stocks:{name:stocks.name,value:stocks.value,change_percent:stocks.change_percent,bucket:bucket(stocks.change_percent,config.thresholds.stocks_percent),record:stockRecord},
    rates:{name:rates.name,value:rates.value,change_basis_points:yieldBasisPoints,bucket:bucket(yieldBasisPoints,config.thresholds.yield_basis_points)},
    third:override?{name:override.name,value:override.value,change_percent:override.change_percent,bucket:bucket(override.change_percent,config.thresholds.oil_percent),override:true}:{name:oil.name,value:oil.value,change_percent:oil.change_percent,bucket:bucket(oil.change_percent,config.thresholds.oil_percent),override:false}
  };
}

export function generateSummaryFromFacts(facts){
  const seed=seedFor(facts.edition_date),stockVerb=direction(facts.stocks.bucket,seed),rateVerb=direction(facts.rates.bucket,seed+1,true),thirdVerb=direction(facts.third.bucket,seed+2,!facts.third.override);
  const record=facts.stocks.record==="at"?" at a record high":facts.stocks.record==="near"?" and stayed close to a record high":"";
  const thirdSubject=facts.third.override?facts.third.name.toLowerCase():config.vocabulary.oil;
  return `${config.vocabulary.stocks} ${stockVerb}${record}, ${config.vocabulary.rates} ${rateVerb}, and ${thirdSubject} ${thirdVerb}.`.replace(/^./,letter=>letter.toUpperCase());
}

export function generateSummary(edition){const facts=buildSummaryFacts(edition);return {facts,sentence:generateSummaryFromFacts(facts)};}

const syllables=word=>{const clean=word.toLowerCase().replace(/[^a-z]/g,"");if(!clean)return 0;if(clean.length<=3)return 1;const reduced=clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/," ").replace(/^y/,"");return Math.max(1,(reduced.match(/[aeiouy]{1,2}/g)||[]).length);};
export function gradeLevel(text){const words=text.match(/[A-Za-z]+/g)||[],sentences=Math.max(1,(text.match(/[.!?]+/g)||[]).length),count=words.reduce((sum,word)=>sum+syllables(word),0);return Number((0.39*(words.length/sentences)+11.8*(count/words.length)-15.59).toFixed(1));}
export function lintSummary(sentence,facts){
  const errors=[],warnings=[],lower=sentence.toLowerCase(),expected=generateSummaryFromFacts(facts),grade=gradeLevel(sentence);
  if(sentence!==expected)errors.push("Unsupported or mismatched claim: summary must equal the checked template output");
  for(const phrase of config.banned)if(lower.includes(phrase))errors.push(`Banned summary wording: ${phrase}`);
  if((sentence.match(/[.!?]+(?=\s|$)/g)||[]).length!==1)errors.push("Summary must be one sentence");
  if(sentence.length>200)errors.push(`Summary exceeds 200 characters (${sentence.length})`);else if(sentence.length>160)warnings.push(`Summary exceeds 160 characters (${sentence.length})`);
  if(grade>11)errors.push(`Summary reading grade exceeds 11 (${grade})`);else if(grade>9)warnings.push(`Summary reading grade exceeds 9 (${grade})`);
  if(/\brecord\b/i.test(sentence)&&!facts.stocks.record)errors.push("Record language lacks a validated record flag");
  return {passed:errors.length===0,errors,warnings,characters:sentence.length,words:(sentence.match(/[A-Za-z0-9%]+/g)||[]).length,grade};
}

export const badExample="Oil retreated and Treasury yields eased. Stocks approached records as lower cost pressure met strong profit expectations.";
const sample=(label,stocks,rates,oil)=>{const edition={edition_date:label,markets:[{name:required.stocks,...stocks},{name:required.rates,...rates},{name:required.oil,...oil}]};const generated=generateSummary(edition);return {label,...generated};};
export const summarySamples=[
  sample("flat",{value:100.1,prior_close:100,change_percent:.1},{value:4.01,prior_close:4,change_percent:.25},{value:80.08,prior_close:80,change_percent:.1}),
  sample("strong up",{value:102,prior_close:100,change_percent:2},{value:4.2,prior_close:4,change_percent:5},{value:82,prior_close:80,change_percent:2.5}),
  sample("strong down",{value:98,prior_close:100,change_percent:-2},{value:3.8,prior_close:4,change_percent:-5},{value:78,prior_close:80,change_percent:-2.5}),
  sample("near record",{value:100.5,prior_close:100.2,change_percent:.3,all_time_closing_high:101},{value:3.96,prior_close:4,change_percent:-1},{value:79.2,prior_close:80,change_percent:-1}),
  sample("mixed",{value:101,prior_close:100,change_percent:1},{value:4.04,prior_close:4,change_percent:1},{value:78,prior_close:80,change_percent:-2.5})
];

export {config as summaryConfig};
