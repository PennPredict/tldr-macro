import fs from "node:fs";

const read=file=>JSON.parse(fs.readFileSync(file,"utf8")),write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n");
const config=read("config/themes.json"),state=read("data/themes/state.json"),edition=read("content/current-edition.json"),headlines=read("content/headlines.json"),globals=read("content/global-items.json");
const today=edition.edition_date,cutoff=new Date(`${today}T12:00:00-05:00`).getTime()-90*86400000,firstSentence=text=>(text.match(/^[^.!?]+[.!?]/)?.[0]||text).trim(),themeFor=topic=>config.themes.find(theme=>theme.topics.includes(topic));
state.edition_id=today;state.generated_at=edition.updated_at;
for(const theme of config.themes){const current=state.themes[theme.id]||{last_new_evidence_date:"",developments:[],indicators:[]};current.developments=(current.developments||[]).filter(item=>new Date(`${item.date}T12:00:00-05:00`).getTime()>=cutoff);state.themes[theme.id]=current;}
for(const story of headlines){if(!story.claims?.length||!story.sources?.length)continue;const theme=themeFor(story.topic_tag);if(!theme)continue;const current=state.themes[theme.id];if(current.developments.some(item=>item.date===today))continue;current.developments.unshift({date:today,headline:story.headline,line:firstSentence(story.commentary),source_urls:story.sources.map(item=>item.href),origin:"story",edition_id:today});current.last_new_evidence_date=today;}
const globalTheme=state.themes["global-geopolitics"];if(!globalTheme.developments.some(value=>value.date===today))for(const item of globals.filter(value=>value.qualifies!==false&&value.sources?.length)){globalTheme.developments.unshift({date:today,headline:item.headline,line:firstSentence(item.what),source_urls:item.sources.map(source=>source.href),origin:"global",edition_id:today});globalTheme.last_new_evidence_date=today;}
for(const current of Object.values(state.themes))current.developments.sort((a,b)=>b.date.localeCompare(a.date)).splice(20);
write("data/themes/state.json",state);
console.log(`Theme state updated for ${today}; 90-day retention applied.`);
