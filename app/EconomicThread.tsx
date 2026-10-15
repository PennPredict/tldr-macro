"use client";

import {useEffect,useRef,useState} from "react";
import thread from "../content/economic-thread.rendered.json";
import edition from "../content/current-edition.json";
import threadConfig from "../config/thread.json";
import AnnotatedText from "./AnnotatedText";
import TermPopover from "./TermPopover";
import termData from "../content/terms.json";
import {findTermMarkers} from "../lib/term-matcher.mjs";

type Node={id:string;layer:string;type:string;label:string;subline?:string;event_time?:string;story_anchor?:string;caption?:string;popover?:{title:string;plain:string;analogy?:string;precise:string;source_url:string}};
type Edge={id:string;from:string;to:string;type:string};
type Line={edge:Edge;d:string};
const layers=["Happened","Link","Markets","Could mean"] as const;
const nodes=thread.nodes as Node[],edges=thread.edges as Edge[],nodeMap=new Map(nodes.map(node=>[node.id,node]));
const incoming=new Map<string,Edge>();
for(const edge of edges)if(!incoming.has(edge.to))incoming.set(edge.to,edge);
const edgeWord=(node:Node)=>node.id===thread.reported_node_id?"Happened":incoming.get(node.id)?.type==="REPORTED"?"happened in this order":"can lead to";
const outgoingWord=(node:Node)=>edges.find(edge=>edge.from===node.id)?.type==="REPORTED"?"happened in this order":"can lead to";
const eventId=(event:{title:string;date:string})=>`calendar-${event.date}-${event.title}`.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const publishedAt=new Date(edition.updated_at).getTime();
const nextEvents=edition.calendar.filter(event=>!event.start_at||new Date(event.start_at).getTime()>publishedAt).filter(event=>!event.start_at||new Date(event.start_at).getTime()-publishedAt<=14*86400000).slice(0,3);

function NodeCard({node}:{node:Node}){
  const explanation=node.popover?<><strong>In plain English</strong><span>{node.popover.plain}</span>{node.popover.analogy?<><strong>Think of it like</strong><span>Simplified: {node.popover.analogy}</span></>:null}<strong>Precise version</strong><span>{node.popover.precise} <a href={node.popover.source_url} target="_blank" rel="noreferrer">Source ↗</a></span></>:null;
  const labelHasTerm=findTermMarkers(node.label,termData.terms,new Set()).length>0,sublineHasTerm=!!node.subline&&findTermMarkers(node.subline,termData.terms,new Set()).length>0,hasInlineTrigger=labelHasTerm||sublineHasTerm,override=node.popover?{label:node.popover.title,ariaLabel:`${node.label}: explanation`,body:explanation}:undefined;
  const content=<><span className="thread-node-copy"><AnnotatedText text={node.label} popoverOverride={labelHasTerm?override:undefined}/></span>{node.subline?<span className="thread-node-subline"><AnnotatedText text={node.subline} popoverOverride={!labelHasTerm&&sublineHasTerm?override:undefined}/></span>:null}</>;
  return <div className="thread-node-wrap"><div className="thread-node" data-node-id={node.id}>
    {node.story_anchor?<a className="thread-node-link" href={`#${node.story_anchor}`}>{content}</a>:content}
    {node.popover&&(threadConfig.node_info_icons==="always"||!hasInlineTrigger)?<TermPopover className="thread-node-info" label={node.popover.title} ariaLabel={`${node.label}: explanation`} body={explanation}>i</TermPopover>:null}
  </div>{node.caption?<p className="thread-node-caption">{node.caption}</p>:null}</div>;
}

function edgeLine(frame:DOMRect,from:DOMRect,to:DOMRect){
  const sameRow=Math.abs((from.top+from.height/2)-(to.top+to.height/2))<8;
  if(sameRow){const left=from.left<to.left,startX=(left?from.right:from.left)-frame.left,endX=(left?to.left:to.right)-frame.left,y=from.top-frame.top+from.height/2;return `M ${startX} ${y} L ${endX} ${y}`}
  const down=from.top<to.top,x=from.left-frame.left+from.width/2,startY=(down?from.bottom:from.top)-frame.top,endY=(down?to.top:to.bottom)-frame.top;return `M ${x} ${startY} L ${x} ${endY}`;
}

