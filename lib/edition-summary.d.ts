export type SummaryFacts={edition_date:string;stocks:{name?:string;value?:number;change_percent?:number;bucket:string;record:"at"|"near"|null};rates:{name?:string;value?:number;change_basis_points?:number;bucket:string};third:{name:string;value?:number;change_percent?:number;bucket:string;override:boolean}};
export function buildSummaryFacts(edition:{edition_date:string;markets:Array<Record<string,unknown>>}):SummaryFacts;
export function generateSummaryFromFacts(facts:SummaryFacts):string;
export function generateSummary(edition:{edition_date:string;markets:Array<Record<string,unknown>>}):{facts:SummaryFacts;sentence:string};
export function gradeLevel(text:string):number;
export function lintSummary(sentence:string,facts:SummaryFacts):{passed:boolean;errors:string[];warnings:string[];characters:number;words:number;grade:number};
export const badExample:string;
export const summarySamples:Array<{label:string;facts:SummaryFacts;sentence:string}>;
