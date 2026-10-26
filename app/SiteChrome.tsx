import Link from "next/link";
import StickyHeader from "./StickyHeader";
import BackToTopLink from "./BackToTopLink";
import EditionSummary from "./EditionSummary";

export const fullDisclaimer = "Educational context only; not investment advice. Check primary sources.";

function BrandImage({ placement }: { placement: "header" | "footer" }) {
  if (placement === "footer") {
    return <BackToTopLink>TL<span>;</span>DR Macro</BackToTopLink>;
  }
  const alt=placement === "header" ? "TL;DR Macro. Market intelligence, for everyone." : "TL;DR Macro";
  return <Link className={`brand-image brand-image-${placement}`} href="./" aria-label="TL;DR Macro home"><img src="./tldr-macro-logo-wide.png" alt={alt} width="2172" height="724" fetchPriority="high" /></Link>;
}

export function Header({ updated, summary, insight }: { updated?: string; summary:string; insight:string }) {
  const format=(includeYear:boolean)=>updated?`${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",...(includeYear?{year:"numeric"}:{}),hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(updated))} ET`:"About this briefing";
  const label=format(true);
  const compactLabel=format(false);
  return <><header className="topbar" id="top"><div className="topbar-main"><BrandImage placement="header" /><div className="edition"><time dateTime={updated}>{label}</time></div></div><div className="daily-brief"><p className="brief-kicker">Latest verified market brief</p><EditionSummary text={summary}/><p className="summary-why">{insight}</p></div></header><StickyHeader updated={updated} label={compactLabel} summary={summary}/></>;
}

export function Footer() {
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><Link href="/about/">About &amp; methodology</Link><Link href="/glossary/">Glossary</Link><Link href="/archive/">Archive</Link><a href="/rss.xml">RSS</a></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
