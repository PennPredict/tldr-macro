import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";

const notable=[
  ["Wage growth slowed","↘ 3.0% wages","Average hourly earnings increased more slowly. Wages shape household purchasing power and companies’ labor costs.","U.S. Bureau of Labor Statistics","https://www.bls.gov/news.release/archives/empsit_10022026.htm"],
  ["Earlier hiring was revised lower","↘ −60K jobs","July and August estimates fell. The economy may have been weaker than first reported.","U.S. Bureau of Labor Statistics","https://www.bls.gov/news.release/archives/empsit_10022026.htm"],
  ["Global markets split","↔ mixed","Japanese stocks rose; French shares fell. Overseas moves reach U.S. readers through currencies, multinational sales, and retirement funds.","The Associated Press","https://apnews.com/article/stock-markets-jobs-fed-rates-inflation-f83cf147deaf5a2361b1ae7eee74a627"],
  ["Takeovers moved two companies","↗ deal news","PTC and RXO rose after acquisition news. Company events can outweigh the broader market.","The Associated Press","https://apnews.com/article/stock-markets-jobs-fed-rates-inflation-f83cf147deaf5a2361b1ae7eee74a627"]
];

export default function Home(){return <main className="shell"><Header updated={edition.updated_at}/>
  <p className="edition-summary">{edition.summary}</p>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=><HeadlineCard headline={headline} definitions={lensDefinitions} key={headline.headline}/>)}</div></section>
  <section className="notable" aria-labelledby="notable-title"><div className="section-heading"><h2 id="notable-title">What Else</h2></div><div className="notable-list">{notable.map(([title,signal,text,source,href])=><article key={title}><div className="notable-title"><h3>{title}</h3><span>{signal}</span></div><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div></section>
  <section className="watch" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Next on TL;DR Macro</h2><p>Each scenario describes a historical relationship, not a prediction.</p></div><div className="event-list">{edition.calendar.map(e=><article key={e.date}><time>{e.date}<small>{e.time}</small></time><div className="event-main"><h3>{e.title}</h3><p>{e.definition}</p><span>{e.prior}</span><span>{e.consensus}</span></div><div className="scenario hotter"><b>Hotter / tighter</b><p>{e.hot}</p></div><div className="scenario cooler"><b>Cooler / easier</b><p>{e.cool}</p></div><a href={e.href} target="_blank" rel="noreferrer">{e.source} ↗</a></article>)}</div></section>
  <Footer/>
</main>}
