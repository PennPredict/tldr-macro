const etDay=date=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
export function getEditionStatus(published,now=new Date()){
  const then=new Date(published);
  if(etDay(now)>etDay(then))return `This is an archived edition from ${new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",month:"short",day:"numeric",year:"numeric"}).format(then)}.`;
  if(now.getTime()-then.getTime()>10800000)return `Published at ${new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"numeric",minute:"2-digit"}).format(then)} ET. Prices have likely moved.`;
  return "";
}
