import Link from "next/link";
import edition from "../content/current-edition.json";
import extras from "../content/extra-markets.json";
import headlines from "../content/headlines.json";
import globals from "../content/global-items.json";
import StickyHeader from "./StickyHeader";
import EditionStatus from "./EditionStatus";
import V2MarketDashboard from "./V2MarketDashboard";
import V2Stories from "./V2Stories";
import V2Flow from "./V2Flow";
import V2Global from "./V2Global";
import V2NextBottom from "./V2NextBottom";
import {v2Headline,v2Summary} from "../lib/v2-presentation";

export default function V2Home(){
  const title=v2Headline(edition.markets,edition.calendar);
  const summary=v2Summary(edition.markets);
  const count=[title,summary,...headlines.flatMap(item=>[item.headline,item.commentary]),...globals.flatMap(item=>[item.headline,item.what,item.why_it_matters])].join(" ").trim().split(/\s+/).length;
  const read=Math.max(1,Math.ceil(count/200));
  const stamp=new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(edition.updated_at));
  return <main className="v2-shell" id="top">
    <header className="v2-header"><div className="v2-header-row"><Link href="#top" aria-label="TL;DR Macro home"><img src="/tldr-macro-logo-wide.png" alt="TL;DR Macro"/></Link><div><time dateTime={edition.updated_at}>{stamp} ET</time><EditionStatus published={edition.updated_at}/></div></div><nav aria-label="Section navigation"><a href="#market-title">Markets</a><a href="#stories-title">Stories</a><a href="#global">Global</a><a href="#next">Next</a></nav></header>
    <StickyHeader updated={edition.updated_at} label={stamp} summary={title}/>
    <section className="v2-hero"><small>Today’s brief</small><h1>{title}</h1><p>{summary}</p>{read<=5?<span>{read} min read</span>:null}</section>
    <V2MarketDashboard markets={edition.markets} extras={extras} updated={edition.updated_at}/>
    <V2Stories stories={headlines}/><V2Flow/><V2Global items={globals}/>
    <V2NextBottom events={edition.calendar} updated={edition.updated_at} summary={summary} stories={headlines}/>
    <footer className="v2-footer"><nav><Link href="/about/">About &amp; methodology</Link><Link href="/archive/">Archive</Link><a href="/rss.xml">RSS</a></nav><p>Educational context only; not investment advice. Check primary sources.</p><a href="#top">TL<span>;</span>DRM</a></footer>
  </main>
}
