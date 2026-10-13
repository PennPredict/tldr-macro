"use client";
import {useEffect,useState} from "react";
import {getEditionStatus} from "../lib/edition-status.mjs";
export default function EditionStatus({published}:{published:string}){const [message,setMessage]=useState("");useEffect(()=>{const timer=setTimeout(()=>setMessage(getEditionStatus(published)),0);return()=>clearTimeout(timer)},[published]);return message?<p className="stale-note" role="status">{message}</p>:null}
