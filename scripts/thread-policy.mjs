import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const root=process.cwd();
export const readJson=(file)=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
export const hashElement=(element)=>crypto.createHash("sha256").update(`${element.text}\n${element.source_url}`).digest("hex");
export const excerpt=(text,limit=25)=>(text||"").trim().split(/\s+/).slice(0,limit).join(" ");

export function readApprovals(){
  const file=path.join(root,"data/thread-approvals.json");
  if(!fs.existsSync(file))return [];
  const value=JSON.parse(fs.readFileSync(file,"utf8"));
  return Array.isArray(value)?value:value.approvals||[];
}

export function candidateChecksPass(candidate){return Object.values(candidate.checks||{}).every(Boolean)}

export function validApproval(candidate,editionDate,approvals=readApprovals()){
  return candidateChecksPass(candidate)&&approvals.some(approval=>approval.date===editionDate&&approval.element_id===candidate.element_id&&approval.content_hash===hashElement(candidate)&&approval.approved_by&&approval.approved_at&&approval.approved_at.startsWith(editionDate));
}

export function renderThread(source,config,approvals=readApprovals()){
  const nodes=source.nodes.map(node=>({...node}));
  for(const candidate of source.caption_candidates||[]){
    if(!validApproval(candidate,source.edition_date,approvals))continue;
    const node=nodes.find(item=>item.id===candidate.node_id);
    if(node)node.caption=candidate.text;
  }
  const edges=source.edges.filter(edge=>edge.tier!==2||validApproval(edge,source.edition_date,approvals));
  return {...source,enabled:config.enabled,nodes,edges,caption_candidates:undefined};
}
