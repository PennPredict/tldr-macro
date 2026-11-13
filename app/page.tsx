import edition from "../content/current-edition.json";
import headlines from "../content/headlines.json";
import { Footer, Header } from "./SiteChrome";
import MarketSnapshot from "./MarketSnapshot";
import {generateSummary} from "../lib/edition-summary.mjs";
import EventCalendar from "./EventCalendar";
import EconomicThread from "./EconomicThread";
import features from "../config/features.json";
import V2Home from "./V2Home";
import {generateHeroCopy} from "../lib/hero-copy.mjs";
import themeSettings from "../config/themes.json";
import themeState from "../data/themes/state.json";
import assessments from "../content/daily-assessments.json";
import bottomLine from "../content/bottom-line.json";
import globalItems from "../content/global-items.json";
import MacroThemes from "./MacroThemes";
import WhatChangedToday from "./WhatChangedToday";
import BottomLine from "./BottomLine";

export default function Home(){if(features.design.v2)return <V2Home/>;const summary=generateSummary(edition),hero=generateHeroCopy(edition);return <main className="shell"><Header updated={edition.updated_at} summary={summary.sentence} heroHeadline={hero.headline} heroSummary={hero.summary}/>
  <MacroThemes settings={themeSettings} state={themeState} events={edition.calendar} storyTopics={assessments.map(item=>item.topic_tag)}/>
  <WhatChangedToday stories={headlines} assessments={assessments} globalItems={globalItems}/>
  <EconomicThread/>
  <MarketSnapshot markets={edition.markets} compact/>
  <section className="watch" id="next" aria-labelledby="watch-title"><div className="section-heading"><h2 id="watch-title">Next</h2></div><EventCalendar events={edition.calendar} published={edition.updated_at}/></section>
  <BottomLine sentences={bottomLine.sentences} closing={bottomLine.closing}/>
  <Footer/>
</main>}
