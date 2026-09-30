const markets = [
  { name: "S&P 500", value: "4,357.2", move: "+0.43%", positive: true, note: "Tracks 500 large U.S. companies. Stocks moved higher.", href: "https://fred.stlouisfed.org/series/SP500" },
  { name: "Nasdaq", value: "13,457.8", move: "+0.72%", positive: true, note: "A technology-heavy stock index. Growth companies led gains.", href: "https://fred.stlouisfed.org/series/NASDAQCOM" },
  { name: "Dow Jones", value: "33,891.2", move: "+0.36%", positive: true, note: "Tracks 30 established U.S. companies. The index edged up.", href: "https://fred.stlouisfed.org/series/DJIA" },
  { name: "10Y Treasury", value: "5.18%", move: "−0.11%", positive: false, note: "The yield on 10-year U.S. government debt moved lower.", href: "https://fred.stlouisfed.org/series/DGS10" },
  { name: "WTI Oil", value: "$86.40", move: "+1.30%", positive: false, note: "The main U.S. crude-oil benchmark rose, adding inflation pressure.", href: "https://fred.stlouisfed.org/series/DCOILWTICO" },
  { name: "Gold", value: "$2,380", move: "+0.60%", positive: true, note: "A widely held store-of-value asset. Its price moved higher.", href: "https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM" },
];

const developments = [
  { n: "1", tone: "mint", title: "Inflation cools more than expected", body: "The Personal Consumption Expenditures price index rose 0.3%, below the 0.4% forecast. It is the Federal Reserve’s preferred measure of consumer inflation.", why: "Slower inflation can reduce pressure for another interest-rate increase. Will the next release confirm the trend?", source: "BEA", href: "https://www.bea.gov/news/current-releases" },
  { n: "2", tone: "blue", title: "Economic growth revised higher", body: "Gross domestic product—the broadest measure of economic output—was revised higher. Consumer and business spending supported growth.", why: "Growth can support company profits while giving the Federal Reserve room to keep rates high. Which effect will matter more?", source: "BEA", href: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  { n: "3", tone: "violet", title: "Stocks move higher", body: "The S&P 500 rose 0.4%. The technology-heavy Nasdaq gained 0.7% as government-bond yields fell.", why: "Lower yields can increase what investors are willing to pay for future company profits. Economic growth can also support those profits.", source: "FRED", href: "https://fred.stlouisfed.org/categories/32255" },
  { n: "4", tone: "orange", title: "Oil remains an inflation risk", body: "Oil remained elevated amid uncertainty around regional supply.", why: "Higher energy costs can lift inflation and weaken consumer demand. Watch whether the move persists.", source: "EIA", href: "https://www.eia.gov/petroleum/" },
];

const connections = [
  { icon: "↓", title: "Inflation cools", note: "PCE: 0.3% vs. 0.4% expected." },
  { icon: "🏛", title: "Fed pressure eases", note: "Less need for an immediate rate increase." },
  { icon: "%", title: "Bond yields decline", note: "The return offered by 10-year government debt falls." },
  { icon: "↗", title: "Stocks rise", note: "Lower yields can raise the value of future company profits." },
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
        <div><a className="wordmark" href="#top"><strong>TL;DR</strong> Markets</a><p>Macro intelligence, for everyone.</p></div>
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

      <section className="regime-bar" aria-label="Macro conditions at a glance">
        <article><span>Growth</span><strong>Resilient</strong><a href="https://www.bea.gov/data/gdp/gross-domestic-product" target="_blank" rel="noreferrer">BEA ↗</a></article>
        <article><span>Inflation</span><strong>Cooling</strong><a href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">BEA ↗</a></article>
        <article><span>Policy</span><strong>Restrictive</strong><a href="https://www.federalreserve.gov/monetarypolicy.htm" target="_blank" rel="noreferrer">Fed ↗</a></article>
        <article><span>Watch</span><strong>Oil</strong><a href="https://www.eia.gov/petroleum/" target="_blank" rel="noreferrer">EIA ↗</a></article>
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
            <li><time><b>OCT</b>10</time><div><strong>Consumer Price Index</strong><p>The CPI is a widely watched measure of consumer inflation. Did price pressure ease?</p><a href="https://www.bls.gov/schedule/news_release/cpi.htm" target="_blank" rel="noreferrer">BLS ↗</a></div></li>
            <li><time><b>OCT</b>15</time><div><strong>Energy developments</strong><p>Could supply uncertainty move oil?</p><a href="https://www.eia.gov/outlooks/steo/" target="_blank" rel="noreferrer">EIA ↗</a></div></li>
          </ul>
        </article>

        <article className="bottom-line">
          <p className="section-label">Bottom line</p>
          <div className="bottom-summary"><span>↗</span><div><h2>Inflation slowed. Growth held. Stocks rose.</h2><p>Cooler inflation reduced immediate pressure on the Fed. Oil could change that path if energy costs rise further.</p></div></div>
          <div className="takeaways"><p className="section-label">Key takeaways</p><ul><li>Inflation cooled during the period.</li><li>Growth remained resilient despite higher rates.</li><li>Falling yields supported equity valuations.</li><li>Oil remains an upside inflation risk.</li></ul></div>
        </article>
      </section>

      <aside className="nuance-note">
        <strong>Short summaries leave out nuance.</strong>
        <p>Use each source link to read the full release, definitions, methodology, revisions, and context before drawing a conclusion.</p>
      </aside>

      <footer><span>Every claim sourced. Facts first. Questions where uncertainty remains.</span><span>Educational context, not investment advice.</span></footer>
    </main>
  );
}
