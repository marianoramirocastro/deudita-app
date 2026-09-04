const integerFormatter=new Intl.NumberFormat('es-AR',{maximumFractionDigits:0})
export const formatARS = (value: number) => `$${integerFormatter.format(Number.isFinite(value) ? value : 0)}`
export const formatUSD = (value:number) => `USD ${new Intl.NumberFormat('es-AR',{minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(Number.isFinite(value)?value:0)}`
export const formatMoney=(value:number,currency:'ARS'|'USD')=>currency==='USD'?formatUSD(value):formatARS(value)
export const formatDate = (value?: string) => {if(!value)return'Sin fecha';const date=new Date(`${value.slice(0,10)}T12:00:00Z`);return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('es-AR',{timeZone:'UTC'}).format(date):'Fecha inválida'}
export const formatDateTime=(value:string)=>new Intl.DateTimeFormat('es-AR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))
export const todayISO = () => new Date().toISOString().slice(0, 10)
export const id = () => crypto.randomUUID()
export const toAmount = (value: string | number) => { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }
export const formatProjectionDuration=(status:'projected'|'no_capacity'|'indeterminate'|'extreme_duration',months?:number)=>{if(status==='no_capacity')return'Sin capacidad suficiente';if(status==='extreme_duration'){if(months===undefined)return'Sin fecha práctica';const years=Math.round(months/12);return`Aproximadamente ${new Intl.NumberFormat('es-AR').format(years)} años`}if(status==='indeterminate'||months===undefined)return'No calculable';if(months===0)return'Sin deuda pendiente';return`${months} ${months===1?'mes':'meses'}`}
