import {spawn} from "node:child_process";
import fs from "node:fs";
import {chromium} from "playwright";

const port=4178,url=`http://127.0.0.1:${port}`;
const server=spawn("./node_modules/.bin/vinext",["start"],{cwd:process.cwd(),env:{...process.env,PORT:String(port),HOST:"127.0.0.1"},stdio:"ignore"});
const waitForServer=async()=>{for(let attempt=0;attempt<60;attempt++){try{const response=await fetch(url);if(response.ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,250))}throw new Error("Timed out waiting for the popover test server")};

try{
  await waitForServer();
  const browser=await chromium.launch({headless:true}),results=[];
  try{
    for(const width of [375,768,1280]){
      const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(url,{waitUntil:"load"});
      const triggers=page.locator(".term,.why-trigger,.info-button"),failures=[];let tested=0;
      for(let index=0;index<await triggers.count();index++){
        const trigger=triggers.nth(index);if(!await trigger.isVisible())continue;tested++;await trigger.click();
        const metric=await page.locator(".term-popover").evaluate(popover=>{const box=popover.getBoundingClientRect(),children=[...popover.querySelectorAll("*")];return {overflow:popover.scrollWidth<=popover.clientWidth,childrenInside:children.every(child=>{const rect=child.getBoundingClientRect();return rect.left>=box.left-.5&&rect.right<=box.right+.5&&rect.top>=box.top-.5&&rect.bottom<=box.bottom+.5}),viewport:box.left>=8&&box.right<=innerWidth-8&&box.top>=8&&box.bottom<=innerHeight-8,fontStyle:getComputedStyle(popover).fontStyle};});
        if(!metric.overflow||!metric.childrenInside||!metric.viewport||metric.fontStyle!=="normal")failures.push({index,metric});await trigger.click();
      }
      const summaryLines=await page.locator(".edition-summary").evaluate(element=>Math.round(element.getBoundingClientRect().height/Number.parseFloat(getComputedStyle(element).lineHeight)));
      const maxLines=width===375?5:2;if(summaryLines>maxLines)failures.push({summaryLines,maxLines});
      await page.locator('.edition-summary .term').nth(1).click();
      fs.mkdirSync("reports",{recursive:true});await page.screenshot({path:`reports/popover-${width}.png`,fullPage:false});
      results.push({width,visible_triggers:tested,summary_lines:summaryLines,failures});await page.close();
    }
  }finally{await browser.close()}
  fs.writeFileSync("reports/popover-tests.json",JSON.stringify({generated_at:new Date().toISOString(),results},null,2)+"\n");
  const failures=results.flatMap(result=>result.failures);if(failures.length)throw new Error(`Popover checks failed: ${JSON.stringify(failures)}`);
  console.log(`Popover checks passed: ${results.map(result=>`${result.visible_triggers} triggers at ${result.width}px`).join(", ")}.`);
}finally{server.kill("SIGTERM")}
