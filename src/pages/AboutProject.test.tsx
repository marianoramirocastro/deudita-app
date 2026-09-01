import { render,screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe,expect,it } from 'vitest'
import { AboutProject } from './AboutProject'

describe('Sobre el proyecto',()=>{
  it('explica la autoría, Codex y el origen determinístico de los cálculos',()=>{
    render(<MemoryRouter><AboutProject/></MemoryRouter>)
    expect(screen.getByText('Sobre este proyecto')).toBeInTheDocument()
    expect(screen.getByText(/Hola, soy Mil/)).toBeInTheDocument()
    expect(screen.getByText(/desarrollo fue realizado con ayuda de Codex/)).toBeInTheDocument()
    expect(screen.getByText(/funciones determinísticas y pruebas automatizadas/)).toBeInTheDocument()
  })

  it('abre Cafecito de forma segura y no muestra feedback sin URL',()=>{
    render(<MemoryRouter><AboutProject/></MemoryRouter>)
    const link=screen.getByRole('link',{name:/Invitarme un Cafecito/})
    expect(link).toHaveAttribute('href','https://cafecito.app/hmil')
    expect(link).toHaveAttribute('target','_blank')
    expect(link).toHaveAttribute('rel','noopener noreferrer')
    expect(screen.queryByRole('link',{name:'Enviar feedback'})).not.toBeInTheDocument()
  })
})
