"use client";
import {useEffect,useState} from "react";
export default function PopoverHint(){const [visible,setVisible]=useState(false);useEffect(()=>{const timer=setTimeout(()=>{try{setVisible(localStorage.getItem("tldrm-popover-hint")!=="dismissed")}catch{setVisible(true)}},0);return()=>clearTimeout(timer)},[]);if(!visible)return null;return <p className="popover-hint">Tap or hover underlined words for definitions.<button type="button" aria-label="Dismiss definitions hint" onClick={()=>{setVisible(false);try{localStorage.setItem("tldrm-popover-hint","dismissed")}catch{}}}>×</button></p>}
