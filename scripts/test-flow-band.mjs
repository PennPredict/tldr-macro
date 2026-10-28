import path from "node:path";
import {spawn} from "node:child_process";
import http from "node:http";
import {chromium} from "playwright";

const root=process.cwd(),base="http://127.0.0.1:4191",failures=[],variants=["inline_chain","node_cards","icon_flow"],widths=[1440,1280,768,375];
const server=spawn("python3",["-m","http.server","4191","--directory","out"],{stdio:"ignore"});
for(let i=0;i<30;i++){const ready=await new Promise(resolve=>{const request=http.get(base,response=>{response.resume();resolve(response.statusCode===200)});request.on("error",()=>resolve(false))});if(ready)break;await new Promise(resolve=>setTimeout(resolve,200))}
const browser=await chromium.launch({headless:true});
for(const variant of variants)for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},hasTouch:width===375});
  await page.goto(`${base}/?flowVariant=${variant}`,{waitUntil:"networkidle"});
  const band=page.locator(".economic-thread");await band.waitFor();await page.waitForFunction(value=>document.querySelector(".economic-thread")?.getAttribute("data-flow-variant")===value,variant);
  await band.screenshot({path:path.join(root,"reports",`flow-${variant}-after-${width}.png`)});
  const result=await band.evaluate(element=>{const text=[...element.querySelectorAll("h2,.thread-node-copy,.thread-other-factors")].map(item=>item.textContent||"").join(" "),rect=element.getBoundingClientRect(),buttons=[...element.querySelectorAll(".thread-node-trigger")],styles=buttons.map(button=>button.getBoundingClientRect());return{height:rect.height,words:(text.match(/[A-Za-z0-9%]+/g)||[]).length,nodes:buttons.length,legends:element.querySelectorAll(".thread-other-factors").length,footnotes:element.querySelectorAll(".thread-footnote").length,ordered:element.querySelectorAll("ol.linear-thread").length,edges:element.querySelectorAll(".thread-edge[aria-label][data-edge-type]").length,targets:styles.map(rect=>({w:rect.width,h:rect.height})),variant:element.getAttribute("data-flow-variant")}});
  if(result.nodes>4)failures.push(`${variant}/${width}: more than four nodes`);if(result.words>25)failures.push(`${variant}/${width}: ${result.words} visible words`);if(result.legends!==1||result.footnotes!==0)failures.push(`${variant}/${width}: legend or footnote count failed`);if(result.ordered!==1||result.edges!==result.nodes-1)failures.push(`${variant}/${width}: ordered-list or real-edge semantics failed`);if(result.targets.some(target=>target.w<44||target.h<44))failures.push(`${variant}/${width}: touch target under 44px`);if(width>=1280&&result.height>220)failures.push(`${variant}/${width}: band is ${Math.round(result.height)}px tall`);
  if(variant==="inline_chain"){const bordered=await band.evaluate(element=>[...element.querySelectorAll(".flow-chain,.thread-node-trigger")].filter(item=>parseFloat(getComputedStyle(item).borderTopWidth)>0).length);if(bordered>1)failures.push(`${variant}/${width}: more than one bordered container`)}
  await page.close();
}
await browser.close();server.kill();
if(failures.length){console.error([...new Set(failures)].join("\n"));process.exit(1)}
console.log("Flow band passed: 3 variants × 4 viewports; node, height, word, border, legend, edge, ordered-list, and 44px target checks passed.");
