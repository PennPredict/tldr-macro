import {spawn} from "node:child_process";
import fs from "node:fs";
import {chromium} from "playwright";

const port=4179,url=`http://127.0.0.1:${port}`;
const server=spawn("./node_modules/.bin/vite",["preview","--host","127.0.0.1","--port",String(port),"--strictPort","--outDir","dist/client"],{cwd:process.cwd(),env:process.env,stdio:"ignore"});
const wait=async()=>{for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,250))}throw new Error("Preview timeout")};
try{
  await wait();fs.mkdirSync("reports",{recursive:true});const browser=await chromium.launch({headless:true}),checks=[];
  try{
    for(const width of [375,1280]){
      const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(url,{waitUntil:"load"});
      await page.locator(".more-markets").click();await page.locator("#extra-markets").screenshot({path:`reports/acceptance-snapshot-more-${width}.png`});
      await page.locator("#story-rates").screenshot({path:`reports/acceptance-yield-tree-${width}.png`});
      const noVisual=page.locator(".headline-card.no-visual").first();await noVisual.screenshot({path:`reports/acceptance-no-visual-${width}.png`});
      const viewToggle=noVisual.locator(".lens-toggle").first();await viewToggle.click({force:true});const body=noVisual.locator(".lens-body:not([hidden])");checks.push({width,view_body_question_buttons:await body.locator(".why-trigger,.term").count()});await noVisual.screenshot({path:`reports/acceptance-view-open-${width}.png`});
      await page.locator("#global").screenshot({path:`reports/acceptance-global-${width}.png`});await page.locator("#next").screenshot({path:`reports/acceptance-next-${width}.png`});
      await page.locator("footer").scrollIntoViewIfNeeded();await page.locator(".about-trigger").click();await page.screenshot({path:`reports/acceptance-mission-${width}.png`,fullPage:false});await page.keyboard.press("Escape");
      await page.screenshot({path:`reports/acceptance-footer-before-${width}.png`,fullPage:false});await page.locator(".brand-image-footer").click();await page.waitForFunction(()=>scrollY<=1,null,{timeout:5000});checks.push({width,back_to_top_y:await page.evaluate(()=>scrollY),header_focused:await page.locator(".brand-image-header").evaluate(element=>document.activeElement===element)});await page.screenshot({path:`reports/acceptance-footer-after-${width}.png`,fullPage:false});await page.close();
    }
  }finally{await browser.close()}
  fs.writeFileSync("reports/acceptance-tests.json",JSON.stringify({generated_at:new Date().toISOString(),checks},null,2)+"\n");
  if(checks.some(check=>check.view_body_question_buttons>0||check.back_to_top_y>1||check.header_focused===false))throw new Error(`Acceptance checks failed: ${JSON.stringify(checks)}`);
  console.log("Acceptance screenshots and interaction checks passed.");
}finally{server.kill("SIGTERM")}
