import { fireEvent,render,screen,waitFor } from '@testing-library/react'
import { beforeEach,describe,expect,it,vi } from 'vitest'
import { useFinance } from '../hooks/useFinance'
import { db } from '../storage/db'
import { Progress } from './Progress'

vi.mock('../hooks/useFinance',()=>({useFinance:vi.fn()}))
vi.mock('../storage/db',()=>({db:{snapshots:{put:vi.fn()}}}))

const currencyProgress=(currency:'ARS'|'USD',initialTotal:number,currentOutstanding:number)=>({currency,initialTotal,currentOutstanding,amountPaid:initialTotal-currentOutstanding,progressRatio:(initialTotal-currentOutstanding)/initialTotal,progressPercent:(initialTotal-currentOutstanding)/initialTotal*100,activeDebtCount:1})
const base={debts:[],payments:[],snapshots:[],budget:{income:1000,essential:100,adjustable:100},progressByCurrency:{}}
const finance=(overrides:Record<string,unknown>={})=>vi.mocked(useFinance).mockReturnValue({...base,...overrides} as unknown as ReturnType<typeof useFinance>)

describe('Evolución por moneda',()=>{
  beforeEach(()=>{vi.clearAllMocks()})

  it('grafica ARS y USD como series separadas',()=>{finance({progressByCurrency:{ARS:currencyProgress('ARS',1000,750),USD:currencyProgress('USD',100,50)},snapshots:[{id:'m',date:'2026-08-31',incomeTotal:0,essentialTotal:0,adjustableTotal:0,debtTotal:800,debtTotalARS:800,debtTotalUSD:60}]});render(<Progress/>);expect(screen.getByRole('img',{name:'Gráfico de evolución en pesos'})).toBeInTheDocument();expect(screen.getByRole('img',{name:'Gráfico de evolución en dólares'})).toBeInTheDocument();expect(screen.getByText('$800')).toBeInTheDocument();expect(screen.getByText('USD 60')).toBeInTheDocument()})

  it('conserva pero no grafica un snapshot legado sin moneda',()=>{finance({snapshots:[{id:'legacy',date:'2026-07-31',incomeTotal:0,essentialTotal:0,adjustableTotal:0,debtTotal:1234}]});render(<Progress/>);expect(screen.getByText(/cierre anterior sin desglose por moneda/)).toBeInTheDocument();expect(screen.queryByRole('img')).not.toBeInTheDocument()})

  it('al cerrar el mes guarda saldos ARS y USD sin conversión',async()=>{finance({progressByCurrency:{ARS:currencyProgress('ARS',1000,750),USD:currencyProgress('USD',100,50)}});render(<Progress/>);fireEvent.click(screen.getByRole('button',{name:'Cerrar este mes'}));await waitFor(()=>expect(db.snapshots.put).toHaveBeenCalledWith(expect.objectContaining({debtTotal:750,debtTotalARS:750,debtTotalUSD:50})))})
})
