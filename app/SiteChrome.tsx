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
  return <><header className="topbar" id="top"><div className="topbar-main"><BrandImage placement="header" /><div className="edition"><time dateTime={updated}>{label}</time></div></div><div className="daily-brief"><div className="daily-brief-copy"><p className="brief-kicker">Latest verified market brief</p><EditionSummary text={summary}/><p className="summary-why">{insight}</p></div><div className="brief-visual" aria-hidden="true"><svg viewBox="0 0 560 260" role="presentation"><defs><linearGradient id="brief-signal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7dbbea"/><stop offset=".52" stopColor="#70e5b2"/><stop offset="1" stopColor="#e9a96f"/></linearGradient><radialGradient id="brief-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#70e5b2" stopOpacity=".22"/><stop offset="1" stopColor="#70e5b2" stopOpacity="0"/></radialGradient></defs><circle cx="370" cy="126" r="126" fill="url(#brief-glow)"/><path className="brief-grid-line" d="M20 48h520M20 104h520M20 160h520M20 216h520M74 24v214M182 24v214M290 24v214M398 24v214M506 24v214"/><path className="brief-signal-line brief-signal-line-muted" d="M22 184 74 160l46 10 56-48 50 20 48-72 50 42 52-16 48 34 54-18 58 18"/><path className="brief-signal-line" d="M22 192 74 170l46 5 56-39 50 13 48-45 50 23 52-12 48 20 54-13 58 8"/><path className="brief-signal-line brief-signal-line-soft" d="M22 200 74 181l46 1 56-27 50 6 48-22 50 8 52-7 48 10 54-5 58 1"/><circle cx="536" cy="130" r="5" fill="#70e5b2"/></svg></div></div></header><StickyHeader updated={updated} label={compactLabel} summary={summary}/></>;
}

export function Footer() {
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><Link href="/about/">About &amp; methodology</Link><Link href="/glossary/">Glossary</Link><Link href="/archive/">Archive</Link><a href="/rss.xml">RSS</a></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
