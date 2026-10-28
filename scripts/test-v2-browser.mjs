import {chromium} from "playwright";
import fs from "node:fs";
const base=process.env.V2_URL||"http://127.0.0.1:4184";
fs.mkdirSync("outputs/v2-design",{recursive:true});
const browser=await chromium.launch({headless:true});
for(const width of [375,768,1280,1440]){const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(base,{waitUntil:"networkidle"});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(overflow>1)throw new Error(`${width}px horizontal overflow: ${overflow}px`);await page.screenshot({path:`outputs/v2-design/home-${width}.png`,fullPage:true});await page.close()}
await browser.close();console.log("V2 browser checks and screenshots passed at 375, 768, 1280, and 1440px.");