export default function EconomicThread(){
  const frameRef=useRef<HTMLDivElement>(null),[lines,setLines]=useState<Line[]>([]);
  useEffect(()=>{const frame=frameRef.current;if(!frame)return;const draw=()=>{const bounds=frame.getBoundingClientRect();setLines(edges.flatMap(edge=>{const from=frame.querySelector<HTMLElement>(`[data-node-id="${edge.from}"]`),to=frame.querySelector<HTMLElement>(`[data-node-id="${edge.to}"]`);return from&&to?[{edge,d:edgeLine(bounds,from.getBoundingClientRect(),to.getBoundingClientRect())}]:[]}))};draw();const observer=new ResizeObserver(draw);observer.observe(frame);return()=>observer.disconnect()},[]);
  const hasReported=nodes.some(node=>node.id===thread.reported_node_id),hasMarket=nodes.some(node=>node.layer==="Markets"),withheld=!threadConfig.enabled||nodes.length<4||!hasReported||!hasMarket;
  if(withheld&&threadConfig.withheld_display==="hide")return null;
  if(withheld)return threadConfig.fallback==="line"?<p className="thread-fallback">Today&apos;s stories don&apos;t share one driver.</p>:null;
  const mobileNodes=thread.mobile_order.map(id=>nodeMap.get(id)).filter(Boolean) as Node[];
  const takeaway=<p className="thread-takeaway"><strong>Today&apos;s shared theme.</strong> <AnnotatedText text={thread.takeaway}/></p>;
  const layerIcon=threadConfig.layer_icons?<span aria-hidden="true">◇</span>:null;
  const hasSolid=edges.some(edge=>edge.type==="REPORTED"),legend=hasSolid?"Solid: happened in this order. Dashed: common links. Neither proves cause.":"Dashed arrows: common links, not proof of cause.";
  return <section className="economic-thread" aria-labelledby="thread-title"><div className="section-heading"><div><p className="thread-kicker">How today connects</p><h2 id="thread-title">The Economic Thread</h2></div><p>{legend}</p></div>
    {threadConfig.takeaway_position==="above"?takeaway:null}
    <div className="thread-diagram" ref={frameRef} aria-label="Plain-language economic thread from prices through interest rates to market moves and possible household effects">
      <div className="thread-layers">{layers.map(layer=>{const layerNodes=nodes.filter(node=>node.layer===layer);return <div className="thread-layer" data-layer={layer} data-count={layerNodes.length} key={layer}><small>{layerIcon}{layer}{layer==="Markets"?<span className="thread-node-subline">Early market moves</span>:null}</small><div>{layerNodes.map(node=><NodeCard node={node} key={node.id}/>)}</div></div>})}</div>
      <svg className="thread-connectors" aria-hidden="true"><defs><marker id="thread-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z"/></marker></defs>{lines.map(({edge,d})=><path data-from={edge.from} data-to={edge.to} className={edge.type==="REPORTED"?"reported":"mechanism"} d={d} markerEnd="url(#thread-arrow)" key={edge.id}/>)}</svg>
      <ol className="thread-sr-sequence">{mobileNodes.map(node=><li key={node.id}>{node.layer}. {edgeWord(node)}. {node.label}</li>)}</ol>
    </div>
    <ol className="thread-mobile-list" aria-label="Plain-language economic thread in order">{mobileNodes.map(node=><li key={node.id} data-edge={outgoingWord(node)}><small>{node.layer}{node.layer==="Markets"?<span className="thread-node-subline">Early market moves</span>:null}</small><NodeCard node={node}/></li>)}</ol>
    {threadConfig.takeaway_position==="above"?null:takeaway}
    {nodes.some(node=>node.caption)?null:<p className="thread-other-factors">{thread.other_factors_note}</p>}
    {nextEvents.length?<p className="thread-calendar"><strong>Coming up:</strong> {nextEvents.map((event,index)=><span key={`${event.date}-${event.title}`}>{index?" · ":""}<a href={`#${eventId(event)}`}>{event.title} ({event.date})</a></span>)}</p>:null}
  </section>;
}
