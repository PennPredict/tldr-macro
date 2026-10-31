import path from "node:path";
import {spawn} from "node:child_process";
import http from "node:http";
import {chromium} from "playwright";
import edition from "../content/current-edition.json" with {type:"json"};
import {generateHeroCopy} from "../lib/hero-copy.mjs";
import {gradeLevel} from "../lib/edition-summary.mjs";

const root=process.cwd(),base="http://127.0.0.1:4190",failures=[];
const server=spawn("python3",["-m","http.server","4190","--directory","out"],{stdio:"ignore"});
for(let i=0;i<30;i++){const ready=await new Promise(resolve=>{const request=http.get(base,response=>{response.resume();resolve(response.statusCode===200)});request.on("error",()=>resolve(false))});if(ready)break;await new Promise(resolve=>setTimeout(resolve,200))}

const hero=generateHeroCopy(edition);
failures.push(...hero.errors);
if(gradeLevel(`${hero.headline}. ${hero.summary}`)>8)failures.push(`Hero copy exceeds FK grade 8 (${gradeLevel(`${hero.headline}. ${hero.summary}`)})`);
for(const claim of hero.claims)if(!claim.source_urls.length)failures.push(`Hero claim lacks ledger evidence: ${claim.sentence}`);

const browser=await chromium.launch({headless:true});
for(const width of[1440,1280,768,375]){
  const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width===375});
  await page.goto(base,{waitUntil:"networkidle"});
  await page.screenshot({path:path.join(root,"reports",`hero-flow-after-${width}.png`),fullPage:true});
  const visual=page.locator(".brief-visual");
  if(await visual.count()!==1||!await visual.isVisible())failures.push(`${width}px hero visual is missing`);
  else{const dom=await visual.evaluate(element=>{const style=getComputedStyle(element),image=element.querySelector(".hero-art");return{backgroundImage:style.backgroundImage,filter:style.filter,shadow:style.boxShadow,rendered:element.getAttribute("data-rendered-visual"),imageCount:element.querySelectorAll(".hero-art").length,imageAlt:image?.getAttribute("alt")||""}});if(dom.backgroundImage!=="none"||dom.filter!=="none"||dom.shadow!=="none")failures.push(`${width}px hero visual contains a forbidden effect`);if(dom.rendered!=="image"||dom.imageCount!==1||!dom.imageAlt)failures.push(`${width}px supplied hero image did not render accessibly`)}

  const visibleWords=await page.locator(".brief-kicker,.hero-headline,.daily-brief .summary-why,.economic-thread .section-heading h2,.thread-node-trigger,.thread-other-factors").evaluateAll(elements=>elements.filter(element=>{const style=getComputedStyle(element);return style.display!=="none"&&style.visibility!=="hidden"}).map(element=>element.textContent||"").join(" ").match(/[A-Za-z0-9%]+/g)?.length||0);
  if(visibleWords>70)failures.push(`${width}px hero plus flow exceeds 70 words (${visibleWords})`);

  if(width===1280){
    const sentences=await page.locator("main").evaluate(element=>{const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),parts=[];while(walker.nextNode()){const parent=walker.currentNode.parentElement;if(!parent||parent.closest("[hidden],.sr-only,.term-popover")||getComputedStyle(parent).display==="none")continue;parts.push(walker.currentNode.textContent||"")}return parts.join(" ").replace(/\s+/g," ").match(/[^.!?]+[.!?]+/g)||[];});
    const normalized=sentences.map(sentence=>sentence.toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()).filter(sentence=>sentence.split(" ").length>=5);
    const words=value=>new Set(value.split(" ").filter(word=>word.length>2)),similarity=(a,b)=>{const x=words(a),y=words(b),intersection=[...x].filter(word=>y.has(word)).length;return intersection/(x.size+y.size-intersection||1)};
    for(let i=0;i<normalized.length;i++)for(let j=i+1;j<normalized.length;j++){if(normalized[i]===normalized[j])failures.push(`Duplicate visible sentence: ${normalized[i]}`);else if(normalized[i].split(" ").length>=8&&normalized[j].split(" ").length>=8&&similarity(normalized[i],normalized[j])>.8)failures.push(`Near-duplicate visible sentences: ${normalized[i]} / ${normalized[j]}`)}
  }
  await page.close();
}
await browser.close();server.kill();
if(failures.length){console.error([...new Set(failures)].join("\n"));process.exit(1)}
console.log(`Hero/flow passed: headline ${hero.words.headline} words; summary ${hero.words.summary} words; four viewport presence, effect, budget, and duplicate checks passed.`);
