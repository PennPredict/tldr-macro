const markets = [
  { name: "S&P 500", value: "4,357.2", move: "+0.43%", positive: true },
  { name: "Nasdaq", value: "13,457.8", move: "+0.72%", positive: true },
  { name: "Dow Jones", value: "33,891.2", move: "+0.36%", positive: true },
  { name: "10Y Treasury", value: "5.18%", move: "−0.11%", positive: false },
  { name: "WTI Oil", value: "$86.40", move: "+1.30%", positive: false },
  { name: "Gold", value: "$2,380", move: "+0.60%", positive: true },
];

const developments = [
  { n: "1", tone: "mint", title: "Inflation cools more than expected", body: "PCE rose 0.3% versus 0.4% expected, showing inflation pressure is easing.", why: "Lower inflation reduces the chance of an immediate Fed hike, generally supportive for stocks and bonds." },
  { n: "2", tone: "blue", title: "GDP revised higher", body: "Growth was revised up, supported by consumer spending and business investment.", why: "The economy remains solid despite high rates, supporting earnings while giving the Fed room to stay cautious." },
  { n: "3", tone: "violet", title: "Stocks move higher", body: "The S&P 500 rose 0.4% and the Nasdaq 0.7% as cooler inflation and resilient growth improved sentiment.", why: "Lower expected rates can support valuations, especially for growth stocks, while stronger activity supports earnings." },
  { n: "4", tone: "orange", title: "Oil remains a key risk", body: "Oil stayed elevated as geopolitical tensions kept energy inflation risk in focus.", why: "Higher oil can push inflation back up, increasing the likelihood of tighter policy and pressure on consumers." },
];

const connections = [
  { icon: "↓", title: "Inflation cools", note: "PCE: 0.3% vs. 0.4% expected." },
  { icon: "🏛", title: "Fed pressure eases", note: "Less need for an immediate hike." },
  { icon: "%", title: "Yields decline", note: "The 10Y eases from recent highs." },
  { icon: "↗", title: "Stocks rise", note: "Lower yields support valuations." },
  { icon: "!", title: "Risks remain", note: "Oil and geopolitics could lift inflation." },
];

const updates = [
  ["▣", "Jobs market mixed", "Openings fell as consumer confidence weakened."],
  ["◎", "Global rates", "Japan and Europe also face elevated sovereign yields."],
  ["▦", "Earnings matter", "Profit expectations are supporting equities despite high yields."],
  ["◉", "Other assets", "The dollar was quieter while gold remained firm."],
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div><a className="wordmark" href="#top"><strong>TLDR</strong> Markets</a><p>The day&apos;s markets, in plain English.</p></div>
        <span>Sample edition</span>
      </header>

      <section className="lead" id="top">
        <div className="lead-copy">
          <p className="section-label">Today&apos;s brief</p>
          <h1>Inflation cools,<br />stocks climb</h1>
          <p className="lead-summary">Inflation came in lower than expected, easing pressure on the Fed and pushing Treasury yields down. Stocks welcomed the combination of cooler prices and resilient growth, although oil and geopolitical risks remain.</p>
        </div>
        <div className="lead-visual" role="img" aria-label="Abstract sunrise over a financial city skyline">
          <span className="sun" /><span className="skyline">▥ ▥ ▤ ▥ ▥</span>
          <time><b>SEP 30</b><small>Sample</small></time>
        </div>
      </section>

      <section className="market-strip" aria-label="Market pulse">
        {markets.map((market, index) => (
          <article className="market-card" key={market.name}>
            <span>{market.name}</span><div><strong>{market.value}</strong><b className={market.positive ? "good" : "risk"}>{market.move}</b></div>
            <div className={`spark ${market.positive ? "spark-up" : "spark-down"}`} aria-hidden="true"><i style={{width: `${55 + index * 7}%`}} /></div>
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
              <div className={`why ${item.tone}`}><span>●</span><div><strong>Why it matters</strong><p>{item.why}</p></div></div>
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
      </section>

      <section className="section-block">
        <p className="section-label">Other notable updates</p>
        <div className="update-grid">
          {updates.map(([icon, title, body]) => <article key={title}><span>{icon}</span><div><strong>{title}</strong><p>{body}</p></div></article>)}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="watch-panel">
          <p className="section-label">What to watch next</p>
          <ul>
            <li><time><b>OCT</b>3</time><div><strong>Jobs report</strong><p>Tests whether labor demand is cooling.</p></div></li>
            <li><time><b>OCT</b>5</time><div><strong>Fed meeting minutes</strong><p>More detail on policymakers&apos; next move.</p></div></li>
            <li><time><b>OCT</b>10</time><div><strong>CPI inflation</strong><p>Another read on underlying price pressure.</p></div></li>
            <li><time><b>OCT</b>15</time><div><strong>Geopolitical developments</strong><p>Potential implications for oil and inflation.</p></div></li>
          </ul>
        </article>

        <article className="bottom-line">
          <p className="section-label">Bottom line</p>
          <div className="bottom-summary"><span>↗</span><div><h2>A positive day, but uncertainty remains.</h2><p>Cooler inflation and solid growth lifted stocks and eased pressure on the Fed, but elevated oil and geopolitical risks could keep inflation higher.</p></div></div>
          <div className="takeaways"><p className="section-label">Key takeaways</p><ul><li>Inflation is showing signs of cooling.</li><li>The economy remains solid despite higher rates.</li><li>Lower yields supported a strong day for stocks.</li><li>Oil remains the largest visible risk to the outlook.</li></ul></div>
        </article>
      </section>

      <footer><span>Educational context, not investment advice.</span><span>Facts · Reaction · Relevance · What&apos;s next</span></footer>
    </main>
  );
}
