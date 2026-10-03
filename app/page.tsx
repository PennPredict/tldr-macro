import Sparkline from "./Sparkline";

const markets = [
  { name:"S&P 500", value:"4,357.2", move:"+0.43%", description:"The Standard & Poor’s 500 (S&P 500), a gauge of large U.S. companies, rose 0.43% as inflation cooled; lower expected interest rates could continue to support stock prices.", tone:"up", href:"https://fred.stlouisfed.org/series/SP500", range:"Day range 4,321–4,365", points:[64,72,59,67,48,54,35,43,28,31,22,26] },
  { name:"10Y Treasury yield", value:"5.18%", move:"−0.11%", description:"The 10-year Treasury yield, a benchmark for mortgages and business loans, fell to 5.18% after softer inflation; a further decline could gradually reduce borrowing pressure.", tone:"down", href:"https://fred.stlouisfed.org/series/DGS10", range:"Day range 5.16–5.29%", points:[27,23,31,20,28,38,36,45,43,54,58,53] },
  { name:"WTI crude oil", value:"$86.40", move:"+1.30%", description:"West Texas Intermediate (WTI), the main U.S. crude-oil benchmark, rose 1.30% amid supply uncertainty; sustained gains could raise fuel, shipping, and household costs.", tone:"risk", href:"https://fred.stlouisfed.org/series/DCOILWTICO", range:"Day range $84.92–$86.71", points:[67,61,70,53,48,55,39,46,32,38,29,34] },
  { name:"Gold", value:"$2,380", move:"+0.60%", description:"Gold, an asset often used to store value during uncertainty, rose 0.60% as geopolitical risks persisted; continued demand could indicate investors remain cautious despite rising stocks.", tone:"up", href:"https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM", range:"Day range $2,351–$2,386", points:[56,47,52,38,44,49,35,41,27,33,24,29] },
  { name:"U.S. Dollar Index", value:"104.2", move:"−0.18%", description:"The U.S. Dollar Index (DXY), which compares the dollar with major currencies, fell 0.18% as rate expectations eased; a softer dollar can reduce pressure on U.S. exporters and emerging markets.", tone:"down", href:"https://fred.stlouisfed.org/series/DTWEXBGS", range:"Day range 103.9–104.6", points:[104.5,104.4,104.45,104.3,104.35,104.2,104.28,104.12,104.18,104.05,104.1,104.02] },
  { name:"VIX volatility", value:"17.8", move:"−3.20%", description:"The Cboe Volatility Index (VIX), a measure of expected stock-market swings, fell 3.20% as inflation fears eased; a lower reading suggests investors are demanding less protection against near-term turbulence.", tone:"caution", href:"https://fred.stlouisfed.org/series/VIXCLS", range:"Day range 17.5–18.9", points:[18.8,18.6,18.7,18.3,18.45,18.1,18.2,17.95,18.05,17.8,17.9,17.8] },
];

const secondary = [
  {
    number: "02", label: "Growth", title: "The economy grew more than first estimated",
    stat: "Total output: revised higher", impact: [["↗", "People and businesses spend"], ["$", "Companies sell more"], ["+", "Jobs can stay supported"]],
    text: "Gross domestic product (GDP), the total value of goods and services produced in the country, was revised higher relative to the government’s first estimate. The revision indicates that household and business spending was stronger than first calculated. Keep an eye on hiring and wages, since stronger production can support jobs but may also keep interest rates high if demand pushes prices upward.",
    why: "GDP shows whether the economy is producing and selling more or less. Growth can protect jobs and income, while growth that runs too hot can keep borrowing costs elevated.",
    source: "U.S. Bureau of Economic Analysis (BEA)", href: "https://www.bea.gov/data/gdp/gross-domestic-product",
  },
  {
    number: "03", label: "Markets", title: "Stocks rose as borrowing pressure eased",
    stat: "Broad stocks: +0.4%", impact: [["↓", "Government yields fall"], ["%", "Money costs less to borrow"], ["↗", "Stocks get support"]],
    text: "The Standard & Poor’s 500 (S&P 500), an index tracking large U.S. companies, rose 0.4%, while the technology-heavy Nasdaq rose 0.7%. Both gained as the 10-year Treasury yield fell relative to its recent high, indicating that investors expected slightly less pressure from borrowing costs. Keep an eye on mortgage rates and business investment, which often respond to the same interest-rate moves.",
    why: "Lower borrowing rates can make expansion cheaper for companies. They can also make future profits more valuable today, which often supports stock prices.",
    source: "Federal Reserve Economic Data (FRED)", href: "https://fred.stlouisfed.org/categories/32255",
  },
  {
    number: "04", label: "Energy", title: "Higher oil prices could reach household budgets",
    stat: "U.S. crude oil: $86.40", impact: [["▲", "Oil stays expensive"], ["→", "Transport costs rise"], ["$", "Fuel and goods may cost more"]],
    text: "West Texas Intermediate (WTI), the main U.S. crude-oil price benchmark, rose 1.3% to $86.40 relative to the previous close as supply uncertainty increased. The move indicates that traders saw a greater risk of tighter oil supplies. Keep an eye on gasoline, airline tickets, delivery fees, and grocery prices because fuel costs move through transportation and production networks.",
    why: "Oil is used to move goods and make products such as plastics and packaging. Higher costs can reach gas stations and store shelves, leaving households with less money for other purchases.",
    source: "U.S. Energy Information Administration (EIA)", href: "https://www.eia.gov/petroleum/",
  },
];

