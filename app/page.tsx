const markets = [
  ["S&P 500", "4,357.2", "+0.43%", "U.S. large-company stocks", "up", "https://fred.stlouisfed.org/series/SP500"],
  ["Nasdaq", "13,457.8", "+0.72%", "Technology-heavy U.S. stocks", "up", "https://fred.stlouisfed.org/series/NASDAQCOM"],
  ["Dow Jones", "33,891.2", "+0.36%", "30 established U.S. companies", "up", "https://fred.stlouisfed.org/series/DJIA"],
  ["10Y Treasury", "5.18%", "−0.11%", "Benchmark U.S. borrowing rate", "down", "https://fred.stlouisfed.org/series/DGS10"],
  ["WTI oil", "$86.40", "+1.30%", "Main U.S. crude-oil benchmark", "risk", "https://fred.stlouisfed.org/series/DCOILWTICO"],
  ["Gold", "$2,380", "+0.60%", "Store-of-value asset", "up", "https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM"],
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
        <div><a className="wordmark" href="#top"><strong>TL;DR</strong> Macro</a><p>The day&apos;s markets, in plain English.</p></div>
        <div className="edition"><span>Sample edition</span><time>Sep 30, 2026</time></div>
      </header>

      <section className="hero" id="top">
        <p className="section-label">Today&apos;s brief</p>
        <h1>Inflation cools.<br /><em>Stocks climb.</em></h1>
        <p className="hero-copy">Inflation came in below expectations, reducing pressure on the Federal Reserve to raise interest rates again. Government-bond yields fell and stocks rose while economic growth remained resilient. Oil is the main counter-risk because higher energy costs can spread through transportation, production, and household prices.</p>
      </section>

      <section className="changed" aria-labelledby="changed-title">
        <h2 id="changed-title">What changed today</h2>
        <ul><li>Inflation surprised lower</li><li>Rate-hike expectations eased</li><li>Treasury yields declined</li><li>Stocks rose</li><li>Oil remained the inflation counter-risk</li></ul>
      </section>

      <section className="market-section" aria-labelledby="market-title">
        <div className="section-heading"><div><p className="section-label">Five-second scan</p><h2 id="market-title">Market snapshot</h2></div><p>Sample figures · source links beneath</p></div>
        <div className="market-grid">
          {markets.map(([name, value, move, description, tone, href]) => (
            <article className="market" key={name}>
              <h3>{name}</h3><div className="market-value"><strong>{value}</strong><b className={tone}>{move}</b></div>
              <div className={`line ${tone}`} aria-hidden="true"><i /><span /></div>
              <p>{description}</p><a href={href} target="_blank" rel="noreferrer">FRED ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="connect" aria-labelledby="connect-title">
        <div className="connect-intro"><p className="section-label">The mechanism</p><h2 id="connect-title">How today&apos;s stories connect</h2><p>One economic release changed expectations across rates and stocks.</p></div>
        <div className="causal-chain">
          <div><span>01</span><strong>Inflation cools</strong><p>Prices rose more slowly.</p></div><b>→</b>
          <div><span>02</span><strong>Fed pressure eases</strong><p>Less need to raise rates.</p></div><b>→</b>
          <div><span>03</span><strong>Treasury yields fall</strong><p>Expected interest rates decline.</p></div><b>→</b>
          <div><span>04</span><strong>Stocks get relief</strong><p>Lower rates support valuations.</p></div>
        </div>
        <a className="source-link" href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">U.S. Bureau of Economic Analysis release ↗</a>
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

      <section className="bottom-line"><p className="section-label">Bottom line</p><blockquote>Inflation showed progress while economic growth remained resilient—a combination that supported stocks. Elevated oil remains the counter-risk because higher energy costs could push inflation and borrowing pressure back up.</blockquote><ul><li>Inflation moved in the Fed&apos;s preferred direction.</li><li>Growth still supported jobs and company sales.</li><li>Oil could reverse some of the improvement.</li></ul></section>

      <aside className="nuance"><strong>Concision leaves out nuance.</strong><p>Source links provide the full release, definitions, methodology, revisions, and context. Read them before drawing a conclusion.</p></aside>
      <footer><span>Every claim sourced. Facts first.</span><span>Educational context, not investment advice.</span></footer>
    </main>
  );
}
