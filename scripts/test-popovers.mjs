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
      const page=await browser.newPage({viewport:{width,height:1000}}),failures=[];await page.goto(url,{waitUntil:"load"});fs.mkdirSync("reports",{recursive:true});
      const initialTop=await page.locator(".market-section").evaluate(element=>element.getBoundingClientRect().top+scrollY);
      const initiallyHidden=await page.locator(".sticky-header").getAttribute("aria-hidden");if(initiallyHidden!=="true")failures?.push?.({sticky_initially_hidden:initiallyHidden});
      if(width===375||width===1280)await page.screenshot({path:`reports/sticky-top-${width}.png`,fullPage:false});
      const triggers=page.locator(".term,.why-trigger,.info-button,.about-trigger");let tested=0;
      for(let index=0;index<await triggers.count();index++){
        const trigger=triggers.nth(index);if(!await trigger.isVisible())continue;tested++;const summaryTrigger=await trigger.evaluate(element=>Boolean(element.closest(".edition-summary")));if(summaryTrigger)await trigger.hover();else await trigger.click();
        const metric=await page.locator(".term-popover").evaluate(popover=>{const box=popover.getBoundingClientRect(),children=[...popover.querySelectorAll("*")];return {overflow:popover.scrollWidth<=popover.clientWidth,childrenInside:children.every(child=>{const rect=child.getBoundingClientRect();return rect.left>=box.left-.5&&rect.right<=box.right+.5&&rect.top>=box.top-.5&&rect.bottom<=box.bottom+.5}),viewport:box.left>=8&&box.right<=innerWidth-8&&box.top>=8&&box.bottom<=innerHeight-8,fontStyle:getComputedStyle(popover).fontStyle};});
        if(!metric.overflow||!metric.childrenInside||!metric.viewport||metric.fontStyle!=="normal")failures.push({index,metric});if(summaryTrigger){await page.mouse.move(0,0);await page.waitForTimeout(30)}else await trigger.click();
      }
      const summaryLines=await page.locator(".edition-summary").evaluate(element=>Math.round(element.getBoundingClientRect().height/Number.parseFloat(getComputedStyle(element).lineHeight)));
      const maxLines=width===375?5:2;if(summaryLines>maxLines)failures.push({summaryLines,maxLines});
      for(const [index,target] of ["story-stocks","story-rates","story-oil"].entries()){
        await page.locator(".edition-summary .term").nth(index).click();await page.waitForTimeout(700);
        const position=await page.locator(`#${target}`).evaluate(element=>element.getBoundingClientRect().top);
        const minimum=width<600?52:60,maximum=136;if(position<minimum||position>maximum)failures.push({summary_jump:target,position});
      }
      await page.locator("#story-rates").scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,-120));await page.waitForTimeout(80);if(width<600){await page.evaluate(()=>scrollBy(0,-20));await page.waitForTimeout(80)}
      const stickyVisible=await page.locator(".sticky-header").getAttribute("aria-hidden");if(stickyVisible!=="false")failures.push({sticky_midpage_visible:stickyVisible});
      const shiftedTop=await page.locator(".market-section").evaluate(element=>element.getBoundingClientRect().top+scrollY);if(Math.abs(shiftedTop-initialTop)>.5)failures.push({layout_shift:shiftedTop-initialTop});
      if(width===375||width===1280)await page.screenshot({path:`reports/sticky-mid-${width}.png`,fullPage:false});
      await page.locator("#story-rates .term").first().click();const clearance=await page.evaluate(()=>{const bar=document.querySelector(".sticky-header").getBoundingClientRect(),popover=document.querySelector(".term-popover").getBoundingClientRect();return {barBottom:bar.bottom,popoverTop:popover.top,clear:popover.top>=bar.bottom+8}});if(!clearance.clear)failures.push({sticky_popover_clearance:clearance});
      if(width===375||width===1280)await page.screenshot({path:`reports/sticky-popover-${width}.png`,fullPage:false});await page.locator("#story-rates .term").first().click();
      for(let press=0;press<12;press++){await page.keyboard.press("Tab");const focus=await page.evaluate(()=>{const element=document.activeElement,bar=document.querySelector(".sticky-header").getBoundingClientRect(),rect=element?.getBoundingClientRect?.();return rect?{top:rect.top,bottom:rect.bottom,barBottom:bar.bottom,viewportHeight:innerHeight,insideBar:Boolean(element.closest?.(".sticky-header"))}:null});if(focus&&!focus.insideBar&&focus.bottom>0&&focus.top<focus.viewportHeight&&focus.top<focus.barBottom)failures.push({focus_obscured:focus})}
      results.push({width,visible_triggers:tested,summary_lines:summaryLines,sticky:{initially_hidden:initiallyHidden==="true",midpage_visible:stickyVisible==="false",layout_shift_px:shiftedTop-initialTop,popover_clearance_px:clearance.popoverTop-clearance.barBottom},failures});await page.close();
    }
  }finally{await browser.close()}
  fs.writeFileSync("reports/popover-tests.json",JSON.stringify({generated_at:new Date().toISOString(),results},null,2)+"\n");
  const failures=results.flatMap(result=>result.failures);if(failures.length)throw new Error(`Popover checks failed: ${JSON.stringify(failures)}`);
  console.log(`Popover checks passed: ${results.map(result=>`${result.visible_triggers} triggers at ${result.width}px`).join(", ")}.`);
}finally{server.kill("SIGTERM")}
