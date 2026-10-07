import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";
import {generateSummary} from "../lib/edition-summary.mjs";

const notable=[
  ["Stocks fell across Europe and Asia","Global indexes lower","France's CAC 40 fell 1.1%, while South Korea's KOSPI declined 2%. The moves show that the pullback extended beyond the United States.","The Associated Press","https://apnews.com/article/stocks-markets-rates-oil-earnings-44b75c188756038371cf3112ede9cee8"],
  ["The IMF urged faster action on debt","Government debt","The International Monetary Fund warned that rising public debt can leave governments less room to respond to future shocks.","International Monetary Fund","https://www.imf.org/en/News"],
  ["Worthington Steel reported weaker results","Shares −7.4%","The metals processor reported quarterly results below analyst estimates. Company reports can move individual stocks even when the wider market follows rates.","The Associated Press","https://apnews.com/article/stocks-markets-rates-oil-earnings-44b75c188756038371cf3112ede9cee8"],
  ["Constellation Brands beat profit estimates","Shares +1.4%","The seller of Modelo beer reported stronger profit than expected, while its full-year forecast midpoint came in below analyst estimates.","SEC company filings","https://www.sec.gov/edgar/search-and-access"]
];

export default function Home(){const summary=generateSummary(edition);return <main className="shell"><Header updated={edition.updated_at} summary={summary.sentence}/>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=>{const targetId=headline.topic_tag==="oil_and_energy"?"story-oil":headline.topic_tag==="interest_rates_and_yields"?"story-rates":headline.topic_tag==="market_volatility"?"story-stocks":undefined;return <HeadlineCard headline={headline} definitions={lensDefinitions} id={targetId} key={headline.headline}/>})}</div></section>
  <section className="notable" aria-labelledby="notable-title"><div className="section-heading"><h2 id="notable-title">Also Today</h2></div><div className="notable-list">{notable.map(([title,signal,text,source,href])=><article key={title}><div className="notable-title"><h3>{title}</h3><span>{signal}</span></div><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div></section>
  <section className="watch" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Coming Up</h2><p>Historical relationship, not prediction.</p></div><div className="event-list">{edition.calendar.map(e=><article key={e.date}><time>{e.date}<small>{e.time}</small></time><div className="event-main"><h3>{e.title}</h3><p>{e.definition}</p>{e.prior?<span>{e.prior}</span>:null}{e.consensus?<span>{e.consensus}</span>:null}</div><div className="scenario scenario-higher"><b>{e.hot_label}</b><p>{e.hot}</p></div><div className="scenario scenario-lower"><b>{e.cool_label}</b><p>{e.cool}</p></div><a href={e.href} target="_blank" rel="noreferrer">{e.source} ↗</a></article>)}</div></section>
  <Footer/>
</main>}
