import { Footer, Header } from "../SiteChrome";

const terms=[
  ["yield","Yield","The income an investment produces relative to its price. For Treasury securities, yields also reflect the return investors demand to lend the U.S. government money."],
  ["basis-point","Basis point","One-hundredth of a percentage point. A move from 5.28% to 5.29% is one basis point."],
  ["pmi","Purchasing Managers’ Index (PMI)","A survey-based indicator of business activity. A reading above 50 generally indicates expansion, while a reading below 50 generally indicates contraction."],
  ["cpi","Consumer Price Index (CPI)","A Bureau of Labor Statistics measure of price changes for goods and services purchased by households."],
  ["ppi","Producer Price Index (PPI)","A Bureau of Labor Statistics measure of price changes received by domestic producers, often before costs reach consumers."],
  ["fomc","Federal Open Market Committee (FOMC)","The Federal Reserve group that sets the target range for short-term interest rates and guides U.S. monetary policy."],
  ["vix","Cboe Volatility Index (VIX)","A measure derived from options prices that reflects expected swings in the S&P 500 over roughly the next 30 days. It measures expected movement, not direction."],
  ["dxy","U.S. Dollar Index (DXY)","An index comparing the U.S. dollar with a basket of major currencies."],
  ["futures","Futures contract","An agreement to buy or sell an asset at a specified future date. A futures price can differ from the current spot price."],
  ["spot","Spot price","The price for buying or selling an asset for immediate delivery."],
];
export default function Glossary(){return <main className="shell"><Header/><article className="prose-page"><p className="eyebrow">Glossary</p><h1>Plain-English market terms.</h1><p>Definitions are educational and intentionally concise. Source releases may use more precise technical language.</p><dl className="glossary-list">{terms.map(([id,term,definition])=><div id={id} key={id}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></article><Footer/></main>}
