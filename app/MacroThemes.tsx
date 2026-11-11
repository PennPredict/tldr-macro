"use client";
import {useState} from "react";
import AnnotatedText from "./AnnotatedText";

type Horizon={has_data?:boolean;text:string;as_of:string;verification_status:string;source_name?:string;source_url?:string};
type Evidence={text:string;as_of:string;source_name:string;source_url:string};
type Theme={id:string;title:string;current_status:string;central_question:string;trajectory:string;trajectory_note:string;today:Horizon;six_month:Horizon;long_term:Horizon;recent_evidence:Evidence[]};
const date=(value:string)=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"America/New_York"}).format(new Date(value));

function HorizonRow({label,item}:{label:string;item:Horizon}){if(item.has_data===false)return null;return <div className="theme-horizon"><strong>{label}</strong><p><AnnotatedText text={item.text}/></p><span>As of {date(item.as_of)}{item.source_url?<> · <a href={item.source_url} target="_blank" rel="noreferrer">{item.source_name} ↗</a></>:null}</span></div>}

function ThemeCard({theme,seeToday}:{theme:Theme;seeToday:boolean}){
  const[open,setOpen]=useState(false),hasMore=theme.today.has_data!==false||theme.six_month.has_data!==false||theme.long_term.has_data!==false||theme.recent_evidence.length>0,showTrajectory=theme.trajectory!=="unchanged",status=seeToday&&theme.current_status.includes(";")?theme.current_status.split(";").at(-1)!.trim().replace(/^./,character=>character.toUpperCase()):theme.current_status;
  return <article className="theme-card" id={`theme-${theme.id}`}><div className="theme-card-head"><h3>{theme.title}</h3>{showTrajectory?<span className={`trajectory trajectory-${theme.trajectory}`}><span aria-hidden="true">{theme.trajectory==="strengthening"?"▲":"▼"}</span>{theme.trajectory}</span>:null}</div><p className="theme-question"><strong>Question</strong><span className="theme-question-copy"><AnnotatedText text={theme.central_question}/></span></p><p className="theme-status"><AnnotatedText text={status}/></p><div className="theme-footer">{hasMore?<details className="theme-more" open={open}><summary aria-expanded={open} onClick={event=>{event.preventDefault();setOpen(value=>!value)}}>More</summary><div className="theme-more-body"><HorizonRow label="Today" item={theme.today}/><HorizonRow label="Past six months" item={theme.six_month}/><HorizonRow label="Three to five years" item={theme.long_term}/>{theme.recent_evidence.length?<div className="theme-evidence"><strong>Recent evidence</strong>{theme.recent_evidence.map(item=><p key={item.source_url}><AnnotatedText text={item.text}/> <a href={item.source_url} target="_blank" rel="noreferrer">{item.source_name} · {date(item.as_of)} ↗</a></p>)}</div>:null}</div></details>:<span/>}{seeToday?<a className="theme-see-today" href="#changed-today">See today ↓</a>:null}</div></article>
}

export default function MacroThemes({themes,storyTopics}:{themes:Theme[];storyTopics:string[]}){const todayThemes=new Set<string>(storyTopics.map(topic=>topic==="companies"||topic==="market_volatility"?"equities-ai":topic==="oil_and_energy"?"inflation-fed":""));return <section className="macro-themes" id="themes" aria-labelledby="themes-title"><div className="section-heading"><h2 id="themes-title">Themes</h2></div><div className="theme-grid">{themes.map(theme=><ThemeCard theme={theme} seeToday={todayThemes.has(theme.id)} key={theme.id}/>)}</div></section>}
