import { Link } from 'react-router-dom'
import { BRAND,EXTERNAL_LINKS } from '../config/brand'

export function ProjectSupportNote(){return <aside className="project-support-note"><div><strong>¿Te sirvió {BRAND.name}?</strong><span>Compartirla con alguien que la necesite o mandar feedback ya ayuda muchísimo.</span></div><nav><Link to="/sobre-el-proyecto">Sobre el proyecto</Link><a href={EXTERNAL_LINKS.cafecito} target="_blank" rel="noopener noreferrer" aria-label="Invitar un Cafecito a Mil; abre en una pestaña nueva">☕ Cafecito</a></nav></aside>}
