"use client";

import {useEffect,useRef,useState} from "react";
import AnnotatedText from "./AnnotatedText";

export default function StickyHeader({updated,label,summary}:{updated?:string;label:string;summary:string}){
  const [pastHeader,setPastHeader]=useState(false),[mobileDown,setMobileDown]=useState(false),lastY=useRef(0);
  useEffect(()=>{const header=document.querySelector(".topbar");if(!header)return;const observer=new IntersectionObserver(([entry])=>setPastHeader(!entry.isIntersecting),{threshold:0});observer.observe(header);return()=>observer.disconnect()},[]);
  useEffect(()=>{const onScroll=()=>{if(window.innerWidth>=600){setMobileDown(false);lastY.current=window.scrollY;return}const delta=window.scrollY-lastY.current;if(Math.abs(delta)>=8){setMobileDown(delta>0);lastY.current=window.scrollY}};lastY.current=window.scrollY;window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  const visible=pastHeader&&!mobileDown;
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  return <header className="sticky-header" data-visible={visible} aria-hidden={!visible} aria-label="TL;DR Macro"><a className="sticky-logo" href="#top" aria-label="TL;DR Macro home"><svg viewBox="0 0 38 24" aria-hidden="true"><path d="M1 18 7 12l5 3 5-8 6 6 5-4 9 3"/><path d="M1 11 8 7l5 2 5-6 7 7 12 2"/></svg><span className="sticky-wordmark">TL<i>;</i>DR Macro</span></a><p className="sticky-summary"><AnnotatedText text={summary} termActions={{stocks:()=>scrollTo("story-stocks"),"treasury-yield":()=>scrollTo("story-rates"),"oil-prices":()=>scrollTo("story-oil")}}/></p><div className="sticky-edition"><span>Morning edition</span><b aria-hidden="true">·</b><time dateTime={updated}>{label}</time></div></header>;
}
