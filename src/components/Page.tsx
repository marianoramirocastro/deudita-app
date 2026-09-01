import type { ReactNode } from 'react'
export function Page({title,eyebrow,action,children}:{title:string;eyebrow?:string;action?:ReactNode;children:ReactNode}){return <div className="page"><header className="page-header">{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<div><h1>{title}</h1>{action}</div></header>{children}</div>}
