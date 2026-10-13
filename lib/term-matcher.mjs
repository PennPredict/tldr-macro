const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const isAcronym=value=>/^[A-Z0-9&.\-]{2,}$/.test(value);

export function findTermMarkers(text,terms,seen=new Set()){
  const candidates=[];
  for(const term of terms){
    if(seen.has(term.id))continue;
    for(const surface of [...term.surface_forms].sort((a,b)=>b.length-a.length)){
      const flags=isAcronym(surface)?"gu":"giu";
      const pattern=new RegExp(`(?<![\\p{L}\\p{N}])${escape(surface)}(?![\\p{L}\\p{N}])`,flags);
      const match=pattern.exec(text);
      if(match)candidates.push({start:match.index,end:match.index+match[0].length,term,surface:match[0]});
    }
  }
  candidates.sort((a,b)=>a.start-b.start||(b.end-b.start)-(a.end-a.start));
  const output=[];const used=new Set();let cursor=0;
  for(const candidate of candidates){
    if(candidate.start<cursor||used.has(candidate.term.id))continue;
    output.push(candidate);used.add(candidate.term.id);seen.add(candidate.term.id);cursor=candidate.end;
  }
  return output;
}
