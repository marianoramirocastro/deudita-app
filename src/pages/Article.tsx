import { Link,useParams } from 'react-router-dom'
import { AppFooter } from '../components/AppFooter'
import { BRAND } from '../config/brand'
import { articles } from '../content/articles'

export function Article(){const {slug}=useParams(),article=articles.find(item=>item.slug===slug);if(!article)return <PublicPage title="No encontramos esta página"><p>Puede que el enlace haya cambiado.</p></PublicPage>;return <PublicPage title={article.title}><p className="article-summary">{article.summary}</p>{article.body.map((block,index)=><section key={index}>{block.heading&&<h2>{block.heading}</h2>}<p>{block.paragraph}</p></section>)}{article.source&&<p className="source-link">Fuente oficial: <a href={article.source.url} target="_blank" rel="noreferrer">{article.source.label}</a></p>}<div className="disclaimer">Los contenidos son educativos y pueden quedar desactualizados. Verificá condiciones y fuentes oficiales antes de tomar decisiones importantes.</div></PublicPage>}
export function PublicPage({title,children}:{title:string;children:React.ReactNode}){return <div className="public-page"><header><Link to="/" className="brand"><span className="brand-mark">↗</span>{BRAND.name}</Link><Link to="/entender">Entender conceptos</Link></header><main><Link className="back-link" to="/entender">← Volver</Link><h1>{title}</h1>{children}</main><AppFooter publicLayout/></div>}
