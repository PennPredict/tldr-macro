import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";
import {generateSummary} from "../lib/edition-summary.mjs";

const notable=[
  ["CD&R and McKesson agreed to buy Option Care","Shares +32.7%","Option Care provides home and outpatient infusion services. The agreement set a purchase price for the company.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Lamb Weston beat quarterly estimates","Shares +10.8%","Frozen-potato supplier Lamb Weston reported profit and revenue above estimates despite higher freight costs.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Japan and Hong Kong rose; South Korea fell","Indexes mixed","The three Asian markets moved in different directions.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Delta and major banks report next","Earnings calendar","Delta Air Lines reports Friday. Major banks follow next week. The reports include travel demand and borrower repayment data.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"]
];

export default function Home(){const summary=generateSummary(edition);return <main className="shell"><Header updated={edition.updated_at} summary={summary.sentence}/>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=>{const targetId=headline.topic_tag==="oil_and_energy"?"story-oil":headline.topic_tag==="interest_rates_and_yields"?"story-rates":headline.headline.includes("reporting profits")?"story-stocks":undefined;return <HeadlineCard headline={headline} definitions={lensDefinitions} id={targetId} key={headline.headline}/>})}</div></section>
  <section className="notable" aria-labelledby="notable-title"><div className="section-heading"><h2 id="notable-title">Also Today</h2></div><div className="notable-list">{notable.map(([title,signal,text,source,href])=><article key={title}><div className="notable-title"><h3>{title}</h3><span>{signal}</span></div><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div></section>
  <section className="watch" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Coming Up</h2><p>Historical relationship, not prediction.</p></div><div className="event-list">{edition.calendar.map(e=><article key={e.date}><time>{e.date}<small>{e.time}</small></time><div className="event-main"><h3>{e.title}</h3><p>{e.definition}</p>{e.prior?<span>{e.prior}</span>:null}{e.consensus?<span>{e.consensus}</span>:null}</div><div className="scenario scenario-higher"><b>{e.hot_label}</b><p>{e.hot}</p></div><div className="scenario scenario-lower"><b>{e.cool_label}</b><p>{e.cool}</p></div><a href={e.href} target="_blank" rel="noreferrer">{e.source} ↗</a></article>)}</div></section>
  <Footer/>
</main>}
