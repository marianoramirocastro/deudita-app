import { describe,expect,it } from 'vitest'
import { NAV_ITEMS } from '../config/navigation'
describe('navegación principal',()=>{it('respeta el orden deliberado en desktop y móvil',()=>expect(NAV_ITEMS.map(item=>item.label)).toEqual(['Hoy','Deudas','Gastos','Evolución','Entender','Simular','Más']))})
