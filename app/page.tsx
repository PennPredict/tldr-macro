const markets = [
  { name:"S&P 500", value:"4,357.2", move:"+0.43%", description:"The Standard & Poor’s 500 (S&P 500), a gauge of large U.S. companies, rose 0.43% as inflation cooled; lower expected interest rates could continue to support stock prices.", tone:"up", href:"https://fred.stlouisfed.org/series/SP500", range:"Day range 4,321–4,365", points:[64,72,59,67,48,54,35,43,28,31,22,26] },
  { name:"10Y Treasury yield", value:"5.18%", move:"−0.11%", description:"The 10-year Treasury yield, a benchmark for mortgages and business loans, fell to 5.18% after softer inflation; a further decline could gradually reduce borrowing pressure.", tone:"down", href:"https://fred.stlouisfed.org/series/DGS10", range:"Day range 5.16–5.29%", points:[27,23,31,20,28,38,36,45,43,54,58,53] },
  { name:"WTI crude oil", value:"$86.40", move:"+1.30%", description:"West Texas Intermediate (WTI), the main U.S. crude-oil benchmark, rose 1.30% amid supply uncertainty; sustained gains could raise fuel, shipping, and household costs.", tone:"risk", href:"https://fred.stlouisfed.org/series/DCOILWTICO", range:"Day range $84.92–$86.71", points:[67,61,70,53,48,55,39,46,32,38,29,34] },
  { name:"Gold", value:"$2,380", move:"+0.60%", description:"Gold, an asset often used to store value during uncertainty, rose 0.60% as geopolitical risks persisted; continued demand could indicate investors remain cautious despite rising stocks.", tone:"up", href:"https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM", range:"Day range $2,351–$2,386", points:[56,47,52,38,44,49,35,41,27,33,24,29] },
];

const secondary = [
  {
    number: "02", label: "Growth", title: "Economic growth was revised higher",
    text: "Gross domestic product (GDP)—the broadest measure of economic output—was revised higher as consumer and business spending held up.",
    why: "Stronger growth can support jobs and company sales, but it can also keep interest rates high if demand adds inflation pressure.",
    source: "U.S. Bureau of Economic Analysis (BEA)", href: "https://www.bea.gov/data/gdp/gross-domestic-product",
  },
  {
    number: "03", label: "Markets", title: "Stocks rose as bond yields fell",
    text: "The Standard & Poor’s 500 (S&P 500) gained 0.4%. The technology-heavy Nasdaq rose 0.7% as government-bond yields moved lower.",
    why: "Lower yields reduce the rate used to value future profits today, which can make stocks—especially growth companies—more attractive.",
    source: "Federal Reserve Economic Data (FRED)", href: "https://fred.stlouisfed.org/categories/32255",
  },
  {
    number: "04", label: "Energy", title: "Oil remains the main inflation counter-risk",
    text: "West Texas Intermediate (WTI), a U.S. crude-oil benchmark, remained elevated amid uncertainty around regional supply.",
    why: "Oil moves through supply chains. Fuel, shipping, plastics, packaging, and production can cost more, leaving households with less to spend.",
    source: "U.S. Energy Information Administration (EIA)", href: "https://www.eia.gov/petroleum/",
  },
];

