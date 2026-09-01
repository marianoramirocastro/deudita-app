import { useState } from 'react'
import { AmountInput } from '../components/AmountInput'
import { ExchangeReference } from '../components/ExchangeReference'
import { Modal } from '../components/Modal'
import { Page } from '../components/Page'
import { useFinance } from '../hooks/useFinance'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { db } from '../storage/db'
import type { Debt, DebtType } from '../types/models'
import { debtTypeLabels } from '../types/labels'
import { formatMoney, formatDate, id, todayISO } from '../utils/format'

const reasons=['Me genera ansiedad','Afecta una relación','Puede generar un problema legal','Está vencida','Tiene intereses altos','Quiero sacármela de encima']
const blank=(order:number):Debt=>({id:id(),name:'',type:'credit_card',balance:0,initialBalance:0,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:order,createdAt:todayISO(),currency:'ARS',status:'active'})

export function Debts(){
  const {debts,settings}=useFinance(),rateState=useExchangeRates(true),[editing,setEditing]=useState<Debt|null>(null),[showRates,setShowRates]=useState(false)
  const ordered=[...debts].sort((a,b)=>a.manualOrder-b.manualOrder)
  const save=async()=>{if(!editing||!editing.name.trim()||editing.balance<0)return;let next={...editing,initialBalance:editing.initialBalance||editing.balance,status:editing.balance>0?'active' as const:'paid' as const};if(next.currency==='USD'&&!next.conversionRate){const preferred=next.type==='credit_card'?'card':settings.preferredConversion==='manual'?'manual':undefined,rate=preferred==='manual'?settings.manualExchangeRate:preferred?rateState.rates[preferred]?.sell:undefined;if(rate&&preferred){next={...next,conversionRate:rate,conversionSource:preferred,conversionDate:new Date().toISOString(),initialConvertedBalanceARS:next.initialConvertedBalanceARS??next.initialBalance*rate}}}await db.debts.put(next);setEditing(null)}
  const remove=async(d:Debt)=>{if(confirm(`¿Eliminar “${d.name}”? Los pagos asociados también se eliminarán.`))await db.transaction('rw',db.debts,db.payments,async()=>{await db.debts.delete(d.id);await db.payments.where('debtId').equals(d.id).delete()})}
  const move=async(d:Debt,direction:-1|1)=>{const index=ordered.findIndex(item=>item.id===d.id),swap=ordered[index+direction];if(!swap)return;await db.transaction('rw',db.debts,async()=>{await db.debts.put({...d,manualOrder:swap.manualOrder});await db.debts.put({...swap,manualOrder:d.manualOrder})})}
  return <Page title="Deudas" eyebrow="Tu panorama" action={<button className="button primary small" onClick={()=>setEditing(blank(debts.length))}>+ Agregar deuda</button>}>
    <p className="support-line">Cargá lo que sepas. Las tasas ayudan a estimar intereses, pero no son obligatorias.</p>
    {debts.length>1&&<div className="manual-order-note"><span><strong>Orden manual</strong><small>Usá las flechas para decidir qué deuda va primero en esa estrategia.</small></span></div>}
    <div className="list-stack">{ordered.length?ordered.map((d,index)=><article className="debt-card" key={d.id}>
      <div className="debt-main"><span className="debt-icon">{d.type==='family'||d.type==='friend'?'🤝':d.type==='credit_card'?'▰':'$'}</span><div><small>{debtTypeLabels[d.type]}</small><h2>{d.name}</h2><span>{d.creditor||'Sin acreedor cargado'} · vence {formatDate(d.dueDate)}</span></div></div>
      <div className="debt-numbers"><span><small>Saldo</small><strong>{formatMoney(d.balance,d.currency)}</strong></span><span><small>Mínimo / cuota</small><strong>{formatMoney(Math.max(d.minimumPayment,d.agreedPayment??0),d.currency)}</strong></span><span><small>Urgencia</small><strong>{d.personalUrgency}/5</strong></span></div>
      {d.currency==='USD'&&<ExchangeReference usd={d.balance} rates={rateState.rates} manualRate={d.conversionSource==='manual'?d.conversionRate:undefined} error={rateState.error} onRetry={()=>rateState.refresh()}/>}
      <div className="card-actions"><div className="reorder-buttons"><button disabled={index===0} aria-label={`Subir ${d.name}`} onClick={()=>move(d,-1)}>↑</button><button disabled={index===ordered.length-1} aria-label={`Bajar ${d.name}`} onClick={()=>move(d,1)}>↓</button></div><button className="button ghost small" onClick={()=>setEditing({...d})}>Editar</button><button className="button danger-link small" onClick={()=>remove(d)}>Eliminar</button></div>
    </article>):<div className="empty large"><span>🧾</span><h2>No cargaste ninguna deuda todavía.</h2><button className="button primary" onClick={()=>setEditing(blank(0))}>Agregar mi primera deuda</button></div>}</div>
    {editing&&<Modal title={debts.some(d=>d.id===editing.id)?'Editar deuda':'Nueva deuda'} onClose={()=>setEditing(null)}>
      <div className="form-grid">
        <label className="field wide"><span>Nombre *</span><input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} placeholder="Ej. Visa Galicia"/></label>
        <fieldset className="currency-choice wide"><legend>Moneda</legend><button type="button" className={editing.currency==='ARS'?'active':''} onClick={()=>setEditing({...editing,currency:'ARS'})}>Pesos argentinos</button><button type="button" className={editing.currency==='USD'?'active':''} onClick={()=>setEditing({...editing,currency:'USD'})}>Dólares</button></fieldset>
        <label className="field"><span>Tipo</span><select value={editing.type} onChange={e=>setEditing({...editing,type:e.target.value as DebtType})}>{Object.entries(debtTypeLabels).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
        <label className="field"><span>Entidad / acreedor</span><input value={editing.creditor??''} onChange={e=>setEditing({...editing,creditor:e.target.value})}/></label>
        <label className="field"><span>Saldo pendiente *</span><AmountInput currency={editing.currency} value={editing.balance||''} onChange={v=>setEditing({...editing,balance:v})}/></label>
        <label className="field"><span>Pago mínimo</span><AmountInput currency={editing.currency} value={editing.minimumPayment||''} onChange={v=>setEditing({...editing,minimumPayment:v})}/></label>
        <label className="field"><span>Cuota pactada</span><AmountInput currency={editing.currency} value={editing.agreedPayment??''} onChange={v=>setEditing({...editing,agreedPayment:v||undefined})}/></label>
        <label className="field"><span>Vencimiento</span><input type="date" value={editing.dueDate??''} onChange={e=>setEditing({...editing,dueDate:e.target.value||undefined})}/></label>
        <label className="field"><span>TNA % <button className="inline-help" type="button" onClick={()=>setShowRates(!showRates)}>¿qué es?</button></span><input type="number" min="0" max="1000" value={editing.annualRate??''} onChange={e=>setEditing({...editing,annualRate:e.target.value?Math.max(0,Number(e.target.value)):undefined})}/></label>
        <label className="field"><span>CFT %</span><input type="number" min="0" max="2000" value={editing.cft??''} onChange={e=>setEditing({...editing,cft:e.target.value?Math.max(0,Number(e.target.value)):undefined})}/></label>
      </div>
      {editing.currency==='USD'&&<><label className="field"><span>¿Cómo pensás pagarla?</span><select value={editing.usdPaymentMethod??'unknown'} onChange={e=>setEditing({...editing,usdPaymentMethod:e.target.value as Debt['usdPaymentMethod']})}><option value="usd">Con dólares</option><option value="ars">Con pesos</option><option value="unknown">Todavía no sé</option></select></label><div className="help-box"><strong>El resumen manda.</strong><p>Si ya tenés el resumen o tu banco te informa un valor específico, usá ese monto como referencia principal.</p></div><label className="field"><span>Cotización personalizada por USD <small>(opcional)</small></span><AmountInput value={editing.conversionSource==='manual'?editing.conversionRate??'':''} onChange={v=>setEditing({...editing,conversionRate:v||undefined,conversionSource:v?'manual':undefined,conversionDate:v?new Date().toISOString():undefined})}/></label><ExchangeReference usd={editing.balance} rates={rateState.rates} manualRate={editing.conversionSource==='manual'?editing.conversionRate:undefined} error={rateState.error} onRetry={()=>rateState.refresh()}/></>}
      {(editing.annualRate??0)>300&&<div className="warning-box"><strong>Esta tasa es muy alta.</strong><p>Puede ser correcta, pero revisá si está expresada como TNA, TEA, mensual o si hubo un error al copiarla.</p></div>}
      {showRates&&<div className="help-box"><strong>Sin vueltas</strong><p><b>TNA</b> es una tasa anual que no contempla cómo se acumulan intereses. <b>TEA</b> refleja esa acumulación durante el año. <b>CFT</b> intenta reunir intereses, comisiones, seguros e impuestos: suele ser el número más útil para comparar costos.</p></div>}
      <fieldset className="urgency"><legend>Urgencia personal: {editing.personalUrgency}/5</legend><input aria-label="Urgencia personal" type="range" min="1" max="5" value={editing.personalUrgency} onChange={e=>setEditing({...editing,personalUrgency:Number(e.target.value) as Debt['personalUrgency']})}/><p>No todo pasa por los intereses. Está bien tener en cuenta lo que esta deuda significa para vos.</p></fieldset>
      <fieldset className="reason-list"><legend>¿Por qué te importa priorizarla? <small>(opcional)</small></legend>{reasons.map(r=><label key={r}><input type="checkbox" checked={editing.priorityReasons.includes(r)} onChange={e=>setEditing({...editing,priorityReasons:e.target.checked?[...editing.priorityReasons,r]:editing.priorityReasons.filter(x=>x!==r)})}/>{r}</label>)}</fieldset>
      <label className="field"><span>Comentarios</span><textarea value={editing.notes??''} onChange={e=>setEditing({...editing,notes:e.target.value})}/></label>
      <div className="modal-actions"><button className="button ghost" onClick={()=>setEditing(null)}>Cancelar</button><button className="button primary" disabled={!editing.name.trim()} onClick={save}>Guardar deuda</button></div>
    </Modal>}
  </Page>
}
