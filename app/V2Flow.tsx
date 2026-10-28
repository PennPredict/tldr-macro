import rendered from "../content/economic-thread.rendered.json";
import mechanisms from "../config/mechanisms.json";

export default function V2Flow(){
  const approved=new Set(Object.keys(mechanisms));
  const safeEdges=rendered.edges.filter(edge=>approved.has(edge.mechanism_id));
  const nodes=new Map(rendered.nodes.map(node=>[node.id,node]));
  return <section className="v2-section v2-flow" aria-labelledby="v2-flow-title">
    <h2 id="v2-flow-title">How Today’s Stories Connect</h2>
    {safeEdges.length ? <div className="v2-flow-row">{safeEdges.map((edge,index)=>{const from=nodes.get(edge.from),to=nodes.get(edge.to);return <div className="v2-flow-link" key={edge.id}>{index===0?<div><span>{from?.layer}</span><strong>{from?.label}</strong></div>:null}<b aria-hidden="true">→</b><div><span>{to?.layer}</span><strong>{to?.label}</strong></div></div>})}</div> : <div className="v2-flow-empty"><strong>No verified shared driver today.</strong><p>The leading stories may be moving markets for different reasons.</p></div>}
  </section>
}
