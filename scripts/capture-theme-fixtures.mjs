import path from "node:path";
import http from "node:http";
import {spawn} from "node:child_process";
import {chromium} from "playwright";

const root=process.cwd(),local="http://127.0.0.1:4193",live="https://tldrmacro.com/",widths=[1440,1280,768,375];
const server=spawn("python3",["-m","http.server","4193","--directory","out"],{stdio:"ignore"});
for(let attempt=0;attempt<30;attempt++){const ready=await new Promise(resolve=>{const request=http.get(local,response=>{response.resume();resolve(response.statusCode===200)});request.on("error",()=>resolve(false))});if(ready)break;await new Promise(resolve=>setTimeout(resolve,200))}
const browser=await chromium.launch({headless:true});
for(const width of widths){
  const viewport={width,height:1100};
  const before=await browser.newPage({viewport});await before.goto(live,{waitUntil:"networkidle"});const oldBand=before.locator(".macro-themes");if(await oldBand.count())await oldBand.screenshot({path:path.join(root,"reports",`themes-before-${width}.png`)});await before.close();
  for(const fixture of["heavy","quiet","holiday"]){const page=await browser.newPage({viewport});await page.goto(local,{waitUntil:"networkidle"});if(fixture!=="heavy")await page.evaluate(mode=>{document.querySelectorAll(".theme-state").forEach((node,index)=>{node.className=`theme-state theme-state-${mode==="holiday"?"closed":"quiet"}`;node.textContent=mode==="holiday"?`Market closed · Nov 11`:`No new data · Nov ${index+6}`})},fixture);await page.locator(".macro-themes").screenshot({path:path.join(root,"reports",`themes-${fixture}-after-${width}.png`)});await page.close();}
}
await browser.close();server.kill();
console.log("Captured Themes before/after fixtures at 1440, 1280, 768, and 375px.");
