"use client";

import TermPopover from "./TermPopover";
import termData from "../content/terms.json";

export type Explain={anchor_text:string;why:string;other_reading:string};
type Term=typeof termData.terms[number];

function termBody(term:Term){return <><span>{term.definition}</span><span><strong>Relevance:</strong> {term.used_by_and_why}</span>{term.also_called.length?<span><strong>Synonyms:</strong> {term.also_called.join(" · ")}</span>:null}</>}

export default function AnnotatedText({text,explains=[],seen=new Set<string>(),termActions={}}:{text:string;explains?:Explain[];seen?:Set<string>;termActions?:Record<string,()=>void>}){
  const markers:{start:number;end:number;term:Term;key:string}[]=[];
  for(const term of termData.terms){
    if(seen.has(term.id))continue;
    let best:{start:number;surface:string}|null=null;
    for(const surface of term.surface_forms){const start=text.toLowerCase().indexOf(surface.toLowerCase());if(start>=0&&(!best||start<best.start||(start===best.start&&surface.length>best.surface.length)))best={start,surface}}
    if(best){seen.add(term.id);markers.push({start:best.start,end:best.start+best.surface.length,term,key:`term-${term.id}`})}
  }
  markers.sort((a,b)=>a.start-b.start||a.end-b.end);
  const output:React.ReactNode[]=[];let cursor=0;
  for(const marker of markers){
    if(marker.start<cursor)continue;
    const label=text.slice(marker.start,marker.end),action=termActions[marker.term.id];
    output.push(text.slice(cursor,marker.start),<TermPopover key={marker.key} label="Definition" ariaLabel={action?`${label}: read related story; hover for definition`:undefined} onActivate={action} body={termBody(marker.term)}>{label}</TermPopover>);
    cursor=marker.end;
    if(/^[,.;:!?)]/.test(text.slice(cursor)))output.push(<span aria-hidden="true" key={`${marker.key}-joiner`}>{"\u2060"}</span>);
  }
  output.push(text.slice(cursor));
  for(const [index,explain] of explains.entries())output.push(" ",<TermPopover key={`why-${index}`} className="why-trigger" label="Why?" ariaLabel={`Why: ${explain.anchor_text}`} body={<><span><strong>Mechanism:</strong> {explain.why}</span><span><strong>Caveat:</strong> {explain.other_reading}</span></>}>?</TermPopover>);
  return <>{output}</>;
}
