"use client";

import Link from "next/link";
import { useState } from "react";

type Lens={lens_id:string;body:string;keep_wondering:string};
type Source={name:string;href:string};
type Headline={topic_tag:string;display_tag:string;headline:string;summary:string;everyday:string;how_it_works:string[];data_series:string[];sources:Source[];lenses:Lens[];expected_vs_actual?:{forecast:string;actual:string;prior:string};data_note?:string};
type Definition={name:string;icon:string;whats_different:string;asks:string};

function HeadlineVisual({topic}:{topic:string}){
  if(topic==="jobs_and_wages")return <aside className="headline-visual jobs-visual" role="img" aria-label="Hiring pulse: payroll growth was 133,000 jobs in August 2026 and 29,000 jobs in September 2026, compared with a 12-month average reference of 45,000 jobs."><div className="visual-title"><strong>Hiring pulse</strong><span>Jobs added each month</span></div><div className="job-chart"><div className="average-line"><span>12-month average: 45,000 jobs</span></div><div className="job-bar"><b>133,000 jobs</b><i style={{height:"82%"}}/><span>Aug. 2026</span></div><div className="job-bar focus"><b>29,000 jobs</b><i style={{height:"18%"}}/><span>Sept. 2026</span></div></div><p>Monthly hiring slowed below its recent reference.</p><small>Data as of 10:10 a.m. ET · U.S. Bureau of Labor Statistics</small></aside>;
  if(topic==="interest_rates_and_yields")return <aside className="headline-visual rate-tree" role="img" aria-label="A 5.29 percent 10-year Treasury yield can influence mortgage rates, car-loan rates, and business funding costs."><div className="visual-title"><strong>How one yield reaches daily life</strong><span>A benchmark branches into many loans</span></div><div className="tree-root"><span>10-year Treasury yield</span><b>5.29%</b></div><div className="tree-branches"><span>Mortgage<br/>rates</span><span>Car-loan<br/>rates</span><span>Business<br/>funding</span></div><p>One government-bond benchmark can influence several borrowing costs.</p><small>Data as of 10:10 a.m. ET · The Associated Press</small></aside>;
  if(topic==="oil_and_energy")return <aside className="headline-visual oil-chain" role="img" aria-label="Brent crude at 101 dollars and 94 cents per barrel can affect transportation costs and then prices for household goods and travel."><div className="visual-title"><strong>How oil can reach a household</strong><span>One cost moving through a supply chain</span></div><div className="supply-chain"><span><b>$101.94</b><em>per barrel</em></span><i>→</i><span><b>Transport</b><em>fuel and freight</em></span><i>→</i><span><b>Households</b><em>goods and travel</em></span></div><p>Fuel costs can travel through delivery networks and production.</p><small>Data as of 10:10 a.m. ET · The Associated Press</small></aside>;
  return <aside className="headline-visual signals-visual" role="img" aria-label="The services report showed 27 months of business activity growth alongside an increase in reported input-price pressure."><div className="visual-title"><strong>Two signals in one report</strong><span>Activity and costs can move together</span></div><div className="signal-pair"><span><b>27 months</b><em>of activity growth</em></span><i>+</i><span><b>Prices ↑</b><em>input-cost direction</em></span></div><p>Continued activity arrived with renewed cost pressure.</p><small>Data as of 10:10 a.m. ET · Institute for Supply Management</small></aside>;
}

export default function HeadlineCard({headline,definitions,featured=false}:{headline:Headline;definitions:Record<string,Definition>;featured?:boolean}){
  const [open,setOpen]=useState<Set<string>>(new Set());
  const [info,setInfo]=useState<Set<string>>(new Set());
  const allOpen=headline.lenses.every(lens=>open.has(lens.lens_id));
  const toggle=(id:string,setter:typeof setOpen)=>setter(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const setAll=()=>setOpen(allOpen?new Set():new Set(headline.lenses.map(lens=>lens.lens_id)));
  return <article className={`headline-card ${featured?"featured":""}`}>
    <div className="headline-intro"><p className="story-tag">{headline.display_tag}</p><h3>{headline.headline}</h3><p className="headline-summary">{headline.summary}</p></div>
    <div className="headline-visual-column"><HeadlineVisual topic={headline.topic_tag}/></div>
    <div className="headline-commentary">
      <div className="everyday"><strong>Everyday</strong><p>{headline.everyday}</p></div>
      <div className="mechanism" aria-label={`How it works: ${headline.how_it_works.join(", then ")}`}><strong>How it works</strong><div>{headline.how_it_works.map((step,index)=><span key={step}>{step}{index<headline.how_it_works.length-1?<i aria-hidden="true">→</i>:null}</span>)}</div></div>
      {headline.expected_vs_actual?<div className="expected"><strong>Expected vs. actual</strong><span>Forecast <b>{headline.expected_vs_actual.forecast}</b></span><span>Actual <b>{headline.expected_vs_actual.actual}</b></span><span>Prior <b>{headline.expected_vs_actual.prior}</b></span></div>:null}
      <div className="data-behind"><strong>Data behind this</strong><div>{headline.data_series.map(series=><span key={series}>{series}</span>)}</div>{headline.sources.map(source=><a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.name} ↗</a>)}</div>
      {headline.data_note?<p className="data-note"><strong>Data note</strong>{headline.data_note}</p>:null}
      <section className="lenses" aria-label={`${headline.headline} perspectives`}><div className="lens-heading"><strong>Keep exploring: see it from other seats</strong><button type="button" onClick={setAll}>{allOpen?"Collapse all":"Expand all"}</button></div>
        {headline.lenses.map(lens=>{const definition=definitions[lens.lens_id],isOpen=open.has(lens.lens_id),infoOpen=info.has(lens.lens_id),bodyId=`${headline.topic_tag}-${lens.lens_id}-body`,infoId=`${headline.topic_tag}-${lens.lens_id}-info`;return <div className="lens" key={lens.lens_id}><div className="lens-row"><button className="lens-toggle" type="button" aria-label={definition.name} aria-expanded={isOpen} aria-controls={bodyId} onClick={()=>toggle(lens.lens_id,setOpen)}><span className="lens-icon" aria-hidden="true">{definition.icon}</span><span className="lens-name">{definition.name}</span><span className="lens-spacer"/><span className="lens-chevron" aria-hidden="true">{isOpen?"⌃":"⌄"}</span></button><button className="info-button" type="button" aria-label={`What makes the ${definition.name} different`} aria-expanded={infoOpen} aria-controls={infoId} onClick={()=>toggle(lens.lens_id,setInfo)}>i</button></div>
          <div className="lens-info" id={infoId} hidden={!infoOpen}><p><strong>What’s different:</strong> {definition.whats_different}</p><p><strong>Asks:</strong> {definition.asks}</p></div>
          <div className="lens-body" id={bodyId} hidden={!isOpen}><p>{lens.body}</p><p><strong>Keep wondering:</strong> {lens.keep_wondering}</p>{lens.lens_id==="dealer"?<Link href="/glossary#dealer">Dealer and liquidity definitions →</Link>:lens.lens_id==="policy"?<Link href="/glossary#dual-mandate">Dual mandate definition →</Link>:null}</div>
        </div>})}
      </section>
    </div>
    <p className="card-disclaimer">Educational context only. No security or strategy is recommended. Verify figures and methods with the linked sources.</p>
  </article>;
}
