import { Footer, Header } from "../SiteChrome";

export default function About() {
  return <main className="shell">
    <Header />
    <article className="prose-page">
      <p className="eyebrow">About</p>
      <h1>Markets explained without assuming a finance background.</h1>
      <aside className="mission-tldr"><strong>TL;DR:</strong><p>TL;DR Macro bridges economic headlines and everyday understanding. It helps non-economics students understand the system, retail investors connect market prices to portfolios, students prepare for finance opportunities, and busy people stay informed. Low cortisol. Low effort. Useful context.</p></aside>
      <p>TL;DR Macro makes market intelligence useful to people who were never taught the language of economics. It turns the day’s most consequential developments into concise explanations of what changed, how the pieces connect, and where the effects may appear next.</p>
      <h2>The mission</h2>
      <p>Financial news often assumes readers already understand rates, yields, inflation measures, currencies, commodities, and market structure. TL;DR Macro bridges that gap without turning a briefing into a textbook. A reader should leave with enough context to understand the headline, ask a sharper question, and read the original source with confidence.</p>
      <h2>Who it serves</h2>
      <p>Non-economics students can build a working model of the economy. Retail investors can better understand how prices, policy, currencies, and company results may reach their portfolios. Students preparing for finance classes, internships, and interviews can develop the language needed to discuss markets intelligently. Busy readers can stay oriented without reading an entire business section.</p>
      <h2>What it does</h2>
      <p>The site separates reported facts from explanatory context. It defines unfamiliar terms, traces cause and effect, and describes historically observed relationships without recommending a security, strategy, or personal financial decision.</p>
      <h2>The economy as an ecosystem</h2>
      <p>Markets are shaped by connected decisions. Households spend and save. Businesses hire, invest, borrow, and set prices. Dealers connect buyers and sellers. Policymakers influence financial conditions. Global trade and capital flows carry shocks across borders. The agent views show how one development can mean something different from each seat.</p>
      <h2>Why each story has five views</h2>
      <p>Agents are the people and institutions that make economic decisions. The same news looks different depending on where you sit. After the shared facts, optional views examine households, businesses, market dealers, policymakers, and the global economy.</p>
      <h2>Where the information comes from</h2>
      <p>Primary sources come first, including the Bureau of Labor Statistics, Bureau of Economic Analysis, Federal Reserve, Treasury, Census Bureau, Energy Information Administration, Securities and Exchange Commission, and exchange or benchmark administrators. Independent reporting from approved publications can add context.</p>
      <h2>How often it updates</h2>
      <p>The target publication time is shortly after the U.S. stock market opens on weekdays. Each market figure carries its own timestamp. Market holidays, delayed releases, and unavailable data can postpone an edition.</p>
      <h2>How summaries are produced</h2>
      <p>Artificial intelligence assists with research organization and first-draft explanations. Automated checks screen source domains, market-data freshness, implausible values, banned phrasing, required fields, source diversity, and claims that need manual review. AI assistance does not remove the possibility of error.</p>
      <h2>Low cortisol. Low effort.</h2>
      <p>The goal is orientation, not information overload. The design favors a calm scan, plain language, selective visuals, and direct links to deeper reporting. Readers can stop after the essentials or continue when a story deserves more attention.</p>
      <h2>Limitations</h2>
      <p>Intraday prices change quickly. Economic data can be revised. A short explanation cannot include every cause, disagreement, or distributional effect. Links lead to fuller releases and methods.</p>
      <h2>Corrections</h2>
      <p>Corrections should identify what changed and preserve the original publication time. Until a dedicated address is configured, correction reports can be submitted through the project’s GitHub issue tracker.</p>
    </article>
    <Footer />
  </main>;
}
