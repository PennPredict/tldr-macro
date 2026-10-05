import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";

const notable=[
  ["Wage growth slowed","Average hourly earnings increased more slowly. Non-experts may care, as wages influence both household purchasing power and the labor costs that can reach consumer prices.","U.S. Bureau of Labor Statistics","https://www.bls.gov/news.release/archives/empsit_10022026.htm"],
  ["Earlier hiring was revised lower","The government lowered its July and August job estimates. Revisions matter, for the first report is incomplete and the economy may have been weaker than initially reported.","U.S. Bureau of Labor Statistics","https://www.bls.gov/news.release/archives/empsit_10022026.htm"],
  ["Global markets split","Japanese stocks rose while French shares fell amid different technology and fiscal-policy concerns. Overseas moves can reach U.S. readers through multinational company sales, currencies, and retirement funds.","The Associated Press","https://apnews.com/article/stock-markets-jobs-fed-rates-inflation-f83cf147deaf5a2361b1ae7eee74a627"],
  ["Takeover announcements moved two companies","Industrial-software maker PTC and freight broker RXO rose after acquisition news. The moves illustrate how company-specific events can outweigh the broader market on a given day.","The Associated Press","https://apnews.com/article/stock-markets-jobs-fed-rates-inflation-f83cf147deaf5a2361b1ae7eee74a627"]
];

export default function Home(){return <main className="shell"><Header updated={edition.updated_at}/>
  <p className="edition-summary">{edition.summary}</p>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=><HeadlineCard headline={headline} definitions={lensDefinitions} key={headline.headline}/>)}</div></section>
  <section className="notable" aria-labelledby="notable-title"><div className="section-heading"><h2 id="notable-title">Noteworthy Updates</h2></div><div className="notable-pulse" role="img" aria-label="Jobs report details: annual wage growth 3 percent, unemployment 4.2 percent, and prior-month revisions of negative 60,000 jobs"><span>Jobs report details</span><div><b>3.0%</b><small>annual wage growth</small></div><div><b>4.2%</b><small>unemployment</small></div><div><b>−60K</b><small>prior-month revisions</small></div></div><div className="notable-list">{notable.map(([title,text,source,href])=><article key={title}><h3>{title}</h3><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div></section>
  <section className="watch" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">What to Watch For</h2><p>Each scenario describes a historical relationship, not a prediction.</p></div><div className="event-list">{edition.calendar.map(e=><article key={e.date}><time>{e.date}<small>{e.time}</small></time><div className="event-main"><h3>{e.title}</h3><p>{e.definition}</p><span>{e.prior}</span><span>{e.consensus}</span></div><div className="scenario hotter"><b>Hotter / tighter</b><p>{e.hot}</p></div><div className="scenario cooler"><b>Cooler / easier</b><p>{e.cool}</p></div><a href={e.href} target="_blank" rel="noreferrer">{e.source} · verified {e.verified} ↗</a></article>)}</div></section>
  <Footer/>
</main>}
