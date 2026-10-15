import fs from "node:fs";
import path from "node:path";
import {readJson,renderThread,root} from "./thread-policy.mjs";

const source=readJson("content/economic-thread.json"),config=readJson("config/thread.json");
const rendered=renderThread(source,config);
fs.writeFileSync(path.join(root,"content/economic-thread.rendered.json"),`${JSON.stringify(rendered,null,2)}\n`);
console.log(`Prepared Tier-1 thread with ${rendered.nodes.length} nodes, ${rendered.edges.length} edges, and ${rendered.nodes.filter(node=>node.caption).length} approved caption(s).`);
