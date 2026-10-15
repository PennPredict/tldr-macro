"use client";

import AnnotatedText from "./AnnotatedText";

const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});

export default function EditionSummary({text}:{text:string}){
  return <p className="edition-summary"><AnnotatedText text={text} termActions={{"cpi-release-clause":()=>scrollTo("story-inflation"),"treasury-yield":()=>scrollTo("story-rates"),nasdaq:()=>scrollTo("story-rates")}}/></p>;
}
