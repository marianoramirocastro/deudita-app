import { Link } from 'react-router-dom'
import { BRAND } from '../config/brand'

export function AppFooter({publicLayout=false}:{publicLayout?:boolean}){return <footer className={`app-footer ${publicLayout?'public-footer':''}`}><div><strong>© {new Date().getFullYear()} {BRAND.name}</strong><span>Hecho en Argentina. Herramienta independiente de organización financiera.</span></div><nav aria-label="Información del proyecto"><Link to="/privacidad">Privacidad</Link><Link to="/como-funciona">Cómo funciona</Link><Link to="/sobre-el-proyecto">Sobre el proyecto</Link></nav><small className="independence-disclosure">{BRAND.name} no está afiliado al BCRA, bancos, entidades financieras, Veraz, DolarAPI ni proveedores de cotizaciones.</small></footer>}
