import type { ProgressCharacter } from '../types/models'
import type { ProgressByCurrency } from '../financial-engine'
import { formatMoney } from '../utils/format'
import { ProgressTrack } from './ProgressTrack'

export function CurrencyProgressGroup({progress,character}:{progress:ProgressByCurrency;character:ProgressCharacter}){
  const ars=progress.ARS,usd=progress.USD,both=Boolean(ars&&usd)
  if(!ars&&!usd)return null
  return <section className="currency-progress-group" aria-label="Progreso de deudas por moneda">
    {ars&&<ProgressTrack title={both?'Progreso en pesos':'Progreso total'} percent={ars.progressPercent} character={character} paid={ars.amountPaid} remaining={ars.currentOutstanding} formatAmount={value=>formatMoney(value,'ARS')} summary={ars.progressRatio===1?(both?'Deudas en pesos de este plan terminadas.':'Deudas de este plan terminadas.'):(both?'Avance de todas tus deudas en pesos.':'Avance de todas tus deudas.')}/>}
    {usd&&<ProgressTrack title="Progreso en dólares" percent={usd.progressPercent} character={character} paid={usd.amountPaid} remaining={usd.currentOutstanding} formatAmount={value=>formatMoney(value,'USD')} summary={usd.progressRatio===1?'Deudas USD de este plan terminadas.':'Avance de todas tus deudas en dólares.'} compact={Boolean(ars)}/>}
  </section>
}
