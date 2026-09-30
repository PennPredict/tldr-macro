const markets = [
  { name: "S&P 500", value: "4,357.2", move: "+0.43%", positive: true, note: "The Standard & Poor’s 500 (S&P 500) tracks large U.S. companies. Its rise lifted many retirement and index-fund portfolios.", href: "https://fred.stlouisfed.org/series/SP500" },
  { name: "Nasdaq", value: "13,457.8", move: "+0.72%", positive: true, note: "The technology-heavy index outpaced the broader market. Falling yields may have supported growth-company valuations.", href: "https://fred.stlouisfed.org/series/NASDAQCOM" },
  { name: "Dow Jones", value: "33,891.2", move: "+0.36%", positive: true, note: "The index of 30 established companies edged higher. Portfolios tilted toward large, mature businesses received a smaller lift.", href: "https://fred.stlouisfed.org/series/DJIA" },
  { name: "10Y Treasury", value: "5.18%", move: "−0.11%", positive: false, note: "The yield on 10-year U.S. government debt fell. Lower yields can reduce borrowing pressure and support stock valuations.", href: "https://fred.stlouisfed.org/series/DGS10" },
  { name: "WTI Oil", value: "$86.40", move: "+1.30%", positive: false, note: "West Texas Intermediate (WTI), a U.S. oil benchmark, rose. Higher oil can raise fuel, shipping, packaging, and production costs.", href: "https://fred.stlouisfed.org/series/DCOILWTICO" },
  { name: "Gold", value: "$2,380", move: "+0.60%", positive: true, note: "Gold rose while inflation and geopolitical risks remained. The move may reflect demand for assets viewed as defensive.", href: "https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM" },
];

