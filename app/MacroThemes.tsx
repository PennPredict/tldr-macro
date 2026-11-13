"use client";
import {KeyboardEvent,useRef,useState} from "react";
import AnnotatedText from "./AnnotatedText";

type IndicatorConfig={id:string;label:string;role:string;move_threshold:number;source_url:string;unit:string};
type ThemeConfig={id:string;name:string;question:string;topics:string[];catalyst_tags:string[];why_it_matters:string;structural_note:{text:string;source_url:string;last_reviewed:string};indicators:IndicatorConfig[]};
type ThemeSettings={title:string;subtitle:string;themes:ThemeConfig[]};
type Observation={date:string;value:number};
type IndicatorState={id:string;value:number;previous:number;display_value:string;display_change:string;period:string;as_of:string;observations:Observation[]};
type Development={date:string;headline:string;line:string;source_urls:string[];origin:string;edition_id:string};
type ThemeState={last_new_evidence_date:string;developments:Development[];indicators:IndicatorState[]};
type StateFile={edition_id:string;themes:Record<string,ThemeState>};
type Event={title:string;start_at?:string;date:string;href:string;source:string};

const day=(value:string)=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"America/New_York"}).format(new Date(`${value.slice(0,10)}T12:00:00-05:00`));
const month=(value:string)=>new Intl.DateTimeFormat("en-US",{month:"short",year:"numeric",timeZone:"America/New_York"}).format(new Date(`${value.slice(0,10)}T12:00:00-05:00`));
const catalystAlias:Record<string,string[]>={cpi:["consumer price"],ppi:["producer price"],fomc:["federal reserve"],"retail-sales":["retail sales"],jobs:["jobs report","employment situation"],mortgage:["mortgage"]};
const eventMatches=(theme:ThemeConfig,event:Event)=>{const text=`${event.title} ${event.source}`.toLowerCase();return theme.catalyst_tags.some(tag=>(catalystAlias[tag]||[tag.replaceAll("-"," ")]).some(alias=>text.includes(alias)))};
const direction=(item:IndicatorState)=>item.value>item.previous?"▲":item.value<item.previous?"▼":"●";

function Sparkline({indicator,label}:{indicator:IndicatorState;label:string}){
  const values=indicator.observations.slice(-7);if(values.length<6)return null;
  const min=Math.min(...values.map(item=>item.value)),max=Math.max(...values.map(item=>item.value)),spread=max-min||1;
  const points=values.map((item,index)=>`${(index/(values.length-1)*92+4).toFixed(1)},${(26-(item.value-min)/spread*20).toFixed(1)}`).join(" ");
  return <><svg className="theme-sparkline" viewBox="0 0 100 30" role="img" aria-label={`${label}, six-month trend from ${values[0].value} to ${values.at(-1)!.value}`}><polyline points={points}/></svg><table className="sr-only"><caption>{label} observations</caption><tbody>{values.map(item=><tr key={item.date}><th>{item.date}</th><td>{item.value}</td></tr>)}</tbody></table></>;
}

function keyIndicator(theme:ThemeConfig,state:ThemeState){return theme.indicators.map(config=>({config,state:state.indicators.find(item=>item.id===config.id)})).find(item=>item.state&&item.config.role==="primary")||theme.indicators.map(config=>({config,state:state.indicators.find(item=>item.id===config.id)})).find(item=>item.state);}
function latestFact(theme:ThemeConfig,state:ThemeState,today:string){const development=state.developments.find(item=>item.date===today)||state.developments[0],indicator=keyIndicator(theme,state);if(development)return development.line;if(indicator?.state)return `${indicator.config.label}: ${indicator.state.display_value} for ${indicator.state.period} (${day(indicator.state.as_of)}).`;return "No dated development in the last 60 days.";}
function chip(theme:ThemeConfig,state:ThemeState,today:string,next?:Event){
  if(state.developments.some(item=>item.date===today&&item.origin!=="event"))return {kind:"new",text:"New today"};
  for(const config of theme.indicators.filter(item=>item.role==="primary")){const item=state.indicators.find(value=>value.id===config.id);if(item&&item.as_of===today&&item.previous&&Math.abs((item.value-item.previous)/Math.abs(item.previous)*100)>=config.move_threshold)return {kind:"moved",text:"Moved today"};}
  if(state.developments.some(item=>item.date===today&&/closed/i.test(item.headline)))return {kind:"closed",text:`Market closed · ${day(today)}`};
  if(next?.start_at){const days=Math.ceil((new Date(next.start_at).getTime()-new Date(`${today}T12:00:00-05:00`).getTime())/86400000);if(days>=0&&days<=3)return {kind:"due",text:`Data due · ${day(next.start_at)}`};}
  return {kind:"quiet",text:`No new data · ${day(state.last_new_evidence_date)}`};
}
function trend(item:IndicatorState){const values=item.observations.slice(-7);if(values.length<6)return null;const first=values[0],last=values.at(-1)!;return `${last.value>first.value?"Up":last.value<first.value?"Down":"Level"} from ${first.value} in ${month(first.date)} to ${last.value} in ${month(last.date)}.`;}

function ThemeDetails({theme,state,today}:{theme:ThemeConfig;state:ThemeState;today:string}){
  const indicators=theme.indicators.map(config=>({config,state:state.indicators.find(item=>item.id===config.id)})).filter(item=>item.state).slice(0,3) as {config:IndicatorConfig;state:IndicatorState}[];
  const sources=new Map<string,string>();state.developments.slice(0,4).forEach(item=>item.source_urls.forEach(url=>sources.set(url,new URL(url).hostname.replace(/^www\./,""))));indicators.forEach(item=>sources.set(item.config.source_url,item.config.label));
  return <div className="theme-panel-body"><section><h4>Developments</h4>{state.developments.slice(0,4).map(item=><div className="theme-development" key={`${item.date}-${item.headline}`}><time>{day(item.date)}</time><p>{item.date===today?<span className="theme-today-chip">Today</span>:null}<AnnotatedText text={item.line}/></p><a href={item.source_urls[0]} target="_blank" rel="noreferrer">Source ↗</a></div>)}</section>{indicators.length?<section><h4>Indicators</h4>{indicators.map(({config,state:item})=><div className="theme-indicator-detail" key={config.id}><div><strong>{config.label}</strong><span>{direction(item)} {item.display_value} · {item.display_change}</span><small>{item.period} · released {day(item.as_of)}</small></div><Sparkline indicator={item} label={config.label}/>{trend(item)?<p>{trend(item)}</p>:null}<a href={config.source_url} target="_blank" rel="noreferrer">{config.label} source ↗</a></div>)}</section>:null}<section className="theme-why"><h4>Why it matters</h4><p><AnnotatedText text={theme.why_it_matters}/></p></section><details className="theme-long-context"><summary>Longer-term context</summary><p>{theme.structural_note.text}</p><small>Reviewed {month(theme.structural_note.last_reviewed)} · <a href={theme.structural_note.source_url} target="_blank" rel="noreferrer">Source ↗</a></small></details>{sources.size?<p className="theme-sources"><strong>Sources</strong> {[...sources].map(([url,label],index)=><span key={url}>{index?" · ":""}<a href={url} target="_blank" rel="noreferrer">{label} ↗</a></span>)}</p>:null}</div>;
}

export default function MacroThemes({settings,state,events,storyTopics}:{settings:ThemeSettings;state:StateFile;events:Event[];storyTopics:string[]}){
  const[open,setOpen]=useState<string|null>(null),refs=useRef<(HTMLElement|null)[]>([]),today=state.edition_id;
  const onKey=(event:KeyboardEvent<HTMLElement>,index:number)=>{if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","Home","End"].includes(event.key))return;event.preventDefault();const count=settings.themes.length,next=event.key==="Home"?0:event.key==="End"?count-1:(index+(event.key==="ArrowRight"||event.key==="ArrowDown"?1:-1)+count)%count;refs.current[next]?.focus();};
  return <section className="macro-themes" id="themes" aria-labelledby="themes-title"><div className="section-heading"><h2 id="themes-title">{settings.title}</h2><p>{settings.subtitle}</p></div><div className="theme-grid" role="list">{settings.themes.map((theme,index)=>{const current=state.themes[theme.id],next=events.filter(event=>event.start_at&&new Date(event.start_at)>new Date(`${today}T23:59:59-05:00`)).find(event=>eventMatches(theme,event)),status=chip(theme,current,today,next),indicator=keyIndicator(theme,current),story=storyTopics.some(topic=>theme.topics.includes(topic)),expanded=open===theme.id;return <article className="theme-card" id={`theme-${theme.id}`} role="listitem" tabIndex={0} ref={node=>{refs.current[index]=node}} onKeyDown={event=>onKey(event,index)} key={theme.id}><div className="theme-card-head"><h3>{theme.name}</h3><span className={`theme-state theme-state-${status.kind}`}>{status.text}</span></div><p className="theme-question"><AnnotatedText text={theme.question}/></p><p className="theme-fact"><AnnotatedText text={latestFact(theme,current,today)}/></p>{indicator?.state?<div className="theme-key-indicator"><div><strong>{indicator.config.label}</strong><span>{direction(indicator.state)} {indicator.state.display_value}</span><small>{indicator.state.display_change} · {indicator.state.period} · {day(indicator.state.as_of)}</small></div><Sparkline indicator={indicator.state} label={indicator.config.label}/></div>:null}<p className="theme-next">Next: {next?`${next.title}, ${day(next.start_at!)}`:"No scheduled catalyst"}</p><div className="theme-actions"><button type="button" aria-expanded={expanded} aria-controls={`theme-panel-${theme.id}`} onClick={()=>setOpen(expanded?null:theme.id)}>{expanded?"Close details":"Details"}</button>{story?<a href="#changed-today">Today&apos;s story ↓</a>:null}</div>{expanded?<div className="theme-expanded" id={`theme-panel-${theme.id}`}><ThemeDetails theme={theme} state={current} today={today}/></div>:null}</article>})}</div></section>;
}
