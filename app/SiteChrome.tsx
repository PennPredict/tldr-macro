import Link from "next/link";

export const fullDisclaimer = "TL;DR Macro is for educational purposes only. It is not investment, financial, legal, or tax advice and does not recommend any security or strategy. Markets involve risk. Data may be delayed or contain errors. Verify with primary sources.";

export function Header({ updated }: { updated?: string }) {
  return <header className="topbar"><div><Link className="wordmark" href="/"><strong>TL;DR</strong> Macro</Link><p>Market intelligence for everyone.</p></div><div className="edition"><span>Morning edition</span><time dateTime={updated}>{updated ? "Oct 5, 2026 · 10:10 a.m. ET" : "About this briefing"}</time></div></header>;
}

export function Footer() {
  return <footer><p>{fullDisclaimer}</p><nav aria-label="Footer navigation"><Link href="/about">About</Link></nav><p><strong>Concision leaves out nuance.</strong> Use source links for full releases, methods, revisions, and context.</p></footer>;
}
