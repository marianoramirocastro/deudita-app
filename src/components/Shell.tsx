import { useLiveQuery } from 'dexie-react-hooks'
import { NavLink, Outlet } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { NAV_ITEMS } from '../config/navigation'
import { db } from '../storage/db'
import { todayISO } from '../utils/format'
import { QuickHelp } from './QuickHelp'
import { AppFooter } from './AppFooter'
export function Shell(){return <div className="app-shell"><aside className="sidebar"><NavLink to="/plan" className="brand"><span className="brand-mark">↗</span><span>{BRAND.name}</span></NavLink><nav aria-label="Navegación principal">{NAV_ITEMS.map(({to,label,icon:Icon})=><NavLink key={to} to={to}><Icon size={20}/><span>{label}</span></NavLink>)}</nav><div className="sidebar-privacy">🔒 <strong>Tus números son tuyos.</strong><small>Tus deudas, ingresos y gastos se guardan en este dispositivo.</small></div></aside><main className="app-main"><MonthlyReview/><Outlet/><AppFooter/></main><QuickHelp/><nav className="bottom-nav" aria-label="Navegación móvil">{NAV_ITEMS.map(({to,label,icon:Icon})=><NavLink key={to} to={to}><Icon size={21}/><span>{label}</span></NavLink>)}</nav></div>}
function MonthlyReview(){const settings=useLiveQuery(()=>db.settings.get('main'),[]);if(!settings?.onboardingComplete)return null;const last=settings.lastMonthlyReview?new Date(`${settings.lastMonthlyReview}T12:00:00`).getTime():0;const due=Date.now()-last>=30*86400000;if(!due)return null;const reviewed=()=>db.settings.put({...settings,lastMonthlyReview:todayISO()});return <aside className="monthly-review"><div><strong>¿Seguimos usando los mismos números?</strong><span>En Argentina cambian rápido. Revisemos lo que realmente cambió para vos.</span></div><button className="button secondary small" onClick={reviewed}>Sigue igual</button><NavLink className="button primary small" to="/gastos" onClick={reviewed}>Actualizar algunos</NavLink></aside>}
