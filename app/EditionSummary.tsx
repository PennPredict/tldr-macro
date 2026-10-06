"use client";

import AnnotatedText from "./AnnotatedText";

const subjects=["the stock market","government borrowing rates","oil prices"];
const targets=["story-stocks","story-rates","story-oil"];

export default function EditionSummary({text}:{text:string}){
  const lower=text.toLowerCase(),starts=subjects.map(subject=>lower.indexOf(subject));
  if(starts.some(index=>index<0))return <p className="edition-summary"><AnnotatedText text={text}/></p>;
  const clauses=starts.map((start,index)=>text.slice(start,index<starts.length-1?starts[index+1]:text.length));
  return <p className="edition-summary">{clauses.map((clause,index)=><span className="summary-clause" role="link" tabIndex={0} key={targets[index]} aria-label={`Read more about ${subjects[index]}`} onClick={()=>document.getElementById(targets[index])?.scrollIntoView({behavior:"smooth",block:"start"})} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();document.getElementById(targets[index])?.scrollIntoView({behavior:"smooth",block:"start"})}}}><AnnotatedText text={clause}/><span className="summary-jump" aria-hidden="true">↓</span></span>)}</p>;
}
