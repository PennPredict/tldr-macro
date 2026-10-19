import Link from "next/link";import Home from "../../page";import edition from "../../../content/current-edition.json";
export const dynamicParams=false;export function generateStaticParams(){return[{date:edition.edition_date}]}
export default async function ArchivedEdition({params}:{params:Promise<{date:string}>}){const{date}=await params;return <><nav className="archive-nav"><Link href="/archive/">← Archive</Link><span>{date}</span></nav><Home/></>}
