import Link from "next/link";

export const fullDisclaimer = "Educational context only; not investment advice. Data may be delayed or wrong. Verify primary sources.";

export function Header({ updated }: { updated?: string }) {
  return <header className="topbar"><div><Link className="wordmark" href="/"><strong>TL;DR</strong> Macro</Link><p>Market intelligence, for everyone.</p></div><div className="edition"><span>Morning edition</span><time dateTime={updated}>{updated ? "Oct 5, 2026 · 10:10 a.m. ET" : "About this briefing"}</time></div></header>;
}

export function Footer() {
  return <footer><nav aria-label="Footer navigation"><Link href="/about">About</Link></nav><p className="footer-note">{fullDisclaimer}</p></footer>;
}
