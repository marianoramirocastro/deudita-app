import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { refreshExchangeRates } from '../exchange-rate-service'
import { db } from '../storage/db'
type RefreshResult=Awaited<ReturnType<typeof refreshExchangeRates>>
let initialRefresh:Promise<RefreshResult>|null=null
export function useExchangeRates(enabled=true){const rates=useLiveQuery(()=>db.exchangeRates.toArray(),[])??[],[error,setError]=useState(false),[refreshing,setRefreshing]=useState(false);const refresh=async(force=true)=>{setRefreshing(true);const result=await refreshExchangeRates({force});setError(result.errors.length>0);setRefreshing(false)};useEffect(()=>{if(!enabled)return;if(!initialRefresh)initialRefresh=refreshExchangeRates();initialRefresh.then(result=>setError(result.errors.length>0)).catch(()=>setError(true))},[enabled]);return{rates:Object.fromEntries(rates.map(r=>[r.type,r])),error,refreshing,refresh}}
