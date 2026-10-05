"use client";

import Link from "next/link";
import { useState } from "react";
import topicIcons from "../config/topic-icons.json";
import viewSettings from "../config/view-settings.json";

type View={view_id:string;body:string;keep_wondering:string};
type Source={name:string;href:string};
type Visual={type:string;data:Record<string,string|number>;as_of:string;source:string;caption:string;alt:string};
type Headline={topic_tag:string;headline:string;commentary:string;defines:{term:string;definition:string;used_by_and_why:string}[];visual:Visual;views:View[];sources:Source[];expected_vs_actual?:{forecast:string;actual:string;prior:string};data_note?:string};
type Definition={name:string;icon:string;whats_different:string;asks:string};

const topicLabels:Record<string,string>={jobs_and_wages:"Jobs",interest_rates_and_yields:"Rates",oil_and_energy:"Energy",inflation_reports:"Services",dollar_and_foreign_markets:"Dollar and global",fed_meeting:"Fed",market_volatility:"Markets",budget_tariffs_taxes:"Budget and trade"};

function TopicIcon({name}:{name:string}){
  const common={width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};
  if(name==="briefcase")return <svg {...common}><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2"/></svg>;
  if(name==="percent")return <svg {...common}><path d="m19 5-14 14"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
  if(name==="fuel")return <svg {...common}><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h14M7 7h6v4H7zM16 8h2l2 2v7a2 2 0 0 1-4 0"/></svg>;
  if(name==="store")return <svg {...common}><path d="M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h8v6"/><path d="M3 10a3 3 0 0 0 5 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5 0"/></svg>;
  if(name==="globe")return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>;
  if(name==="landmark")return <svg {...common}><path d="m3 10 9-6 9 6M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M4 18h16M3 21h18"/></svg>;
  if(name==="trending-up")return <svg {...common}><path d="m3 17 6-6 4 4 8-8M15 7h6v6"/></svg>;
  if(name==="receipt")return <svg {...common}><path d="M6 3v18l3-2 3 2 3-2 3 2V3l-3 2-3-2-3 2zM9 9h6M9 13h6"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
}

function timeLabel(iso:string){const [hourText,minute]=iso.slice(11,16).split(":");const hour=Number(hourText);return `${hour%12||12}:${minute} ${hour>=12?"p.m.":"a.m."} ET`;}

function HeadlineVisual({visual}:{visual:Visual}){
  const stamp=<small>Data as of {timeLabel(visual.as_of)} · Source: {visual.source}</small>;
  if(visual.type==="jobs")return <aside className="headline-visual jobs-visual" role="img" aria-label={visual.alt}><div className="visual-title"><strong>Hiring pulse</strong><span>Jobs added each month</span></div><div className="job-chart"><div className="average-line"><span>12-month average: {Number(visual.data.average_12m_jobs).toLocaleString()} jobs</span></div><div className="job-bar"><b>{Number(visual.data.august_jobs).toLocaleString()} jobs</b><i style={{height:"82%"}}/><span>Aug. 2026</span></div><div className="job-bar focus"><b>{Number(visual.data.september_jobs).toLocaleString()} jobs</b><i style={{height:"18%"}}/><span>Sept. 2026</span></div></div><p>{visual.caption}</p>{stamp}</aside>;
  if(visual.type==="rates")return <aside className="headline-visual rate-tree" role="img" aria-label={visual.alt}><div className="visual-title"><strong>How one yield reaches daily life</strong><span>A benchmark branches into many loans</span></div><div className="tree-root"><span>10-year Treasury yield</span><b>{visual.data.yield_percent}%</b></div><div className="tree-branches"><span>Mortgage<br/>rates</span><span>Car-loan<br/>rates</span><span>Business<br/>funding</span></div><p>{visual.caption}</p>{stamp}</aside>;
  if(visual.type==="energy")return <aside className="headline-visual oil-chain" role="img" aria-label={visual.alt}><div className="visual-title"><strong>How oil can reach a household</strong><span>One cost moving through a supply chain</span></div><div className="supply-chain"><span><b>${visual.data.brent_dollars_per_barrel}</b><em>per barrel</em></span><i>→</i><span><b>Transport</b><em>fuel and freight</em></span><i>→</i><span><b>Households</b><em>goods and travel</em></span></div><p>{visual.caption}</p>{stamp}</aside>;
  return <aside className="headline-visual signals-visual" role="img" aria-label={visual.alt}><div className="visual-title"><strong>Two signals in one report</strong><span>Activity and costs can move together</span></div><div className="signal-pair"><span><b>{visual.data.growth_months} months</b><em>of activity growth</em></span><i>+</i><span><b>{visual.data.input_prices_direction} ↑</b><em>input-cost direction</em></span></div><p>{visual.caption}</p>{stamp}</aside>;
}

