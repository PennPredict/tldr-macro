"use client";

import Link from "next/link";
import { useState } from "react";

type Lens={lens_id:string;body:string;keep_wondering:string};
type Source={name:string;href:string};
type Headline={topic_tag:string;display_tag:string;headline:string;summary:string;everyday:string;how_it_works:string[];data_series:string[];sources:Source[];lenses:Lens[];expected_vs_actual?:{forecast:string;actual:string;prior:string};data_note?:string};
type Definition={name:string;icon:string;whats_different:string;asks:string};

export default function HeadlineCard({headline,definitions,featured=false}:{headline:Headline;definitions:Record<string,Definition>;featured?:boolean}){
  const [open,setOpen]=useState<Set<string>>(new Set());
  const [info,setInfo]=useState<Set<string>>(new Set());
  const allOpen=headline.lenses.every(lens=>open.has(lens.lens_id));
  const toggle=(id:string,setter:typeof setOpen)=>setter(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const setAll=()=>setOpen(allOpen?new Set():new Set(headline.lenses.map(lens=>lens.lens_id)));
  return <article className={`headline-card ${featured?"featured":""}`}>
    <div className="headline-main"><p className="story-tag">{headline.display_tag}</p><h3>{headline.headline}</h3><p className="headline-summary">{headline.summary}</p>
      <div className="everyday"><strong>Everyday</strong><p>{headline.everyday}</p></div>
      <div className="mechanism" aria-label={`How it works: ${headline.how_it_works.join(", then ")}`}><strong>How it works</strong><div>{headline.how_it_works.map((step,index)=><span key={step}>{step}{index<headline.how_it_works.length-1?<i aria-hidden="true">→</i>:null}</span>)}</div></div>
      {headline.expected_vs_actual?<div className="expected"><strong>Expected vs. actual</strong><span>Forecast <b>{headline.expected_vs_actual.forecast}</b></span><span>Actual <b>{headline.expected_vs_actual.actual}</b></span><span>Prior <b>{headline.expected_vs_actual.prior}</b></span></div>:null}
      <div className="data-behind"><strong>Data behind this</strong><div>{headline.data_series.map(series=><span key={series}>{series}</span>)}</div>{headline.sources.map(source=><a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.name} ↗</a>)}</div>
      {headline.data_note?<p className="data-note"><strong>Data note</strong>{headline.data_note}</p>:null}
    </div>
    <section className="lenses" aria-label={`${headline.headline} perspectives`}><div className="lens-heading"><div><strong>Five-lens view</strong><p>The same news looks different depending on where you sit.</p></div><button type="button" onClick={setAll}>{allOpen?"Collapse all":"Expand all"}</button></div>
      {headline.lenses.map(lens=>{const definition=definitions[lens.lens_id],isOpen=open.has(lens.lens_id),infoOpen=info.has(lens.lens_id),bodyId=`${headline.topic_tag}-${lens.lens_id}-body`,infoId=`${headline.topic_tag}-${lens.lens_id}-info`;return <div className="lens" key={lens.lens_id}><div className="lens-row"><button className="lens-toggle" type="button" aria-expanded={isOpen} aria-controls={bodyId} onClick={()=>toggle(lens.lens_id,setOpen)}><span className="lens-icon" aria-hidden="true">{definition.icon}</span><span>{definition.name}</span><i aria-hidden="true">{isOpen?"⌃":"⌄"}</i></button><button className="info-button" type="button" aria-label={`What makes the ${definition.name} different`} aria-expanded={infoOpen} aria-controls={infoId} onClick={()=>toggle(lens.lens_id,setInfo)}>i</button></div>
        <div className="lens-info" id={infoId} hidden={!infoOpen}><p><strong>What’s different:</strong> {definition.whats_different}</p><p><strong>Asks:</strong> {definition.asks}</p></div>
        <div className="lens-body" id={bodyId} hidden={!isOpen}><p>{lens.body}</p><p><strong>Keep wondering:</strong> {lens.keep_wondering}</p>{lens.lens_id==="dealer"?<Link href="/glossary#dealer">Dealer and liquidity definitions →</Link>:lens.lens_id==="policy"?<Link href="/glossary#dual-mandate">Dual mandate definition →</Link>:null}</div>
      </div>})}
    </section>
    <p className="card-disclaimer">Educational context only. No security or strategy is recommended. Verify figures and methods with the linked sources.</p>
  </article>;
}
