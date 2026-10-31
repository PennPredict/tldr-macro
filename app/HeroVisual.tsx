"use client";
import {useState,useSyncExternalStore} from "react";

type Choice="image"|"chart"|"mark"|"logo"|"none";
type HeroMarket={name:string;kind?:string;value:number;display_value:string;prior_close:number;change_percent:number;display_change:string;points:number[];series_dates:string[];fetched_at:string};
type HeroModel={requested:string;rendered:string;lead:HeroMarket;gate:{passed:boolean;reasons:string[];points:number[];dates:string[]};edition_date:string};
const valid=(value:string|null):value is Choice=>["image","chart","mark","logo","none"].includes(value||"");
const fmtDate=(value:string)=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"America/New_York"}).format(new Date(value));
const Mark=()=> <svg className="hero-mark" viewBox="0 0 180 74" role="img" aria-label="TL;DR Macro converging-lines mark"><path className="hero-mark-sky" d="M4 18 28 4l22 18 24-12 30 25 72 2"/><path className="hero-mark-mint" d="M4 38 28 25l22 11 25-20 29 21 72 0"/><path className="hero-mark-blue" d="M4 58 29 43l22 14 24-12 29-8 72 0"/></svg>;

function Chart({model}:{model:HeroModel}){
  const market=model.lead,points=market.points,dates=market.series_dates,[active,setActive]=useState<number|null>(null),width=500,height=300,left=24,right=18,top=78,bottom=43,min=Math.min(...points,market.prior_close),max=Math.max(...points,market.prior_close),spread=max-min||1,x=(index:number)=>left+index*((width-left-right)/(points.length-1)),y=(value:number)=>top+((max-value)/spread)*(height-top-bottom),path=points.map((value,index)=>`${index?"L":"M"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(" "),last=points.length-1,move=market.change_percent>0?"up":market.change_percent<0?"down":"flat",symbol=move==="up"?"▲":move==="down"?"▼":"●",change=market.kind==="yield"?`${(market.value-market.prior_close).toFixed(2)} points`:`${market.change_percent>0?"+":""}${market.change_percent.toFixed(1)}%`,caption=`${market.name.replace(/ oil$/i,"")}, last 30 trading days`,aria=`${market.name}, last 30 trading days, ended at ${market.display_value}, ${move} ${Math.abs(market.change_percent).toFixed(1)}% from prior close.`;
  const tip=active===null?null:{x:x(active),y:y(points[active]),date:fmtDate(dates[active]),value:points[active]};
  return <div className="hero-chart" role="img" aria-label={aria}>
    <div className="hero-chart-readout"><span>{market.name}</span><strong>{market.display_value}</strong><b data-direction={move}>{symbol} {change}</b></div>
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true"><path className="hero-grid" d={`M${left} ${top+55}H${width-right}M${left} ${top+120}H${width-right}`}/><path className="hero-prior" d={`M${left} ${y(market.prior_close)}H${width-right}`}/><text className="hero-prior-label" x={left} y={Math.max(top+12,y(market.prior_close)-6)}>Prior close</text><path className="hero-series" d={path}/><circle className="hero-final" data-direction={move} cx={x(last)} cy={y(points[last])} r="4"/>{points.map((value,index)=><circle className="hero-focus-point" key={dates[index]} cx={x(index)} cy={y(value)} r="8" tabIndex={0} onFocus={()=>setActive(index)} onBlur={()=>setActive(null)} onPointerEnter={()=>setActive(index)} onPointerLeave={()=>setActive(null)}/>)}{tip?<g className="hero-tip" transform={`translate(${Math.min(width-130,Math.max(12,tip.x-55))} ${Math.max(112,tip.y-45)})`}><rect width="118" height="34" rx="4"/><text x="7" y="13">{tip.date}</text><text x="7" y="27">{market.kind==="commodity"?`$${tip.value.toFixed(2)}`:tip.value.toFixed(2)}</text></g>:null}<text className="hero-axis-label" x={left} y={height-12}>{fmtDate(dates[0])}</text><text className="hero-axis-label" textAnchor="end" x={width-right} y={height-12}>Now</text></svg>
    <p>{caption}</p><table className="sr-only"><caption>{aria}</caption><tbody>{points.map((value,index)=><tr key={dates[index]}><th>{fmtDate(dates[index])}</th><td>{value}</td></tr>)}</tbody></table>
  </div>
}

export default function HeroVisual({model}:{model:HeroModel}){
  const choice=useSyncExternalStore(()=>()=>{},()=>{const value=new URLSearchParams(window.location.search).get("heroVisual");return valid(value)?value:model.requested as Choice},()=>model.requested as Choice),rendered=choice==="chart"?(model.gate.passed?"chart":"mark"):choice;
  if(rendered==="none")return null;
  return <div className="brief-visual" data-requested-visual={choice} data-rendered-visual={rendered}>{rendered==="chart"?<Chart model={model}/>:rendered==="image"?<img className="hero-art" src="./waves-converging-into-light.png" alt="Blue and mint market waves converging into a single line of light." width="1774" height="887" fetchPriority="high"/>:rendered==="logo"?<img src="./tldr-macro-logo-wide.png" alt="TL;DR Macro. Market intelligence, for everyone." width="2172" height="724"/>:<Mark/>}</div>;
}
