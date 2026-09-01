const integerFormatter=new Intl.NumberFormat('es-AR',{maximumFractionDigits:0})
export const formatARS = (value: number) => `$${integerFormatter.format(Number.isFinite(value) ? value : 0)}`
export const formatUSD = (value:number) => `USD ${new Intl.NumberFormat('es-AR',{minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(Number.isFinite(value)?value:0)}`
export const formatMoney=(value:number,currency:'ARS'|'USD')=>currency==='USD'?formatUSD(value):formatARS(value)
export const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC' }).format(new Date(`${value.slice(0,10)}T12:00:00Z`)) : 'Sin fecha'
export const formatDateTime=(value:string)=>new Intl.DateTimeFormat('es-AR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))
export const todayISO = () => new Date().toISOString().slice(0, 10)
export const id = () => crypto.randomUUID()
export const toAmount = (value: string | number) => { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }
