import {candidateChecksPass,excerpt,hashElement,readApprovals,readJson,validApproval} from "./thread-policy.mjs";

const thread=readJson("content/economic-thread.json"),approvals=readApprovals();
const elements=[...thread.nodes.map(node=>({element_id:node.id,tier:node.tier,text:[node.label,node.subline].filter(Boolean).join(" — "),source_url:node.source_url,matched_excerpt:node.source_sentence||"Registry or vetted mechanism entry",checks:{content:true,source:Boolean(node.source_url)}})),...thread.edges.map(edge=>({element_id:edge.id,tier:edge.tier,text:`${edge.from} → ${edge.to}`,source_url:edge.source_url||edge.mechanism_id,matched_excerpt:edge.evidence_excerpt||"Vetted mechanism entry",checks:{content:true,source:Boolean(edge.mechanism_id||edge.source_url)}})),...(thread.caption_candidates||[])];
for(const element of elements){
  const approved=element.tier===1||validApproval(element,thread.edition_date,approvals);
  console.log(`\n${element.element_id}\n  Tier: ${element.tier}\n  Text: ${element.text}\n  Evidence: ${element.source_url}\n  Excerpt: ${excerpt(element.matched_excerpt)}\n  Checks: ${Object.entries(element.checks||{}).map(([key,value])=>`${key}=${value?"pass":"FAIL"}`).join(", ")}\n  Content hash: ${hashElement(element)}\n  Result: ${approved?"included":"stripped pending valid approval"}`);
}
if((thread.caption_candidates||[]).some(candidate=>!candidateChecksPass(candidate)))console.log("\nCandidates with failed evidence matching cannot be approved into the rendered thread.");
