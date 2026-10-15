import fs from "node:fs";
import path from "node:path";
import {candidateChecksPass,hashElement,readApprovals,readJson,root} from "./thread-policy.mjs";

const elementId=process.argv[2],approvedBy=process.env.THREAD_APPROVER;
if(!elementId)throw new Error("Usage: THREAD_APPROVER='Your name' npm run thread:approve -- <element_id>");
if(!approvedBy)throw new Error("Set THREAD_APPROVER to your name before approving.");
const thread=readJson("content/economic-thread.json"),candidate=(thread.caption_candidates||[]).find(item=>item.element_id===elementId)||thread.edges.find(item=>item.element_id===elementId&&item.tier===2);
if(!candidate)throw new Error(`Unknown Tier-2 element: ${elementId}`);
if(!candidateChecksPass(candidate))throw new Error(`${elementId} failed evidence matching and cannot be approved.`);
const approval={date:thread.edition_date,element_id:elementId,content_hash:hashElement(candidate),approved_by:approvedBy,approved_at:new Date().toISOString()};
const approvals=readApprovals().filter(item=>!(item.date===approval.date&&item.element_id===elementId));
approvals.push(approval);
fs.writeFileSync(path.join(root,"data/thread-approvals.json"),`${JSON.stringify(approvals,null,2)}\n`,{mode:0o600});
console.log(`Approved ${elementId} for ${thread.edition_date}. Re-run npm run thread:prepare and npm run verify.`);
