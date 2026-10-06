import Link from "next/link";

export const fullDisclaimer = "Educational context only; not investment advice. Data may be delayed or wrong. Verify primary sources.";

function ConvergenceMark({wide=false}:{wide?:boolean}) {
  return <span className={wide?"convergence-mark convergence-mark-wide":"convergence-mark"} aria-hidden="true"><i/><i/><i/><i/></span>;
}

export function Header({ updated }: { updated?: string }) {
  const label=updated?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",timeZone:"America/New_York",timeZoneName:"short"}).format(new Date(updated)):"About this briefing";
  return <header className="topbar"><div className="brand-lockup"><ConvergenceMark/><div><Link className="wordmark" href="/"><strong>TL<span>;</span>DR</strong> Macro</Link><p>Market intelligence, for everyone.</p></div></div><div className="edition"><span>Morning edition</span><time dateTime={updated}>{label}</time></div></header>;
}

export function Footer() {
  return <footer><div className="footer-horizon"><ConvergenceMark wide/></div><div className="footer-meta"><nav aria-label="Footer navigation"><Link href="/about">About</Link></nav><p className="footer-note">{fullDisclaimer}</p></div></footer>;
}
