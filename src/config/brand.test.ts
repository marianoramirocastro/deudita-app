import { describe,expect,it } from 'vitest'
import { BRAND,EXTERNAL_LINKS,PWA_META } from './brand'
import { DB_NAME } from '../storage/db'

describe('identidad pública y compatibilidad',()=>{
  it('centraliza la marca y el lema de DeudARG',()=>{
    expect(BRAND.name).toBe('DeudARG')
    expect(BRAND.description).toBe('Organizá tus deudas. Una cosa por vez.')
    expect(PWA_META).toEqual({name:'DeudARG',short_name:'DeudARG',description:BRAND.description})
  })

  it('conserva la base histórica para no perder datos existentes',()=>{
    expect(DB_NAME).toBe('proyecto-salida')
  })

  it('configura el único enlace de apoyo sin inventar feedback',()=>{
    expect(EXTERNAL_LINKS.cafecito).toBe('https://cafecito.app/hmil')
    expect(EXTERNAL_LINKS.feedbackUrl).toBeUndefined()
  })
})
