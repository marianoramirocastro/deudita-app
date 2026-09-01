/* eslint-disable react-refresh/only-export-components -- parsers are exported for deterministic locale tests */
import { useEffect, useState } from 'react'
import type { Currency } from '../types/models'

export const parseARSInput=(raw:string)=>{const digits=raw.replace(/\D/g,'');return digits?Number(digits):0}
export const parseUSDInput=(raw:string)=>{let clean=raw.toUpperCase().replace(/USD|\$|\s/g,'').replace(/[^0-9.,]/g,'');if(!clean)return 0;if(clean.includes(','))clean=clean.replace(/\./g,'').replace(',','.');else if((clean.match(/\./g)??[]).length>1)clean=clean.replace(/\./g,'');else if(clean.includes('.')&&(clean.split('.')[1]?.length??0)>2)clean=clean.replace('.','');const parsed=Number(clean);return Number.isFinite(parsed)&&parsed>=0?Math.round(parsed*100)/100:0}
const displayValue=(value:number|string,currency:Currency)=>{if(value==='')return '';const number=typeof value==='number'?value:Number(value);if(!Number.isFinite(number))return '';return new Intl.NumberFormat('es-AR',{minimumFractionDigits:currency==='USD'&&!Number.isInteger(number)?2:0,maximumFractionDigits:currency==='USD'?2:0}).format(number)}

interface Props { value:number|string; onChange:(amount:number)=>void; currency?:Currency; id?:string; required?:boolean; placeholder?:string; ariaLabel?:string }
export function MoneyInput({value,onChange,currency='ARS',id,required,placeholder='0',ariaLabel}:Props){const [display,setDisplay]=useState(()=>displayValue(value,currency));useEffect(()=>setDisplay(displayValue(value,currency)),[value,currency]);const update=(raw:string)=>{if(!raw.trim()){setDisplay('');onChange(0);return}const parsed=currency==='USD'?parseUSDInput(raw):parseARSInput(raw);setDisplay(displayValue(parsed,currency));onChange(parsed)};return <div className="money-input"><span>{currency==='USD'?'USD':'$'}</span><input id={id} aria-label={ariaLabel} inputMode={currency==='USD'?'decimal':'numeric'} type="text" autoComplete="off" value={display} required={required} placeholder={placeholder} onChange={e=>update(e.target.value)}/></div>}
export const AmountInput=MoneyInput
