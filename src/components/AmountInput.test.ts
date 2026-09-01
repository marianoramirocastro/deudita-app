import { describe,expect,it } from 'vitest'
import { parseARSInput,parseUSDInput } from './AmountInput'
describe('MoneyInput',()=>{it.each([['700000',700000],['700.000',700000],['$700.000',700000],['1.250.000',1250000]])('parsea ARS %s', (raw,expected)=>expect(parseARSInput(raw)).toBe(expected));it.each([['50',50],['49,99',49.99],['1.250,50',1250.5],['49.99',49.99]])('parsea USD %s',(raw,expected)=>expect(parseUSDInput(raw)).toBe(expected));it('vacío vale cero',()=>expect(parseARSInput('')).toBe(0))})
