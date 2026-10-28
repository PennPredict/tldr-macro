import config from "../config/hero.json" with {type:"json"};
import summaryConfig from "../config/edition-summary.json" with {type:"json"};

const wordCount=text=>(text.match(/[A-Za-z0-9%]+/g)||[]).length;
const bucket=(change,limits)=>{const size=Math.abs(change);if(size<limits[0])return "flat";if(size<limits[1])return change>0?"small_up":"small_down";if(size<limits[2])return change>0?"medium_up":"medium_down";return change>0?"large_up":"large_down";};
const cleanTime=value=>value?.replace(/^0/,"")||"";

export function generateHeroCopy(edition){
  const oil=edition.markets.find(item=>item.name==="Brent crude oil");
  const stocks=edition.markets.find(item=>item.name==="S&P 500");
  const nextEvent=edition.calendar.find(item=>item.start_at&&new Date(item.start_at)>new Date(edition.updated_at));
  if(!oil||!stocks)throw new Error("Hero requires the Brent and S&P 500 registry entries");
  const oilBucket=bucket(oil.change_percent,summaryConfig.thresholds.oil_percent);
  const stockBucket=bucket(stocks.change_percent,summaryConfig.thresholds.stocks_percent);
  const eventIsFed=/Federal Reserve/i.test(nextEvent?.title||"");
  const headline=eventIsFed?`Oil ${config.directions[oilBucket]} before Fed decision`:`Oil ${config.directions[oilBucket]}; stocks ${config.directions[stockBucket]}`;
  const oilVerb=oil.change_percent>0?"rose":oil.change_percent<0?"fell":"held steady";
  const first=`Brent ${oilVerb} in early trading.`;
  const second=eventIsFed?`The Fed decides at ${cleanTime(nextEvent.time)}.`:`Stocks ${config.directions[stockBucket]}.`;
  const summary=`${first} ${second}`;
  const errors=[];
  if(wordCount(headline)>config.headline_max_words)errors.push(`Hero headline exceeds ${config.headline_max_words} words`);
  if(wordCount(summary)>config.summary_max_words)errors.push(`Hero summary exceeds ${config.summary_max_words} words`);
  if(/\b(positive|negative|because|driven by|signals?|shows that)\b/i.test(`${headline} ${summary}`))errors.push("Hero contains banned causal or directional judgment wording");
  return {headline,summary,lead_asset:oil.name,lead_bucket:oilBucket,words:{headline:wordCount(headline),summary:wordCount(summary)},claims:[{sentence:first,source_urls:oil.sources.map(source=>source.href)},{sentence:second,source_urls:[nextEvent?.href].filter(Boolean)}],errors};
}
