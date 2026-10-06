"use client";

import TermPopover from "./TermPopover";
import termData from "../content/terms.json";

export type Explain={anchor_text:string;why:string;other_reading:string};
type Term=typeof termData.terms[number];

function termBody(term:Term){if(term.type==="also_called")return <span>{term.also_called.join(" · ")}</span>;return <><span>{term.definition}</span><span>{term.used_by_and_why}</span>{term.also_called.length?<span><strong>Synonyms:</strong> {term.also_called.join(" · ")}</span>:null}</>}

export default function AnnotatedText({text,explains=[],seen=new Set<string>(),termActions={}}:{text:string;explains?:Explain[];seen?:Set<string>;termActions?:Record<string,()=>void>}){
  const markers:{start:number;end:number;node:React.ReactNode;key:string}[]=[];
  for(const term of termData.terms){if(seen.has(term.id))continue;let best:{start:number;surface:string}|null=null;for(const surface of term.surface_forms){const start=text.toLowerCase().indexOf(surface.toLowerCase());if(start>=0&&(!best||start<best.start))best={start,surface}}if(best){seen.add(term.id);markers.push({start:best.start,end:best.start+best.surface.length,key:`term-${term.id}`,node:<TermPopover label={term.type==="also_called"?"Synonyms":"Definition"} ariaLabel={termActions[term.id]?`${text.slice(best.start,best.start+best.surface.length)}: read related story; hover for definition`:undefined} onActivate={termActions[term.id]} body={termBody(term)}>{text.slice(best.start,best.start+best.surface.length)}</TermPopover>})}}
  markers.sort((a,b)=>a.start-b.start||a.end-b.end);const output:React.ReactNode[]=[];let cursor=0;for(const marker of markers){if(marker.start<cursor)continue;output.push(text.slice(cursor,marker.start),<span key={marker.key}>{marker.node}</span>);cursor=marker.end}output.push(text.slice(cursor));for(const [index,explain] of explains.entries())output.push(" ",<span key={`why-${index}`}><TermPopover className="why-trigger" label="Why?" ariaLabel={`Why: ${explain.anchor_text}`} body={<><span><strong>Mechanism:</strong> {explain.why}</span><span><strong>Caveat:</strong> {explain.other_reading}</span></>}>?</TermPopover></span>);return <>{output}</>;
}
