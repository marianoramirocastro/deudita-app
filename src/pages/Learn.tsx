import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { articles } from '../content/articles'
export function Learn(){return <Page title="Entender conceptos" eyebrow="Educación financiera"><p className="support-line">Conceptos de deuda explicados de forma simple. Podés usar la aplicación sin leerlos.</p><div className="article-grid">{articles.map(a=><Link className="article-card" to={`/${a.slug}`} key={a.slug}><span>4 min</span><h2>{a.title}</h2><p>{a.summary}</p><strong>Leer →</strong></Link>)}</div><div className="disclaimer">Esta información es educativa y general. No reemplaza asesoramiento financiero, jurídico, contable ni crediticio.</div></Page>}