const developments = [
  { n: "1", tone: "mint", title: "Inflation cools more than expected", body: "The Personal Consumption Expenditures (PCE) price index rose 0.3%, below the 0.4% forecast. PCE tracks the prices people pay and is the Federal Reserve’s preferred inflation measure.", why: "Slower inflation can reduce pressure for another interest-rate increase. That can eventually affect mortgages, car loans, credit cards, and business borrowing.", source: "U.S. Bureau of Economic Analysis (BEA)", href: "https://www.bea.gov/news/current-releases" },
  { n: "2", tone: "blue", title: "Economic growth revised higher", body: "Gross domestic product (GDP)—the broadest measure of economic output—was revised higher. Consumer and business spending supported growth.", why: "Stronger GDP can support jobs and company sales. It can also keep interest rates high if demand adds inflation pressure.", source: "U.S. Bureau of Economic Analysis (BEA)", href: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  { n: "3", tone: "violet", title: "Stocks move higher", body: "The S&P 500 rose 0.4%. The technology-heavy Nasdaq gained 0.7% as government-bond yields fell.", why: "Lower yields can increase what investors are willing to pay for future company profits. Economic growth can also support those profits.", source: "Federal Reserve Economic Data (FRED)", href: "https://fred.stlouisfed.org/categories/32255" },
  { n: "4", tone: "orange", title: "Oil remains an inflation risk", body: "Oil remained elevated amid uncertainty around regional supply. Oil powers transportation and is used in plastics, chemicals, and manufacturing.", why: "Higher oil can move through supply chains: delivery and production cost more, businesses may raise prices, and households have less left to spend.", source: "U.S. Energy Information Administration (EIA)", href: "https://www.eia.gov/petroleum/" },
];

const updates = [
  ["▣", "Jobs market mixed", "Job openings fell. Fewer openings can mean workers have less leverage to change jobs or negotiate pay.", "U.S. Bureau of Labor Statistics (BLS)", "https://www.bls.gov/jlt/"],
  ["◎", "Global borrowing costs", "Government-bond yields stayed high in Japan and Europe. That can raise loan costs for households and businesses worldwide.", "Bank for International Settlements (BIS)", "https://www.bis.org/statistics/"],
  ["▦", "Earnings calendar", "Company earnings reveal whether sales and profits justify current stock prices—and whether hiring or investment may change.", "U.S. Securities and Exchange Commission (SEC)", "https://www.sec.gov/edgar/search/"],
  ["◉", "U.S. dollar", "The dollar changed little. A stronger dollar can make imports cheaper for Americans but make U.S. products more expensive overseas.", "Federal Reserve Economic Data (FRED)", "https://fred.stlouisfed.org/categories/15"],
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div><a className="wordmark" href="#top"><strong>TL;DR</strong> Macro</a><p>Market intelligence, for everyone.</p></div>
        <span>Sample edition</span>
      </header>

      <section className="lead" id="top">
        <div className="lead-copy">
          <p className="section-label">Today&apos;s brief</p>
          <h1>Inflation cools,<br />stocks climb</h1>
          <p className="lead-summary">Inflation came in below expectations. Government-bond yields fell and stocks rose. Oil remained a risk because higher energy costs can spread into transportation, production, and household prices.</p>
        </div>
        <div className="lead-lens">
          <p className="section-label">How today&apos;s story connects</p>
          <div className="mini-chain">
            <div><span>↓</span><strong>Inflation cools</strong><small>Prices rose more slowly.</small></div><b>→</b>
            <div><span>🏛</span><strong>Fed pressure eases</strong><small>Less need to raise rates.</small></div><b>→</b>
            <div><span>%</span><strong>Borrowing pressure falls</strong><small>Loans and valuations get relief.</small></div>
          </div>
          <a className="chain-source" href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">Read the full BEA inflation release ↗</a>
        </div>
      </section>

      <section className="regime-bar" aria-label="Macro conditions at a glance">
        <article><span>Growth</span><strong>The economy is still expanding.</strong><p>Consumer and business spending can support company sales and jobs.</p><a href="https://www.bea.gov/data/gdp/gross-domestic-product" target="_blank" rel="noreferrer">BEA ↗</a></article>
        <article><span>Inflation</span><strong>Prices are rising more slowly.</strong><p>Household budgets get some relief when everyday costs stop accelerating as quickly.</p><a href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">BEA ↗</a></article>
        <article><span>Policy</span><strong>High rates make borrowing more expensive.</strong><p>An AI startup financing data centers—or a shopper carrying card debt—pays more for credit.</p><a href="https://www.federalreserve.gov/monetarypolicy.htm" target="_blank" rel="noreferrer">Fed ↗</a></article>
        <article><span>Watch</span><strong>Oil can raise costs across the economy.</strong><p>Your favorite cosmetics shop may pay more for packaging, production, and delivery.</p><a href="https://www.eia.gov/petroleum/" target="_blank" rel="noreferrer">EIA ↗</a></article>
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
            <li><time><b>OCT</b>10</time><div><strong>Consumer Price Index (CPI)</strong><p>CPI tracks how prices change for a basket of household goods and services. Did everyday price pressure ease?</p><a href="https://www.bls.gov/schedule/news_release/cpi.htm" target="_blank" rel="noreferrer">U.S. Bureau of Labor Statistics ↗</a></div></li>
            <li><time><b>OCT</b>15</time><div><strong>Energy developments</strong><p>Could supply uncertainty move oil?</p><a href="https://www.eia.gov/outlooks/steo/" target="_blank" rel="noreferrer">EIA ↗</a></div></li>
          </ul>
        </article>

        <article className="bottom-line">
          <p className="section-label">Bottom line</p>
          <div className="bottom-summary"><span>↗</span><div><h2>Inflation slowed. Growth held. Stocks rose.</h2><p>Cooler inflation reduced immediate pressure on the Fed. Oil could change that path if energy costs rise further.</p></div></div>
          <div className="takeaways"><h3>Key takeaways</h3><ul><li>Inflation cooled during the period.</li><li>Growth remained resilient despite higher rates.</li><li>Falling yields supported stock valuations.</li><li>Oil remains an upside inflation risk.</li></ul></div>
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
