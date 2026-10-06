import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import lensDefinitions from "../config/lens-definitions.json";
import { Footer, Header } from "./SiteChrome";
import HeadlineCard from "./HeadlineCard";
import MarketSnapshot from "./MarketSnapshot";

const notable=[
  ["A health-care takeover moved Option Care","↗ 32.7%","CD&R and McKesson agreed to buy the infusion-services provider. A company-specific deal can overwhelm the broader market move.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Frozen-fries demand beat expectations","↗ 10.8%","Lamb Weston reported stronger profit and revenue despite higher freight costs, showing how pricing and demand can offset inflation pressure.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Asian markets moved in different directions","↔ mixed","Japan and Hong Kong rose while South Korea fell. Overseas markets shape U.S. portfolios through multinational revenue and global funds.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"],
  ["Airlines and banks report next","→ earnings","Delta reports Friday, followed by major banks next week. Their results can reveal travel demand, credit quality, and financing conditions.","The Associated Press","https://apnews.com/article/stocks-markets-oil-bonds-us-e8285ec7afbe81e9df277e8ee2127982"]
];

export default function Home(){return <main className="shell"><Header updated={edition.updated_at}/>
  <p className="edition-summary">{edition.summary}</p>
  <MarketSnapshot markets={edition.markets}/>
  <section className="stories" aria-labelledby="stories-title"><div className="section-heading stories-heading"><h2 id="stories-title">Top Stories</h2></div><div className="headline-list">{headlines.map(headline=><HeadlineCard headline={headline} definitions={lensDefinitions} key={headline.headline}/>)}</div></section>
  <section className="notable" aria-labelledby="notable-title"><div className="section-heading"><h2 id="notable-title">What Else</h2></div><div className="notable-list">{notable.map(([title,signal,text,source,href])=><article key={title}><div className="notable-title"><h3>{title}</h3><span>{signal}</span></div><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div></section>
  <section className="watch" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Next on TL;DR Macro</h2><p>Historical relationship, not prediction.</p></div><div className="event-list">{edition.calendar.map(e=><article key={e.date}><time>{e.date}<small>{e.time}</small></time><div className="event-main"><h3>{e.title}</h3><p>{e.definition}</p><span>{e.prior}</span><span>{e.consensus}</span></div><div className="scenario hotter"><b>Hotter / tighter</b><p>{e.hot}</p></div><div className="scenario cooler"><b>Cooler / easier</b><p>{e.cool}</p></div><a href={e.href} target="_blank" rel="noreferrer">{e.source} ↗</a></article>)}</div></section>
  <Footer/>
</main>}
