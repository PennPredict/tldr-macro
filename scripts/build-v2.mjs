import fs from "node:fs";
import {spawnSync} from "node:child_process";
const path="config/features.json";
const original=fs.readFileSync(path,"utf8");
try{
  const features=JSON.parse(original);
  features.design.v2=true;
  fs.writeFileSync(path,`${JSON.stringify(features,null,2)}\n`);
  const result=spawnSync("npm",["run","build:pages"],{stdio:"inherit",env:process.env});
  if(result.status!==0)process.exitCode=result.status||1;
}finally{
  fs.writeFileSync(path,original);
}
