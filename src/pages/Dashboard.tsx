import { useMemo,useState } from 'react'
import { Link } from 'react-router-dom'
import { AmountInput } from '../components/AmountInput'
import { CurrencyProgressGroup } from '../components/CurrencyProgressGroup'
import { EverydayConverter } from '../components/EverydayConverter'
import { ExchangeReference } from '../components/ExchangeReference'
import { Modal } from '../components/Modal'
import { Page } from '../components/Page'
import { mandatoryPayment } from '../financial-engine'
import { applyDebtPayment,createPaymentRecord } from '../financial-engine/payments'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { useFinance } from '../hooks/useFinance'
import { db } from '../storage/db'
import type { Currency,Debt } from '../types/models'
import { debtDueLabel } from '../types/labels'
import { formatARS,formatDate,formatMoney,id,todayISO } from '../utils/format'

const total=(debts:Debt[],currency:Currency)=>debts.filter(debt=>debt.currency===currency&&debt.status==='active').reduce((sum,debt)=>sum+debt.balance,0)
const dueRank=(debt:Debt)=>debt.dueDate?Number(debt.dueDate.replaceAll('-','')):debt.dueWindow==='early'?90000001:debt.dueWindow==='mid'?90000002:debt.dueWindow==='late'?90000003:90000004
const dueText=(debt:Debt)=>debt.dueDate?`el ${formatDate(debt.dueDate)}`:debtDueLabel(debt)
export function Dashboard(){
  const finance=useFinance(),rates=useExchangeRates(true),[modal,setModal]=useState<'payment'|'explain'|'complete'|'deficit'|null>(null),[amount,setAmount]=useState(0),[paymentDebt,setPaymentDebt]=useState('')
  const active=useMemo(()=>finance.debts.filter(debt=>debt.status==='active'&&debt.balance>0),[finance.debts]),next=useMemo(()=>[...active].sort((a,b)=>dueRank(a)-dueRank(b)),[active]),selected=finance.debts.find(debt=>debt.id===paymentDebt),ars=total(finance.debts,'ARS'),usd=total(finance.debts,'USD')
  const openPayment=()=>{setPaymentDebt(active[0]?.id??'');setAmount(0);setModal('payment')}
  const registerPayment=async()=>{if(!selected||amount<=0)return;const date=todayISO(),result=applyDebtPayment(selected,amount,date);await db.transaction('rw',db.debts,db.payments,async()=>{await db.payments.add(createPaymentRecord(selected,result.paymentAmount,date,id(),selected.conversionRate));await db.debts.put(result.debt)});setAmount(0);setModal(result.debt.status==='paid'?'complete':null)}
  if(!finance.debts.length&&!finance.settings.onboardingComplete)return <Page title="Primero veamos dónde estás" eyebrow="Tu plan"><div className="empty large"><h2>Todavía no cargaste tu situación.</h2><p>Son pasos cortos y todo queda en este dispositivo.</p><Link className="button primary" to="/empezar">Empezar</Link></div></Page>
  return <Page title="Tu plan" eyebrow="Hoy" action={<button className="button primary dashboard-payment" disabled={!active.length} onClick={openPayment}>+ Registrar pago</button>}>
    <section aria-label="Progreso" className="dashboard-progress"><CurrencyProgressGroup progress={finance.progressByCurrency} character={finance.settings.progressCharacter}/><button className="button primary large dashboard-payment mobile-payment" disabled={!active.length} onClick={openPayment}>+ Registrar pago</button></section>
    <div className="metric-grid dashboard-metrics"><article className="metric hero-metric"><small>Saldo pendiente</small>{ars>0&&<strong>{formatMoney(ars,'ARS')}</strong>}{usd>0&&<strong>{formatMoney(usd,'USD')}</strong>}<span>{active.length} {active.length===1?'deuda activa':'deudas activas'}</span></article><article className="metric"><small>Próximo compromiso</small><strong>{next[0]?formatMoney(mandatoryPayment(next[0]),next[0].currency):'Listo'}</strong><span>{next[0]?dueText(next[0]):'No quedan compromisos'}</span></article><article className="metric"><small>Disponible este mes</small><strong>{formatARS(finance.budget.availableExtra)}</strong><span>después de esenciales y compromisos</span></article></div>
    <button className="calculation-link" onClick={()=>setModal('explain')}>ⓘ ¿Cómo se calcula?</button>
    {finance.budget.deficit>0&&<section className="crisis compact-crisis"><div><p className="eyebrow">Este mes</p><h2>Con estos números no hay margen adicional este mes.</h2><p>Faltan {formatARS(finance.budget.deficit)} para cubrir gastos esenciales y compromisos cargados.</p></div><button className="button secondary small" onClick={()=>setModal('deficit')}>Ver qué compone el déficit</button></section>}
    {finance.budget.deficit===0&&finance.budget.availableExtra===0&&active.length>0&&<section className="section-card zero-margin"><h2>Con estos números no hay margen adicional este mes.</h2><p>Los compromisos cargados pueden seguir reduciendo saldos; no agregamos pagos extra ficticios.</p></section>}
    <EverydayConverter outstandingARS={ars}/>
    {usd>0&&<ExchangeReference usd={usd} rates={rates.rates} error={rates.error} onRetry={()=>rates.refresh()}/>}
    <section className="section-card"><div className="section-title"><div><p className="eyebrow">Calendario</p><h2>Próximos vencimientos</h2></div><Link to="/deudas">Ver deudas</Link></div>{next.length?next.slice(0,4).map(debt=><div className="obligation" key={debt.id}><span><strong>{debt.name}</strong><small>{dueText(debt)} · {debt.currency}</small></span><strong>{formatMoney(mandatoryPayment(debt),debt.currency)}</strong></div>):<div className="empty">No quedan deudas pendientes.</div>}</section>
    {modal==='payment'&&<Modal title="Registrar un pago" onClose={()=>setModal(null)}><label className="field"><span>Deuda</span><select value={paymentDebt} onChange={event=>{setPaymentDebt(event.target.value);setAmount(0)}}>{active.map(debt=><option key={debt.id} value={debt.id}>{debt.name} · {formatMoney(debt.balance,debt.currency)}</option>)}</select></label><label className="field"><span>Importe pagado</span><AmountInput currency={selected?.currency??'ARS'} value={amount||''} onChange={setAmount}/></label><p className="help">Si el importe supera el saldo, registramos solamente lo que faltaba y la deuda queda exactamente en cero.</p><div className="modal-actions"><button className="button ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="button primary" disabled={!amount||!paymentDebt} onClick={registerPayment}>Guardar pago</button></div></Modal>}
    {modal==='explain'&&<Modal title="Cómo calculamos el disponible" onClose={()=>setModal(null)}><div className="calculation"><p>Ingresos <strong>{formatARS(finance.budget.income)}</strong></p><p>Gastos esenciales <strong>− {formatARS(finance.budget.essential)}</strong></p><p>Mínimos convertibles <strong>− {formatARS(finance.budget.mandatoryDebt)}</strong></p><hr/><p>Disponible para adelantar <strong>{formatARS(finance.budget.availableExtra)}</strong></p></div><p className="help">Una deuda USD sin referencia no entra en el presupuesto en pesos. No inventamos una cotización.</p></Modal>}
    {modal==='deficit'&&<Modal title="Qué compone el déficit" onClose={()=>setModal(null)}><div className="calculation"><p>Ingresos <strong>{formatARS(finance.budget.income)}</strong></p><p>Gastos esenciales <strong>− {formatARS(finance.budget.essential)}</strong></p><p>Compromisos cargados <strong>− {formatARS(finance.budget.mandatoryDebt)}</strong></p><hr/><p>Faltante <strong>{formatARS(finance.budget.deficit)}</strong></p></div><p>Podés revisar gastos, actualizar ingresos o consultar alternativas con cada acreedor. No sugerimos dejar una obligación para acelerar otra.</p></Modal>}
    {modal==='complete'&&<Modal title="Deuda terminada" onClose={()=>setModal(null)}><div className="completion"><span>✓</span><h2>Ese saldo llegó a cero.</h2><p>La deuda quedó pagada con la fecha de hoy. El progreso de esa moneda ya incorpora este cierre.</p><button className="button primary" onClick={()=>setModal(null)}>Seguir</button></div></Modal>}
  </Page>
}
