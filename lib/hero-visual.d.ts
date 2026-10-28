export type HeroMarket={name:string;kind?:string;value:number;display_value:string;prior_close:number;change_percent:number;display_change:string;points:number[];series_dates:string[];fetched_at:string;outlier_flags?:string[]};
export type HeroModel={requested:string;rendered:string;lead:HeroMarket;gate:{passed:boolean;reasons:string[];points:number[];dates:string[]};edition_date:string};
export function heroSeriesGate(market:HeroMarket,edition:unknown,expectedBucket?:string):HeroModel["gate"];
export function buildHeroVisual(edition:unknown,hero:unknown,requested?:string):HeroModel;
