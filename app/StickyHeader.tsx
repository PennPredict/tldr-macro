"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";

export default function StickyHeader({updated,label}:{updated?:string;label:string}){
  const [pastHeader,setPastHeader]=useState(false),[mobileDown,setMobileDown]=useState(false),lastY=useRef(0);
  useEffect(()=>{const header=document.querySelector(".topbar");if(!header)return;const observer=new IntersectionObserver(([entry])=>setPastHeader(!entry.isIntersecting),{threshold:0});observer.observe(header);return()=>observer.disconnect()},[]);
  useEffect(()=>{const onScroll=()=>{if(window.innerWidth>=600){setMobileDown(false);lastY.current=window.scrollY;return}const delta=window.scrollY-lastY.current;if(Math.abs(delta)>=8){setMobileDown(delta>0);lastY.current=window.scrollY}};lastY.current=window.scrollY;window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  const visible=pastHeader&&!mobileDown;
  return <header className="sticky-header" data-visible={visible} aria-hidden={!visible} aria-label="TL;DR Macro"><Link href="#top" className="sticky-logo compact-wordmark" aria-label="TL;DR Macro, back to top" tabIndex={visible?0:-1}>TL<span>;</span>DRM</Link><div className="sticky-edition"><span>Morning edition</span><b aria-hidden="true">·</b><time dateTime={updated}>{label}</time></div></header>;
}
