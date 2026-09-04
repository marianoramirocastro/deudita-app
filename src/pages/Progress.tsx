import { useState } from 'react'
import { Page } from '../components/Page'
import { useFinance } from '../hooks/useFinance'
import { db } from '../storage/db'
import type { Currency,MonthlySnapshot } from '../types/models'
import { formatDate,formatMoney,todayISO } from '../utils/format'

const monthLabel=(date:string)=>new Intl.DateTimeFormat('es-AR',{month:'short',year:'2-digit'}).format(new Date(`${date}T12:00:00`))
const snapshotValue=(snapshot:MonthlySnapshot,currency:Currency)=>currency==='ARS'?snapshot.debtTotalARS:snapshot.debtTotalUSD

function CurrencyEvolution({currency,snapshots}:{currency:Currency;snapshots:MonthlySnapshot[]}){
  const series=snapshots.filter(snapshot=>typeof snapshotValue(snapshot,currency)==='number')
  const max=Math.max(...series.map(snapshot=>snapshotValue(snapshot,currency)??0),1)
  const title=currency==='ARS'?'Evolución en pesos':'Evolución en dólares'
  return <section className="section-card"><div className="section-title"><div><p className="eyebrow">Mes a mes</p><h2>{title}</h2></div></div>{series.length?<div className="chart" role="img" aria-label={`Gráfico de ${title.toLocaleLowerCase('es-AR')}`}>{series.slice(-12).map(item=>{const value=snapshotValue(item,currency)??0;return <div className="bar-wrap" key={item.date.slice(0,7)}><span className="bar-value">{formatMoney(value,currency)}</span><div className="bar" style={{height:`${Math.max(5,value/max*100)}%`}}/><small>{monthLabel(item.date)}</small></div>})}</div>:<div className="empty">Cuando cierres un mes con deudas en {currency}, vas a ver su evolución acá.</div>}</section>
}

export function Progress(){
  const finance=useFinance(),[saved,setSaved]=useState(false),today=todayISO(),month=today.slice(0,7)
  const ars=finance.progressByCurrency.ARS,usd=finance.progressByCurrency.USD
  const snapshot=async()=>{await db.snapshots.put({id:`month-${month}`,date:today,incomeTotal:finance.budget.income,essentialTotal:finance.budget.essential,adjustableTotal:finance.budget.adjustable,debtTotal:ars?.currentOutstanding??0,...(ars?{debtTotalARS:ars.currentOutstanding}:{}),...(usd?{debtTotalUSD:usd.currentOutstanding}:{})});setSaved(true)}
  const snapshots=[...new Map(finance.snapshots.map(item=>[item.date.slice(0,7),item])).values()].sort((a,b)=>a.date.localeCompare(b.date))
  const separatedSnapshots=snapshots.filter(item=>typeof item.debtTotalARS==='number'||typeof item.debtTotalUSD==='number')
  const legacySnapshots=snapshots.length-separatedSnapshots.length
  return <Page title="Evolución" eyebrow="Historial local" action={<button className="button secondary small" onClick={snapshot}>Cerrar este mes</button>}>
    <p className="support-line">Acá queda el registro histórico. Pesos y dólares se guardan y muestran por separado.</p>
    {saved&&<div className="toast" role="status">Actualizamos la foto de este mes en el dispositivo.</div>}
    <div className="summary-strip progress-summary-strip">
      {ars&&<><span><small>Deuda inicial ARS</small><strong>{formatMoney(ars.initialTotal,'ARS')}</strong></span><span><small>Reducción ARS</small><strong>{formatMoney(ars.amountPaid,'ARS')}</strong></span></>}
      {usd&&<><span><small>Deuda inicial USD</small><strong>{formatMoney(usd.initialTotal,'USD')}</strong></span><span><small>Reducción USD</small><strong>{formatMoney(usd.amountPaid,'USD')}</strong></span></>}
      <span><small>Pagos registrados</small><strong>{finance.payments.length}</strong></span><span><small>Meses guardados</small><strong>{snapshots.length}</strong></span>
    </div>
    {legacySnapshots>0&&<p className="history-note">Hay {legacySnapshots} {legacySnapshots===1?'cierre anterior':'cierres anteriores'} sin desglose por moneda. Se conserva en tu respaldo, pero no se grafica para evitar mezclar ARS y USD.</p>}
    {(ars||separatedSnapshots.some(item=>typeof item.debtTotalARS==='number'))&&<CurrencyEvolution currency="ARS" snapshots={separatedSnapshots}/>}
    {(usd||separatedSnapshots.some(item=>typeof item.debtTotalUSD==='number'))&&<CurrencyEvolution currency="USD" snapshots={separatedSnapshots}/>}
    {!ars&&!usd&&!separatedSnapshots.length&&<section className="section-card"><div className="empty">Cuando cierres tu primer mes, vas a ver la evolución acá.</div></section>}
    <section className="section-card"><h2>Pagos realizados</h2>{finance.payments.length?[...finance.payments].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10).map(payment=><div className="money-row" key={payment.id}><span>{finance.debts.find(debt=>debt.id===payment.debtId)?.name??'Deuda eliminada'}<small>{formatDate(payment.date)}</small></span><strong>{formatMoney(payment.amount,payment.currency)}</strong></div>):<div className="empty">Cuando registres un pago, va a aparecer acá.</div>}</section>
  </Page>
}
