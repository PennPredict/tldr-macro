import Link from "next/link";
import StickyHeader from "./StickyHeader";
import BackToTopLink from "./BackToTopLink";
import heroConfig from "../config/hero.json";
import edition from "../content/current-edition.json";
import {generateHeroCopy} from "../lib/hero-copy.mjs";
import {buildHeroVisual} from "../lib/hero-visual.mjs";
import HeroVisual from "./HeroVisual";

export const fullDisclaimer = "Educational context only; not investment advice. Check primary sources.";

function BrandImage({ placement }: { placement: "header" | "footer" }) {
  if (placement === "footer") {
    return <BackToTopLink>TL<span>;</span>DR Macro</BackToTopLink>;
  }
  const alt=placement === "header" ? "TL;DR Macro. Market intelligence, for everyone." : "TL;DR Macro";
  return <Link className={`brand-image brand-image-${placement}`} href="./" aria-label="TL;DR Macro home"><img src="./tldr-macro-logo-wide.png" alt={alt} width="2172" height="724" fetchPriority="high" /></Link>;
}

export function Header({ updated, summary, heroHeadline, heroSummary }: { updated?: string; summary:string; heroHeadline:string; heroSummary:string }) {
  const briefTime=updated?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(updated)):"";
  const hero=generateHeroCopy(edition),visual=buildHeroVisual(edition,hero,heroConfig.visual);
  return <><header className="topbar" id="top"><div className="daily-brief"><div className="daily-brief-copy"><p className="brief-kicker">Today&apos;s brief{briefTime?<> · <time dateTime={updated}>{briefTime} ET</time></>:null}</p><h1 className="hero-headline">{heroHeadline}</h1><p className="summary-why">{heroSummary}</p></div><HeroVisual model={visual}/></div></header><StickyHeader summary={summary}/></>;
}

export function Footer() {
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><Link href="/about/">About &amp; methodology</Link><Link href="/archive/">Archive</Link><a href="/rss.xml">RSS</a></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
