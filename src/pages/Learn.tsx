import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { articles } from '../content/articles'
export function Learn(){return <Page title="Entender sin vueltas" eyebrow="Educación financiera"><p className="support-line">Textos cortos para saber qué estás mirando. Sin examen y sin palabras de banco.</p><div className="article-grid">{articles.map(a=><Link className="article-card" to={`/${a.slug}`} key={a.slug}><span>4 min</span><h2>{a.title}</h2><p>{a.summary}</p><strong>Leer →</strong></Link>)}</div><div className="disclaimer">Esta información es educativa y general. No reemplaza asesoramiento financiero, jurídico, contable ni crediticio.</div></Page>}
