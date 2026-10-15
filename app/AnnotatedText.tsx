"use client";

import TermPopover from "./TermPopover";
import termData from "../content/terms.json";
import {findTermMarkers} from "../lib/term-matcher.mjs";

export type Explain={anchor_text:string;why:string;other_reading:string};
type Term=typeof termData.terms[number];

function termBody(term:Term){return <><span>{term.definition}</span><span><strong>Relevance:</strong> {term.used_by_and_why}</span>{term.also_called.length?<span><strong>Synonyms:</strong> {term.also_called.join(" · ")}</span>:null}</>}

type Override={label:string;ariaLabel:string;body:React.ReactNode};
export default function AnnotatedText({text,explains=[],seen=new Set<string>(),termActions={},popoverOverride}:{text:string;explains?:Explain[];seen?:Set<string>;termActions?:Partial<Record<string,()=>void>>;popoverOverride?:Override}){
  const markers=findTermMarkers(text,termData.terms,seen).map(marker=>({...marker,key:`term-${marker.term.id}`}));
  const output:React.ReactNode[]=[];let cursor=0;
  for(const marker of markers){
    if(marker.start<cursor)continue;
    const label=text.slice(marker.start,marker.end),action=termActions[marker.term.id];
    const override=popoverOverride&&output.filter(item=>typeof item!=="string").length===0?popoverOverride:null;
    output.push(text.slice(cursor,marker.start),<TermPopover key={marker.key} label={override?.label||"Definition"} ariaLabel={override?.ariaLabel||(action?`${label}: read related story; hover for definition`:undefined)} onActivate={action} body={override?.body||termBody(marker.term)}>{label}</TermPopover>);
    cursor=marker.end;
    if(/^[,.;:!?)]/.test(text.slice(cursor)))output.push(<span aria-hidden="true" key={`${marker.key}-joiner`}>{"\u2060"}</span>);
  }
  output.push(text.slice(cursor));
  for(const [index,explain] of explains.entries())output.push(" ",<TermPopover key={`why-${index}`} className="why-trigger" label="Why?" ariaLabel={`Why: ${explain.anchor_text}`} body={<><span><strong>Mechanism:</strong> {explain.why}</span><span><strong>Caveat:</strong> {explain.other_reading}</span></>}>?</TermPopover>);
  return <>{output}</>;
}
