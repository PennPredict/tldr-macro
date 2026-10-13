export type MatchTerm={id:string;surface_forms:string[]};
export function findTermMarkers<T extends MatchTerm>(text:string,terms:T[],seen?:Set<string>):Array<{start:number;end:number;term:T;surface:string}>;
