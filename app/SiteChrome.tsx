import Link from "next/link";
import Image from "next/image";
import TermPopover from "./TermPopover";
import StickyHeader from "./StickyHeader";
import BackToTopLink from "./BackToTopLink";
import EditionSummary from "./EditionSummary";

export const fullDisclaimer = "Educational context only; not investment advice. Check primary sources.";

function BrandImage({ placement }: { placement: "header" | "footer" }) {
  if (placement === "footer") {
    return <BackToTopLink>TL<span>;</span>DR Macro</BackToTopLink>;
  }
  const alt=placement === "header" ? "TL;DR Macro. Market intelligence, for everyone." : "TL;DR Macro";
  return <Link className={`brand-image brand-image-${placement}`} href="/" aria-label="TL;DR Macro home"><Image src="/tldr-macro-logo-wide.png" alt={alt} width={2172} height={724} priority={placement === "header"} /></Link>;
}

export function Header({ updated, summary }: { updated?: string; summary:string }) {
  const format=(includeYear:boolean)=>updated?`${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",...(includeYear?{year:"numeric"}:{}),hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(updated))} ET`:"About this briefing";
  const label=format(true);
  const compactLabel=format(false);
  return <><header className="topbar" id="top"><div className="topbar-main"><BrandImage placement="header" /><div className="edition"><span>Morning edition</span><time dateTime={updated}>{label}</time></div></div><EditionSummary text={summary}/></header><StickyHeader updated={updated} label={compactLabel} summary={summary}/></>;
}

export function Footer() {
  const about=<div className="about-popover-body"><span>Low-cortisol explanations.</span><span><strong>Limits</strong>concision reduces nuance; keep reading.</span></div>;
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><TermPopover className="about-trigger" label="Mission" ariaLabel="About TL;DR Macro" body={about}>About</TermPopover></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
