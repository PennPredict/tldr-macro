import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";
import {generateSummary} from "../lib/edition-summary.mjs";
import globalItems from "../content/global-items.json";
import EventCalendar from "./EventCalendar";
import AnnotatedText from "./AnnotatedText";
import EconomicThread from "./EconomicThread";
import threadConfig from "../config/thread.json";
import ReaderTools from "./ReaderTools";
import renderedThread from "../content/economic-thread.rendered.json";

export default function Home(){const summary=generateSummary(edition),positions=threadConfig.stories as Record<string,"Report"|"Reaction"|"Background">,orderedHeadlines=[...headlines].sort((a,b)=>threadConfig.story_order.indexOf(positions[a.topic_tag])-threadConfig.story_order.indexOf(positions[b.topic_tag]));return <main className="shell"><Header updated={edition.updated_at} summary={summary.sentence} insight={renderedThread.takeaway}/><ReaderTools/>
  <EconomicThread/>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{orderedHeadlines.map(headline=>{const targetId=headline.topic_tag==="inflation_reports"?"story-inflation":headline.topic_tag==="interest_rates_and_yields"?"story-rates":headline.topic_tag==="companies"?"story-background":undefined;return <HeadlineCard headline={headline} definitions={lensDefinitions} id={targetId} position={positions[headline.topic_tag]||"Background"} key={headline.headline}/>})}</div></section>
  <section className="notable global-section" id="global" aria-labelledby="global-title"><div className="section-heading"><h2 id="global-title">TL;DR Global</h2></div><div className="notable-list">{[...globalItems].filter(item=>item.tag!=="Company"&&(!("qualifies" in item)||item.qualifies!==false)).sort((a,b)=>b.importance_score-a.importance_score).map(item=>{const context="context" in item&&item.context&&!/^Developing as of/i.test(item.context)?item.context:"",significance=item.why_it_matters.replace(/^Why it matters:\s*/,""),body=`${item.what} ${context} ${significance}`.replace(/\s+/g," ").trim();return <article key={item.headline}><div className="notable-title"><div><small>{item.tag}</small><h3>{item.headline}</h3></div></div><p><AnnotatedText text={body}/></p><div className="global-sources">{item.sources.map(source=><a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.name} ↗</a>)}</div></article>})}</div></section>
  <section className="watch" id="next" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Next on TL;DR Macro</h2><p>Historical relationship, not prediction.</p></div><EventCalendar events={edition.calendar} published={edition.updated_at}/></section>
  <Footer/>
</main>}
