import path from "node:path";
import {spawn} from "node:child_process";
import http from "node:http";
import {chromium} from "playwright";
import edition from "../content/current-edition.json" with {type:"json"};
import extras from "../content/extra-markets.json" with {type:"json"};

const root=process.cwd(),base=process.env.VERIFY_BASE_URL||"http://localhost:4173",failures=[],verifiedHeadlineCards=edition.markets.filter(item=>item.available!==false).length+(extras.some(item=>item.name==="Silver futures"&&item.available!==false)?1:0);let server=null;
if(!process.env.VERIFY_BASE_URL){server=spawn("python3",["-m","http.server","4173","--directory","out"],{stdio:"ignore"});for(let i=0;i<30;i++){const ready=await new Promise(resolve=>{const request=http.get(base,response=>{response.resume();resolve(response.statusCode===200)});request.on("error",()=>resolve(false))});if(ready)break;await new Promise(resolve=>setTimeout(resolve,200))}}
const browser=await chromium.launch({headless:true});
for(const width of[390,1280]){
  const page=await browser.newPage({viewport:{width,height:900},hasTouch:width===390});await page.goto(base,{waitUntil:"networkidle"});await page.screenshot({path:path.join(root,"reports",`design-${width}.png`),fullPage:true});
  for(const selector of[".topbar",".macro-themes",".daily-changes",".economic-thread",".market-section",".watch",".bottom-line","footer"])if(await page.locator(selector).count()!==1)failures.push(`${width}px ${selector} is not canonical`);
  if(await page.locator(".stories,.global-section").count())failures.push(`${width}px legacy story sections still render`);
  if(await page.locator(".theme-card").count()!==5)failures.push(`${width}px does not show five persistent themes`);
  if(await page.locator(".theme-expanded,.event-more[open]").count())failures.push(`${width}px disclosure panels are not closed by default`);
  const disclosure=page.locator(".theme-actions button").first();if(await disclosure.getAttribute("aria-expanded")!=="false")failures.push(`${width}px theme disclosure lacks initial aria-expanded=false`);await disclosure.press("Enter");if(await disclosure.getAttribute("aria-expanded")!=="true"||!await page.locator(".theme-expanded").count())failures.push(`${width}px theme disclosure is not keyboard operable`);await disclosure.press("Enter");
  if(await page.locator(".change-watch").evaluateAll(nodes=>nodes.some(node=>/Watch:\s*Watch\b/i.test(node.textContent||""))))failures.push(`${width}px duplicates the Watch label`);
  for(const id of["theme-inflation-fed","theme-bonds-credit","theme-global-geopolitics"]){const question=page.locator(`#${id} .theme-question`);if(await question.locator(".popover-wrap").evaluateAll(nodes=>nodes.some(node=>getComputedStyle(node).display!=="inline")))failures.push(`${width}px ${id} glossary terms are not inline`)}
  if(width===1280){const heights=await page.locator(".theme-card").evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));if(Math.max(...heights)-Math.min(...heights)>48)failures.push("Desktop theme-card heights are inconsistent")}
  const dailyCount=await page.locator(".daily-change-card").count();if(dailyCount>3)failures.push(`${width}px shows more than three daily changes`);
  if(await page.locator(".outlook-reinforces,.trajectory-unchanged").count())failures.push(`${width}px renders default-state tags`);
  if(await page.locator(".bottom-line>div>p").count()!==2)failures.push(`${width}px Bottom Line is not exactly two sentences`);
  for(const selector of[".daily-changes",".economic-thread",".market-section",".watch",".bottom-line"])if(await page.locator(selector).evaluate(element=>element.scrollWidth>element.clientWidth+1))failures.push(`${width}px ${selector} overflows`);
  if(await page.locator("body").evaluate(element=>element.scrollWidth>element.clientWidth+1))failures.push(`${width}px page overflows`);
  const threadNodes=await page.locator(".linear-thread .thread-node-trigger").count();if(threadNodes<2||threadNodes>4)failures.push(`${width}px thread does not contain the supported 2–4 nodes`);
  for(const href of await page.locator('a[href^="#"]').evaluateAll(links=>links.map(link=>link.getAttribute("href"))))if(href&&href!=="#"&&!await page.locator(href).count())failures.push(`${width}px broken anchor ${href}`);
  if(await page.locator(".market-section>.market-asset-group .market-row").count()!==verifiedHeadlineCards)failures.push(`${width}px snapshot does not match the ${verifiedHeadlineCards} verified headline row(s)`);
  if(await page.locator(".earlier-markets").count())failures.push(`${width}px stale earlier readings remain in the DOM`);
  await page.close();
}
await browser.close();server?.kill();if(failures.length){console.error(failures.join("\n"));process.exit(1)}console.log("Desktop and 390px layouts, inline theme questions, Watch labels, market arithmetic, keyboard disclosures, and responsive hierarchy passed.");
