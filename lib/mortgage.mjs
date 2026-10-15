export function monthlyPayment(principal,annualRatePercent,years){
  if(!(principal>0)||!(annualRatePercent>=0)||!(years>0))throw new Error("Mortgage inputs must be positive");
  const payments=Math.round(years*12),rate=annualRatePercent/1200;
  return rate===0?principal/payments:principal*rate*(1+rate)**payments/((1+rate)**payments-1);
}

export function paymentIllustration({principal,rate,years=30,increase=1}){
  const base=Math.round(monthlyPayment(principal,rate,years)),higher=Math.round(monthlyPayment(principal,rate+increase,years));
  return {base,higher,difference:higher-base};
}