function ImpactWheel({ stat, impact }: { stat: string; impact: string[][] }) {
  return <aside className="impact-box"><small>How the pieces interact</small><div className="impact-wheel"><div className="wheel-center">{stat}</div>{impact.map(([icon,text],index) => <div className={`wheel-node node-${index + 1}`} key={text}><i>{icon}</i><b>{text}</b></div>)}<span className="wheel-arrow arrow-1">↔</span><span className="wheel-arrow arrow-2">↔</span><span className="wheel-arrow arrow-3">↔</span></div><p className="feedback-note">These effects can reinforce or weaken one another.</p></aside>;
}

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
        <div className="section-heading market-heading"><h2 id="market-title">Market Snapshot</h2></div>
        <div className="market-grid">
          {markets.map((market) => (
            <article className="market" key={market.name}>
              <h3>{market.name}</h3><div className="market-value"><strong>{market.value}</strong><b className={market.tone}>{market.move}</b></div>
              <Sparkline points={market.points} tone={market.tone as "up" | "down" | "risk" | "caution"} />
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
          <div className="story-content"><div className="story-copy"><h2 id="stories-title">Prices rose more slowly than expected</h2><p>The Personal Consumption Expenditures (PCE) price index, the Federal Reserve’s preferred measure of prices paid for goods and services, rose 0.3% from the prior month compared with the 0.4% forecast. The smaller increase indicates that inflation pressure eased. Keep an eye on groceries, rent, and fuel because several months of slower increases would offer stronger evidence that household budgets are getting relief.</p><p className="why"><strong>Why it matters</strong> If price increases keep slowing, the Federal Reserve may feel less need to raise interest rates. That can eventually reduce pressure on mortgages, car loans, credit cards, and business loans.</p><a className="source-link" href="https://www.bea.gov/news/current-releases" target="_blank" rel="noreferrer">U.S. Bureau of Economic Analysis (BEA) ↗</a></div><ImpactWheel stat="PCE +0.3% vs +0.4% forecast" impact={[["↓","Price growth slows"],["%","Rate pressure eases"],["$","Borrowing may get cheaper"]]} /></div>
        </article>

        <div className="other-heading"><p className="section-label">Three other things that matter</p></div>
        <div className="secondary-list">
          {secondary.map((story) => <article key={story.number}><div className="story-meta"><span>{story.number}</span><b>{story.label}</b></div><div className="story-content"><div className="story-copy"><h3>{story.title}</h3><p>{story.text}</p><p className="why"><strong>Why it matters</strong> {story.why}</p><a className="source-link" href={story.href} target="_blank" rel="noreferrer">{story.source} ↗</a></div><ImpactWheel stat={story.stat} impact={story.impact} /></div></article>)}
        </div>
      </section>

      <section className="notable" aria-labelledby="notable-title">
        <div className="section-heading"><h2 id="notable-title">Noteworthy Updates</h2></div>
        <div className="notable-list">{notable.map(([title, text, source, href]) => <article key={title}><h3>{title}</h3><p>{text}</p><a href={href} target="_blank" rel="noreferrer">{source} ↗</a></article>)}</div>
      </section>

      <section className="watch" aria-labelledby="watch-title">
        <div className="section-heading"><h2 id="watch-title">What to Watch For</h2><p>Compare the result with expectations, not only the prior number.</p></div>
        <div className="event-list">{events.map((event) => <article key={event.date}><time>{event.date}</time><div className="event-main"><h3>{event.title}</h3><p>{event.question}</p></div><div className="scenario hotter"><b>Hotter / stronger</b><p>{event.hot}</p></div><div className="scenario cooler"><b>Cooler / weaker</b><p>{event.cool}</p></div><a href={event.href} target="_blank" rel="noreferrer">{event.source} ↗</a></article>)}</div>
      </section>

      <footer><span><strong>Concision leaves out nuance.</strong> Use the source links for full releases, methodology, revisions, and context.</span><span>Educational context, not investment advice.</span></footer>
    </main>
  );
}