export default function HeadlineCard({headline,definitions}:{headline:Headline;definitions:Record<string,Definition>}){
  const orderedViews=[...headline.views].sort((a,b)=>viewSettings.global_rank.indexOf(a.view_id)-viewSettings.global_rank.indexOf(b.view_id));
  const initialOpen=viewSettings.default_open_first&&orderedViews[0]?new Set([orderedViews[0].view_id]):new Set<string>();
  const [open,setOpen]=useState<Set<string>>(initialOpen);
  const [info,setInfo]=useState<Set<string>>(new Set());
  const allOpen=orderedViews.every(view=>open.has(view.view_id));
  const toggle=(id:string,setter:typeof setOpen)=>setter(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const setAll=()=>setOpen(allOpen?new Set():new Set(orderedViews.map(view=>view.view_id)));
  const iconName=(topicIcons as Record<string,string>)[headline.topic_tag]||topicIcons.fallback;
  return <article className="headline-card">
    <div className="headline-intro"><p className="story-tag"><TopicIcon name={iconName}/>{topicLabels[headline.topic_tag]||"Economy"}</p><h3>{headline.headline}</h3><p className="headline-commentary-text">{headline.commentary}</p></div>
    <div className="headline-visual-column"><HeadlineVisual visual={headline.visual}/></div>
    <div className="headline-commentary">
      <section className="lenses" aria-label={`${headline.headline} agent implications`}><div className="lens-heading"><div><strong>Agent implications</strong><p>Agents are the people and institutions that make economic decisions. The same news looks different depending on where you sit.</p></div><button type="button" aria-label={allOpen?"Collapse all agent views":"Expand all agent views"} onClick={setAll}>{allOpen?"Collapse all":"Expand all"}</button></div>
        {orderedViews.map(view=>{const definition=definitions[view.view_id],isOpen=open.has(view.view_id),infoOpen=info.has(view.view_id),bodyId=`${headline.topic_tag}-${view.view_id}-body`,infoId=`${headline.topic_tag}-${view.view_id}-info`;return <div className="lens" key={view.view_id}><div className="lens-row"><button className="lens-toggle" type="button" aria-label={`${isOpen?"Collapse":"Expand"} ${definition.name}`} aria-expanded={isOpen} aria-controls={bodyId} onClick={()=>toggle(view.view_id,setOpen)}><span className="lens-icon" aria-hidden="true">{definition.icon}</span><span className="lens-name">{definition.name}</span><span className="lens-spacer"/><span className="lens-chevron" aria-hidden="true">{isOpen?"⌃":"⌄"}</span></button><button className="info-button" type="button" aria-label={`What makes the ${definition.name} different`} aria-expanded={infoOpen} aria-controls={infoId} onClick={()=>toggle(view.view_id,setInfo)}>i</button></div>
          <div className="lens-info" id={infoId} hidden={!infoOpen}><p><strong>What’s different:</strong> {definition.whats_different}</p><p><strong>Asks:</strong> {definition.asks}</p></div>
          <div className="lens-body" id={bodyId} hidden={!isOpen}><p>{view.body}</p><p><strong>Keep wondering:</strong> {view.keep_wondering}</p>{view.view_id==="dealer"?<Link href="/glossary#dealer">Dealer and liquidity definitions →</Link>:view.view_id==="policy"?<Link href="/glossary#dual-mandate">Dual mandate definition →</Link>:null}</div>
        </div>})}
      </section>
      <div className="story-sources"><strong>Sources</strong>{headline.data_note?<p><b>Data note:</b> {headline.data_note}</p>:null}<div>{headline.sources.map(source=><a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.name} ↗</a>)}</div></div>
    </div>
  </article>;
}
