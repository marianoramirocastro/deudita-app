export const formatARS = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0).replace('$', '$ ')
export const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC' }).format(new Date(`${value.slice(0,10)}T12:00:00Z`)) : 'Sin fecha'
export const todayISO = () => new Date().toISOString().slice(0, 10)
export const id = () => crypto.randomUUID()
export const toAmount = (value: string | number) => { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }
