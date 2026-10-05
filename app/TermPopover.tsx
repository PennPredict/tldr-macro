"use client";

import {useEffect,useId,useRef,useState} from "react";

type Props={children:React.ReactNode;label:string;title?:string;body:React.ReactNode;className?:string;ariaLabel?:string};

export default function TermPopover({children,label,title,body,className="term",ariaLabel}:Props){
  const id=useId(),buttonRef=useRef<HTMLButtonElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [open,setOpen]=useState(false),[pinned,setPinned]=useState(false),[position,setPosition]=useState({top:0,left:0});
  const close=(restore=false)=>{setOpen(false);setPinned(false);if(restore)requestAnimationFrame(()=>buttonRef.current?.focus());};
  const place=()=>{const rect=buttonRef.current?.getBoundingClientRect();if(!rect)return;const width=Math.min(280,window.innerWidth-24);const left=Math.max(12,Math.min(rect.left,window.innerWidth-width-12));let top=rect.bottom+8;if(top+190>window.innerHeight)top=Math.max(12,rect.top-198);setPosition({top,left});};
  const show=()=>{place();window.dispatchEvent(new CustomEvent("term-popover-open",{detail:id}));setOpen(true);};
  useEffect(()=>{const other=(event:Event)=>{if((event as CustomEvent).detail!==id)close(false)};const outside=(event:PointerEvent)=>{if(open&&!buttonRef.current?.parentElement?.contains(event.target as Node))close(false)};const key=(event:KeyboardEvent)=>{if(event.key==="Escape"&&open){event.preventDefault();close(true)}};window.addEventListener("term-popover-open",other);document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);window.addEventListener("resize",place);return()=>{window.removeEventListener("term-popover-open",other);document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);window.removeEventListener("resize",place)}},[id,open]);
  return <span className="popover-wrap" onPointerEnter={event=>{if(event.pointerType!=="touch"){timer.current=setTimeout(show,150)}}} onPointerLeave={()=>{if(timer.current)clearTimeout(timer.current);if(!pinned)setOpen(false)}}>
    <button ref={buttonRef} type="button" className={className} aria-label={ariaLabel} aria-expanded={open} aria-controls={id} onClick={()=>{if(open&&pinned)close(true);else{show();setPinned(true)}}}>{children}</button>
    {open?<span id={id} role="tooltip" className="term-popover" style={position}><small>{label}</small>{title?<strong>{title}</strong>:null}<span>{body}</span></span>:null}
  </span>;
}
