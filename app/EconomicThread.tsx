"use client";
import {useSyncExternalStore} from "react";
import thread from "../content/economic-thread.rendered.json";
import config from "../config/thread.json";
import AnnotatedText from "./AnnotatedText";
import TermPopover from "./TermPopover";

type Variant="inline_chain"|"node_cards"|"icon_flow";
type Node={id:string;label:string;subline:string;precise:string;event_time?:string;reference_period:string;source:string;source_url:string};
type Edge={id:string;from:string;to:string;type:string;mechanism_id:string};
const stamp=(value?:string)=>value?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(value))+" ET":"Current relationship";

function NodeIcon({id}:{id:string}){const path=id==="oil"?"M8 2c1 3 4 4 4 8a4 4 0 1 1-8 0c0-3 2-5 4-8Z":id==="prices"?"M5 5h6M5 11h6M8 3v10":id==="rates"?"m3 11 3-3 2 2 4-5m-3 0h3v3":id==="households"?"M3 8 8 4l5 4v5H3Zm3 5V9h4v4":"M3 8h10";return <span className="thread-node-icon" aria-hidden="true"><svg viewBox="0 0 16 16"><path d={path}/></svg></span>}

function NodeButton({node}:{node:Node}){
  const body=<><p><strong>In plain English</strong><span>{node.subline}</span></p><p><strong>Precise version</strong><span>{node.precise}</span></p><small>As of {stamp(node.event_time)} · <a href={node.source_url} target="_blank" rel="noreferrer">{node.source} ↗</a></small></>;
  return <TermPopover className="thread-node-trigger" label="Context" title={node.label} ariaLabel={`Explain ${node.label}`} body={body}><NodeIcon id={node.id}/><span className="thread-node-copy"><AnnotatedText text={node.label}/></span></TermPopover>;
}

export default function EconomicThread(){
  const nodes=thread.nodes as Node[],edges=thread.edges as Edge[],defaultVariant=(config.flow?.variant||"inline_chain") as Variant;
  const variant=useSyncExternalStore(()=>()=>{},()=>{const value=new URLSearchParams(window.location.search).get("flowVariant") as Variant|null;return value&&["inline_chain","node_cards","icon_flow"].includes(value)?value:defaultVariant},()=>defaultVariant);
  if(nodes.length<3)return <section className="economic-thread" aria-labelledby="thread-title"><div className="section-heading"><h2 id="thread-title">How Today&apos;s Stories Connect</h2></div><p className="thread-fallback">Today&apos;s stories don&apos;t share one driver.</p></section>;
  return <section className="economic-thread" data-flow-variant={variant} aria-labelledby="thread-title"><div className="section-heading"><h2 id="thread-title">How Today&apos;s Stories Connect</h2></div><div className="flow-chain"><ol className="linear-thread" aria-label="Economic chain">{nodes.map((node,index)=>{const edge=edges[index];return <li className="linear-thread-item" key={node.id}><NodeButton node={node}/>{edge?<span className="thread-edge" role="img" aria-label={`Common link from ${node.label} to ${nodes[index+1].label}`} data-edge-type={edge.type}><svg viewBox="0 0 44 18"><path d="M1 9h37m-6-6 7 6-7 6"/></svg></span>:null}</li>})}</ol><p className="thread-other-factors">{thread.other_factors_note}</p></div></section>
}
