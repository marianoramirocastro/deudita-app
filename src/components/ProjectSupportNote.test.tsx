import { render,screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe,expect,it } from 'vitest'
import { ProjectSupportNote } from './ProjectSupportNote'

describe('apoyo discreto',()=>{
  it('prioriza compartir y ofrece accesos secundarios',()=>{
    render(<MemoryRouter><ProjectSupportNote/></MemoryRouter>)
    expect(screen.getByText(/Compartirla con alguien/)).toBeInTheDocument()
    expect(screen.getByRole('link',{name:'Sobre el proyecto'})).toHaveAttribute('href','/sobre-el-proyecto')
    expect(screen.getByRole('link',{name:/Cafecito/})).toHaveAttribute('href','https://cafecito.app/hmil')
  })
})
