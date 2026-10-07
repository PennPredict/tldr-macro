"use client";

import {useCallback} from "react";

export default function BackToTopLink({children}:{children:React.ReactNode}){
  const go=useCallback((event:React.MouseEvent<HTMLAnchorElement>)=>{
    event.preventDefault();
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduced?"auto":"smooth"});
    window.history.replaceState(null,"",`${window.location.pathname}${window.location.search}`);
    const focus=()=>document.querySelector<HTMLElement>(".brand-image-header")?.focus({preventScroll:true});
    if(reduced)focus();else window.setTimeout(focus,420);
  },[]);
  return <a className="brand-image-footer compact-wordmark" href="#top" aria-label="Back to top" onClick={go}>{children}</a>;
}
