import AnnotatedText from "./AnnotatedText";
export default function BottomLine({sentences}:{sentences:string[];closing:string}){return <section className="bottom-line" id="bottom-line" aria-labelledby="bottom-line-title"><h2 id="bottom-line-title">Bottom Line</h2><div>{sentences.slice(0,2).map(sentence=><p key={sentence}><AnnotatedText text={sentence}/></p>)}</div></section>}
