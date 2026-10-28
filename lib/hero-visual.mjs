import summaryConfig from "../config/edition-summary.json" with {type:"json"};

const direction=value=>value>0?"up":value<0?"down":"flat";
const bucket=(change,limits)=>{const size=Math.abs(change);if(size<limits[0])return "flat";if(size<limits[1])return change>0?"small_up":"small_down";if(size<limits[2])return change>0?"medium_up":"medium_down";return change>0?"large_up":"large_down"};
const dayKey=value=>new Date(value).toISOString().slice(0,10);

export function heroSeriesGate(market,edition,expectedBucket){
  const reasons=[],dates=market?.series_dates||[],points=market?.points||[],keys=dates.map(dayKey);
  if(!market)reasons.push("lead asset missing");
  if(points.length<20)reasons.push("fewer than 20 observations");
  if(dates.length!==points.length)reasons.push("point/date count mismatch");
  if(new Set(keys).size!==keys.length)reasons.push("duplicate observation dates");
  if(dates.some(value=>{const day=new Date(value).getUTCDay();return day===0||day===6}))reasons.push("weekend observation");
  if(points.some((value,index)=>index>0&&index<points.length-1&&value===points[index-1]))reasons.push("repeated daily close suggests forward fill");
  if(!points.slice(0,-1).some(value=>Math.abs(value-market.prior_close)<.011))reasons.push("prior close absent from series");
  if(Math.abs((points.at(-1)??NaN)-market.value)>.011)reasons.push("last point differs from displayed value");
  const lastMove=(points.at(-1)??0)-(points.at(-2)??0);if(points.length>1&&direction(lastMove)!==direction(market.change_percent))reasons.push("last segment direction differs from badge sign");
  const age=(new Date(edition.updated_at)-new Date(market?.fetched_at))/60000;if(!Number.isFinite(age)||age<0||age>10)reasons.push("freshness gate failed");
  if((market?.outlier_flags||[]).length)reasons.push("outlier flag present");
  const limits=market?.kind==="yield"?summaryConfig.thresholds.yield_basis_points:market?.kind==="commodity"?summaryConfig.thresholds.oil_percent:summaryConfig.thresholds.stocks_percent;
  const move=market?.kind==="yield"?(market.value-market.prior_close)*100:market?.change_percent;
  if(expectedBucket&&bucket(move,limits)!==expectedBucket)reasons.push("headline verb bucket differs from chart change");
  return {passed:reasons.length===0,reasons,points,dates};
}

export function buildHeroVisual(edition,hero,requested="chart"){
  const lead=edition.markets.find(item=>item.name===hero.lead_asset)||edition.markets.find(item=>item.name==="S&P 500"),gate=heroSeriesGate(lead,edition,hero.lead_bucket);
  const rendered=requested==="chart"?(gate.passed?"chart":"mark"):requested;
  return {requested,rendered,lead,gate,edition_date:edition.edition_date};
}
