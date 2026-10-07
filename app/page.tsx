import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";
import {generateSummary} from "../lib/edition-summary.mjs";
import globalItems from "../content/global-items.json";
import EventCalendar from "./EventCalendar";

export default function Home(){const summary=generateSummary(edition);return <main className="shell"><Header updated={edition.updated_at} summary={summary.sentence}/>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=>{const targetId=headline.topic_tag==="oil_and_energy"?"story-oil":headline.topic_tag==="interest_rates_and_yields"?"story-rates":headline.topic_tag==="market_volatility"?"story-stocks":undefined;return <HeadlineCard headline={headline} definitions={lensDefinitions} id={targetId} key={headline.headline}/>})}</div></section>
  <section className="notable global-section" id="global" aria-labelledby="global-title"><div className="section-heading"><h2 id="global-title">TL;DR Global</h2></div><div className="notable-list">{[...globalItems].filter(item=>item.tag!=="Company"&&(!("qualifies" in item)||item.qualifies!==false)).sort((a,b)=>b.importance_score-a.importance_score).map(item=>{const context="context" in item&&item.context&&!/^Developing as of/i.test(item.context)?item.context:"",significance=item.why_it_matters.replace(/^Why it matters:\s*/,"");return <article key={item.headline}><div className="notable-title"><div><small>{item.tag}</small><h3>{item.headline}</h3></div>{"badge" in item&&item.badge?<span className={String(item.badge).includes("−")?"down":"up"}>{item.badge}</span>:null}</div><p>{item.what} {context} {significance}</p><div className="global-sources">{item.sources.map(source=><a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.name} ↗</a>)}</div></article>})}</div></section>
  <section className="watch" id="next" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Next on TL;DRM</h2><p>Historical relationship, not prediction.</p></div><EventCalendar events={edition.calendar} published={edition.updated_at}/></section>
  <Footer/>
</main>}
