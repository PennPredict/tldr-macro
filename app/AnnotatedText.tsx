"use client";

import TermPopover from "./TermPopover";
import termData from "../content/terms.json";

export type Explain={anchor_text:string;why:string;other_reading:string};
type Term=typeof termData.terms[number];

function termBody(term:Term){if(term.type==="also_called")return <><span>Also called: {term.also_called.join(", ")}. Finance professionals may use these terms interchangeably.</span></>;return <>{term.definition} {term.used_by_and_why}</>}

export default function AnnotatedText({text,explains=[],seen=new Set<string>()}:{text:string;explains?:Explain[];seen?:Set<string>}){
  const markers:{start:number;end:number;node:React.ReactNode;key:string}[]=[];
  for(const term of termData.terms){if(seen.has(term.id))continue;let best:{start:number;surface:string}|null=null;for(const surface of term.surface_forms){const start=text.toLowerCase().indexOf(surface.toLowerCase());if(start>=0&&(!best||start<best.start))best={start,surface}}if(best){seen.add(term.id);markers.push({start:best.start,end:best.start+best.surface.length,key:`term-${term.id}`,node:<TermPopover label={term.type==="also_called"?"Also called":"Definition"} title={best.surface} body={termBody(term)}>{text.slice(best.start,best.start+best.surface.length)}</TermPopover>})}}
  for(const [index,explain] of explains.entries()){const start=text.indexOf(explain.anchor_text);if(start>=0)markers.push({start:start+explain.anchor_text.length,end:start+explain.anchor_text.length,key:`why-${index}`,node:<TermPopover className="why-trigger" label="Why?" ariaLabel={`Why: ${explain.anchor_text}`} body={<><span>One common explanation: {explain.why}</span><span>Another reading: {explain.other_reading}</span></>}>Why?</TermPopover>})}
  markers.sort((a,b)=>a.start-b.start||a.end-b.end);const output:React.ReactNode[]=[];let cursor=0;for(const marker of markers){if(marker.start<cursor)continue;output.push(text.slice(cursor,marker.start),<span key={marker.key}>{marker.node}</span>);cursor=marker.end}output.push(text.slice(cursor));return <>{output}</>;
}
