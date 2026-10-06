"use client";

import {useEffect,useId,useLayoutEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";

type Props={children:React.ReactNode;label:string;title?:string;body:React.ReactNode;className?:string;ariaLabel?:string;onActivate?:()=>void};

export default function TermPopover({children,label,title,body,className="term",ariaLabel,onActivate}:Props){
  const id=useId(),buttonRef=useRef<HTMLButtonElement>(null),popoverRef=useRef<HTMLSpanElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [open,setOpen]=useState(false),[pinned,setPinned]=useState(false),[position,setPosition]=useState({top:0,left:0});
  const close=(restore=false)=>{setOpen(false);setPinned(false);if(restore)requestAnimationFrame(()=>buttonRef.current?.focus());};
  const place=()=>{const trigger=buttonRef.current?.getBoundingClientRect(),popover=popoverRef.current?.getBoundingClientRect();if(!trigger||!popover)return;const margin=8,gap=6,mobile=window.innerWidth<480,bar=document.querySelector<HTMLElement>('.sticky-header[data-visible="true"]'),minimumTop=(bar?.getBoundingClientRect().bottom||0)+margin;let left=mobile?(window.innerWidth-popover.width)/2:trigger.left;left=Math.max(margin,Math.min(left,window.innerWidth-popover.width-margin));const below=trigger.bottom+gap,above=trigger.top-popover.height-gap;let top=below+popover.height<=window.innerHeight-margin?below:above>=minimumTop?above:Math.max(minimumTop,below);top=Math.min(top,window.innerHeight-popover.height-margin);setPosition({top,left});};
  const show=()=>{window.dispatchEvent(new CustomEvent("term-popover-open",{detail:id}));setOpen(true);};
  useLayoutEffect(()=>{if(open)place()},[open,body,title]);
  useEffect(()=>{const other=(event:Event)=>{if((event as CustomEvent).detail!==id)close(false)};const outside=(event:PointerEvent)=>{const target=event.target as Node;if(open&&!buttonRef.current?.contains(target)&&!popoverRef.current?.contains(target))close(false)};const key=(event:KeyboardEvent)=>{if(event.key==="Escape"&&open){event.preventDefault();close(true)}};window.addEventListener("term-popover-open",other);document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);window.addEventListener("resize",place);window.addEventListener("scroll",place,true);return()=>{window.removeEventListener("term-popover-open",other);document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);window.removeEventListener("resize",place);window.removeEventListener("scroll",place,true)}},[id,open]);
  const popover=open&&typeof document!=="undefined"?createPortal(<span ref={popoverRef} id={id} role="tooltip" className="term-popover" style={position}><small>{label}</small>{title?<strong>{title}</strong>:null}<span>{body}</span></span>,document.body):null;
  return <span className="popover-wrap" onPointerEnter={event=>{if(event.pointerType!=="touch"){timer.current=setTimeout(show,150)}}} onPointerLeave={()=>{if(timer.current)clearTimeout(timer.current);if(!pinned)setOpen(false)}}>
    <button ref={buttonRef} type="button" className={className} aria-label={ariaLabel} aria-expanded={open} aria-controls={id} onClick={event=>{event.stopPropagation();if(onActivate){close(false);onActivate();return}if(open&&pinned)close(true);else{show();setPinned(true)}}}>{children}</button>
    {popover}
  </span>;
}
