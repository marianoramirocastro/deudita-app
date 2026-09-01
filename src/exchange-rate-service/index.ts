import { z } from 'zod'
import { db } from '../storage/db'
import type { ExchangeRate, ExchangeRateType } from '../types/models'

export const RATE_ENDPOINTS:Record<ExchangeRateType,string>={blue:'https://dolarapi.com/v1/dolares/blue',card:'https://dolarapi.com/v1/dolares/tarjeta'}
const responseSchema=z.object({compra:z.number().finite().positive(),venta:z.number().finite().positive(),fechaActualizacion:z.string().datetime()})
const sourceFor=(type:ExchangeRateType)=>type==='blue'?'DolarHoy' as const:'Ámbito Financiero' as const
export const parseRateResponse=(type:ExchangeRateType,data:unknown,now=new Date()):ExchangeRate=>{const parsed=responseSchema.parse(data);return{type,buy:parsed.compra,sell:parsed.venta,updatedAt:parsed.fechaActualizacion,fetchedAt:now.toISOString(),provider:'DolarAPI',source:sourceFor(type)}}
export const convertUSDToARS=(usd:number,rate:number)=>Number.isFinite(usd)&&Number.isFinite(rate)&&usd>=0&&rate>0?Math.round(usd*rate):0
export const isRateStale=(rate:ExchangeRate,now=Date.now(),thresholdMs=24*60*60*1000)=>now-new Date(rate.updatedAt).getTime()>thresholdMs
export const isCacheFresh=(rate:ExchangeRate,now=Date.now(),ttlMs=30*60*1000)=>now-new Date(rate.fetchedAt).getTime()<ttlMs
async function fetchOne(type:ExchangeRateType,fetcher:typeof fetch,timeoutMs:number){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetcher(RATE_ENDPOINTS[type],{signal:controller.signal,headers:{Accept:'application/json'}});if(!response.ok)throw new Error(`HTTP ${response.status}`);const rate=parseRateResponse(type,await response.json());await db.exchangeRates.put(rate);return rate}finally{clearTimeout(timer)}}
export async function refreshExchangeRates({fetcher=fetch,force=false,timeoutMs=5000}:{fetcher?:typeof fetch;force?:boolean;timeoutMs?:number}={}){const cached=await db.exchangeRates.toArray();const result:Partial<Record<ExchangeRateType,ExchangeRate>>=Object.fromEntries(cached.map(r=>[r.type,r]));const errors:ExchangeRateType[]=[];await Promise.all((['blue','card'] as ExchangeRateType[]).map(async type=>{const existing=result[type];if(!force&&existing&&isCacheFresh(existing))return;try{result[type]=await fetchOne(type,fetcher,timeoutMs)}catch{errors.push(type)}}));return{rates:result,errors}}
