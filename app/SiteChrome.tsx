import Link from "next/link";
import Image from "next/image";
import TermPopover from "./TermPopover";
import StickyHeader from "./StickyHeader";

export const fullDisclaimer = "Educational context only; not investment advice. Check primary sources.";

function BrandImage({ placement }: { placement: "header" | "footer" }) {
  if (placement === "footer") {
    return <Link className="brand-image-footer compact-wordmark" href="/" aria-label="TL;DR Macro home">TL<span>;</span>DR Macro</Link>;
  }
  const alt=placement === "header" ? "TL;DR Macro. Market intelligence, for everyone." : "TL;DR Macro";
  return <Link className={`brand-image brand-image-${placement}`} href="/" aria-label="TL;DR Macro home"><Image src="/tldr-macro-logo-wide.png" alt={alt} width={2172} height={724} priority={placement === "header"} /></Link>;
}

export function Header({ updated, summary }: { updated?: string; summary:string }) {
  const format=(includeYear:boolean)=>updated?`${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",...(includeYear?{year:"numeric"}:{}),hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(new Date(updated))} ET`:"About this briefing";
  const label=format(true);
  const compactLabel=format(false);
  return <><header className="topbar" id="top"><BrandImage placement="header" /><div className="edition"><span>Morning edition</span><time dateTime={updated}>{label}</time></div></header><StickyHeader updated={updated} label={compactLabel} summary={summary}/></>;
}

export function Footer() {
  const about=<div className="about-popover-body"><span><strong>Mission</strong>Markets in plain English · one connected economy · low cortisol, low effort</span><span><strong>For</strong>Non-econ students · retail investors · finance recruits · busy readers</span><span><strong>Limits</strong>Intraday moves · revised data · omitted nuance · possible errors · no advice</span><span><strong>Rule</strong>Primary sources first · check as you go</span></div>;
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><TermPopover className="about-trigger" label="About TL;DR Macro" ariaLabel="About TL;DR Macro" body={about}>About</TermPopover></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
