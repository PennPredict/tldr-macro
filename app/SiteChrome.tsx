import Link from "next/link";
import Image from "next/image";

export const fullDisclaimer = "Educational context only; not investment advice. Verify as you go.";

function BrandImage({ placement }: { placement: "header" | "footer" }) {
  const alt=placement === "header" ? "TL;DR Macro. Market intelligence, for everyone." : "TL;DR Macro";
  return <Link className={`brand-image brand-image-${placement}`} href="/" aria-label="TL;DR Macro home"><Image src="/tldr-macro-logo-wide.png" alt={alt} width={2172} height={724} priority={placement === "header"} /></Link>;
}

export function Header({ updated }: { updated?: string }) {
  const label=updated?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York",timeZoneName:"short"}).format(new Date(updated)):"About this briefing";
  return <header className="topbar"><BrandImage placement="header" /><div className="edition"><span>Morning edition</span><time dateTime={updated}>{label}</time></div></header>;
}

export function Footer() {
  return <footer><div className="footer-meta"><div><nav aria-label="Footer navigation"><a href="/about/">About</a></nav><p className="footer-note">{fullDisclaimer}</p></div><BrandImage placement="footer" /></div></footer>;
}
