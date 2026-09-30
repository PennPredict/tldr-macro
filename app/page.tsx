const markets = [
  { name: "S&P 500", value: "4,357.2", move: "+0.43%", positive: true, note: "Broad U.S. equities moved higher.", href: "https://fred.stlouisfed.org/series/SP500" },
  { name: "Nasdaq", value: "13,457.8", move: "+0.72%", positive: true, note: "Growth stocks led the advance.", href: "https://fred.stlouisfed.org/series/NASDAQCOM" },
  { name: "Dow Jones", value: "33,891.2", move: "+0.36%", positive: true, note: "Blue-chip stocks edged upward.", href: "https://fred.stlouisfed.org/series/DJIA" },
  { name: "10Y Treasury", value: "5.18%", move: "−0.11%", positive: false, note: "Yields eased from recent highs.", href: "https://fred.stlouisfed.org/series/DGS10" },
  { name: "WTI Oil", value: "$86.40", move: "+1.30%", positive: false, note: "Oil rose, adding inflation pressure.", href: "https://fred.stlouisfed.org/series/DCOILWTICO" },
  { name: "Gold", value: "$2,380", move: "+0.60%", positive: true, note: "Gold moved higher as demand held.", href: "https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM" },
];

const developments = [
  { n: "1", tone: "mint", title: "Inflation cools more than expected", body: "PCE rose 0.3% versus 0.4% expected. Inflation pressure eased during the period.", why: "Slower inflation can reduce pressure for another Fed hike. Will the next release confirm the trend?", source: "BEA", href: "https://www.bea.gov/news/current-releases" },
  { n: "2", tone: "blue", title: "GDP revised higher", body: "GDP was revised higher. Consumer spending and business investment supported growth.", why: "Growth can support earnings while keeping policy restrictive. Which force will markets price more heavily?", source: "BEA", href: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  { n: "3", tone: "violet", title: "Stocks move higher", body: "The S&P 500 rose 0.4%. The Nasdaq gained 0.7% as yields eased.", why: "Lower yields reduce discount rates. Resilient activity can also support expected earnings.", source: "FRED", href: "https://fred.stlouisfed.org/categories/32255" },
  { n: "4", tone: "orange", title: "Oil remains an inflation risk", body: "Oil remained elevated amid uncertainty around regional supply.", why: "Higher energy costs can lift inflation and weaken consumer demand. Watch whether the move persists.", source: "EIA", href: "https://www.eia.gov/petroleum/" },
];

const connections = [
  { icon: "↓", title: "Inflation cools", note: "PCE: 0.3% vs. 0.4% expected." },
  { icon: "🏛", title: "Fed pressure eases", note: "Less need for an immediate hike." },
  { icon: "%", title: "Yields decline", note: "The 10Y eases from recent highs." },
  { icon: "↗", title: "Stocks rise", note: "Lower yields support valuations." },
  { icon: "!", title: "Risks remain", note: "Oil and geopolitics could lift inflation." },
];

const updates = [
  ["▣", "Jobs market mixed", "Openings fell as consumer confidence weakened.", "BLS", "https://www.bls.gov/jlt/"],
  ["◎", "Global rates", "Japan and Europe also face elevated sovereign yields.", "BIS", "https://www.bis.org/statistics/"],
  ["▦", "Earnings calendar", "Upcoming reports may test current profit expectations.", "SEC", "https://www.sec.gov/edgar/search/"],
  ["◉", "Other assets", "The dollar was quieter while gold remained firm.", "FRED", "https://fred.stlouisfed.org/categories/15"],
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div><a className="wordmark" href="#top"><strong>TLDR</strong> Markets</a><p>Market intelligence, for everyone.</p></div>
        <span>Sample edition</span>
      </header>

      <section className="lead" id="top">
        <div className="lead-copy">
          <p className="section-label">Today&apos;s brief</p>
          <h1>Inflation cools,<br />stocks climb</h1>
          <p className="lead-summary">Inflation came in below expectations. Treasury yields fell. Stocks rose as growth remained resilient. Oil remained an upside risk to inflation.</p>
        </div>
        <div className="lead-visual" role="img" aria-label="Abstract sunrise over a financial city skyline">
          <span className="sun" /><span className="skyline">▥ ▥ ▤ ▥ ▥</span>
          <time><b>SEP 30</b><small>Sample</small></time>
        </div>
      </section>

      <section className="market-strip" aria-label="Market pulse">
        {markets.map((market) => (
          <article className="market-card" key={market.name}>
            <span>{market.name}</span><div><strong>{market.value}</strong><b className={market.positive ? "good" : "risk"}>{market.move}</b></div>
            <div className={`spark ${market.positive ? "spark-up" : "spark-down"}`} aria-hidden="true"><i /><b /></div>
            <p className="market-note">{market.note}</p>
            <a className="micro-source" href={market.href} target="_blank" rel="noreferrer">FRED ↗</a>
          </article>
        ))}
      </section>

      <section className="section-block">
        <p className="section-label">Key developments</p>
        <div className="development-grid">
          {developments.map((item) => (
            <article className="development-card" key={item.n}>
              <div className={`number ${item.tone}`}>{item.n}</div>
              <h2>{item.title}</h2><p>{item.body}</p>
              <div className={`why ${item.tone}`}><span>●</span><div><strong>Why it matters</strong><p>{item.why}</p><a href={item.href} target="_blank" rel="noreferrer">Source: {item.source} ↗</a></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block connection-card">
        <p className="section-label">How today&apos;s stories connect</p>
        <div className="connection-flow">
          {connections.map((item, index) => (
            <div className="connection-step" key={item.title}>
              <div className="flow-top"><span>{item.icon}</span>{index < connections.length - 1 && <i>→</i>}</div>
              <strong>{item.title}</strong><p>{item.note}</p>
            </div>
          ))}
        </div>
        <p className="connection-source">Framework based on the <a href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">BEA inflation release</a> and <a href="https://fred.stlouisfed.org/series/DGS10" target="_blank" rel="noreferrer">Treasury yield data</a>.</p>
      </section>

      <section className="section-block">
        <p className="section-label">Other notable updates</p>
        <div className="update-grid">
          {updates.map(([icon, title, body, source, href]) => <article key={title}><span>{icon}</span><div><strong>{title}</strong><p>{body}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></div></article>)}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="watch-panel">
          <p className="section-label">What to watch next</p>
          <ul>
            <li><time><b>OCT</b>3</time><div><strong>Jobs report</strong><p>Will labor demand continue to cool?</p><a href="https://www.bls.gov/schedule/news_release/empsit.htm" target="_blank" rel="noreferrer">BLS ↗</a></div></li>
            <li><time><b>OCT</b>5</time><div><strong>Fed meeting minutes</strong><p>How divided were policymakers?</p><a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noreferrer">Federal Reserve ↗</a></div></li>
            <li><time><b>OCT</b>10</time><div><strong>CPI inflation</strong><p>Did underlying price pressure ease?</p><a href="https://www.bls.gov/schedule/news_release/cpi.htm" target="_blank" rel="noreferrer">BLS ↗</a></div></li>
            <li><time><b>OCT</b>15</time><div><strong>Energy developments</strong><p>Could supply uncertainty move oil?</p><a href="https://www.eia.gov/outlooks/steo/" target="_blank" rel="noreferrer">EIA ↗</a></div></li>
          </ul>
        </article>

        <article className="bottom-line">
          <p className="section-label">Bottom line</p>
          <div className="bottom-summary"><span>↗</span><div><h2>Inflation slowed. Growth held. Stocks rose.</h2><p>Cooler inflation reduced immediate pressure on the Fed. Oil could change that path if energy costs rise further.</p></div></div>
          <div className="takeaways"><p className="section-label">Key takeaways</p><ul><li>Inflation cooled during the period.</li><li>Growth remained resilient despite higher rates.</li><li>Falling yields supported equity valuations.</li><li>Oil remains an upside inflation risk.</li></ul></div>
        </article>
      </section>

      <footer><span>Every claim sourced. Facts first. Questions where uncertainty remains.</span><span>Educational context, not investment advice.</span></footer>
    </main>
  );
}
