import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { ensureDB } from './storage/db'
import './styles.css'
registerSW({immediate:true})
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>)
ensureDB().catch(error=>console.error('No pudimos inicializar el guardado local. Tus datos anteriores siguen intactos.',error))