const notable = [
  ["Jobs", "Job openings fell. Fewer openings can reduce workers’ leverage to change jobs or negotiate pay.", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/jlt/"],
  ["Global rates", "Government-bond yields remained high in Japan and Europe, keeping borrowing costs elevated beyond the United States.", "Bank for International Settlements", "https://www.bis.org/statistics/"],
  ["Earnings", "Upcoming company reports will test whether sales and profits justify current stock prices.", "U.S. Securities and Exchange Commission", "https://www.sec.gov/edgar/search/"],
  ["U.S. dollar", "The dollar changed little. A stronger dollar makes imports cheaper for Americans but U.S. products costlier overseas.", "Federal Reserve Economic Data", "https://fred.stlouisfed.org/categories/15"],
];

const events = [
  {
    date: "OCT 3", title: "Jobs report", question: "Is the labor market continuing to cool?",
    hot: "More jobs than forecast → rate pressure may rise → Treasury yields may rise.",
    cool: "Fewer jobs than forecast → rate pressure may ease → Treasury yields may fall.",
    source: "BLS schedule", href: "https://www.bls.gov/schedule/news_release/empsit.htm",
  },
  {
    date: "OCT 10", title: "Consumer Price Index (CPI)", question: "Are household prices still cooling?",
    hot: "Higher inflation than forecast → rate-cut expectations may fall → stocks may face pressure.",
    cool: "Lower inflation than forecast → rate pressure may ease → stocks may receive support.",
    source: "BLS schedule", href: "https://www.bls.gov/schedule/news_release/cpi.htm",
  },
  {
    date: "OCT 15", title: "Energy outlook", question: "Could supply uncertainty keep oil elevated?",
    hot: "Higher oil → transportation and production costs may rise → inflation risk increases.",
    cool: "Lower oil → supply-chain pressure may ease → households and businesses get relief.",
    source: "EIA outlook", href: "https://www.eia.gov/outlooks/steo/",
  },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div><a className="wordmark" href="#top"><strong>TL;DR</strong> Macro</a><p>Market intelligence for everyone.</p></div>
        <div className="edition"><span>Sample edition</span><time>Sep 30, 2026</time></div>
      </header>

      <section className="market-section" id="top" aria-labelledby="market-title">
        <div className="section-heading"><div><p className="section-label">Five-second scan</p><h2 id="market-title">Market snapshot</h2></div><p>Sample figures · source links beneath</p></div>
        <div className="market-grid">
          {markets.map((market) => (
            <article className="market" key={market.name}>
              <h3>{market.name}</h3><div className="market-value"><strong>{market.value}</strong><b className={market.tone}>{market.move}</b></div>
              <div className={`line ${market.tone}`} aria-hidden="true">
                <i className="baseline" />
                {market.points.slice(0,-1).map((point,index) => {
                  const next = market.points[index + 1];
                  const dx = 100 / (market.points.length - 1);
                  const dy = next - point;
                  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                  const width = Math.sqrt(dx * dx + dy * dy);
                  return <i className="spark-segment" key={index} style={{left:`${index * dx}%`,top:`${point}%`,width:`${width}%`,transform:`rotate(${angle}deg)`}} />;
                })}
                <span className="endpoint" style={{top:`${market.points.at(-1)}%`}} />
              </div>
              <div className="chart-meta"><span>Open</span><b>{market.range}</b><span>Now</span></div>
              <p>{market.description}</p><a href={market.href} target="_blank" rel="noreferrer">FRED ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="stories" aria-labelledby="stories-title">
        <p className="section-label">The big story</p>
        <article className="lead-story">
          <div className="story-meta"><span>01</span><b>Inflation</b></div>
          <div><h2 id="stories-title">Inflation cooled more than expected</h2><p>The Personal Consumption Expenditures (PCE) price index rose 0.3%, below the 0.4% forecast. PCE tracks the prices people pay and is the Federal Reserve’s preferred inflation measure. The softer reading reduced expectations for another near-term interest-rate increase.</p><p className="why"><strong>Why it matters</strong> Less Federal Reserve tightening can lower expected rates and Treasury yields. That can support stocks and eventually reduce pressure on mortgages, car loans, credit cards, and business borrowing.</p><a className="source-link" href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">U.S. Bureau of Economic Analysis (BEA) ↗</a></div>
        </article>

        <div className="other-heading"><p className="section-label">Three other things that matter</p></div>
        <div className="secondary-list">
          {secondary.map((story) => <article key={story.number}><div className="story-meta"><span>{story.number}</span><b>{story.label}</b></div><div><h3>{story.title}</h3><p>{story.text}</p><p className="why"><strong>Why it matters</strong> {story.why}</p><a className="source-link" href={story.href} target="_blank" rel="noreferrer">{story.source} ↗</a></div></article>)}
        </div>
      </section>

      <section className="notable" aria-labelledby="notable-title">
        <div className="section-heading"><div><p className="section-label">Worth knowing</p><h2 id="notable-title">Other notable updates</h2></div></div>
        <div className="notable-list">{notable.map(([title, text, source, href]) => <article key={title}><h3>{title}</h3><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div>
      </section>

      <section className="watch" aria-labelledby="watch-title">
        <div className="section-heading"><div><p className="section-label">Interpret the next move</p><h2 id="watch-title">What to watch next</h2></div><p>Compare the result with expectations—not only the prior number.</p></div>
        <div className="event-list">{events.map((event) => <article key={event.date}><time>{event.date}</time><div className="event-main"><h3>{event.title}</h3><p>{event.question}</p></div><div className="scenario hotter"><b>Hotter / stronger</b><p>{event.hot}</p></div><div className="scenario cooler"><b>Cooler / weaker</b><p>{event.cool}</p></div><a href={event.href} target="_blank" rel="noreferrer">{event.source} ↗</a></article>)}</div>
      </section>

      <footer><span><strong>Concision leaves out nuance.</strong> Use the source links for full releases, methodology, revisions, and context.</span><span>Educational context, not investment advice.</span></footer>
    </main>
  );
}
