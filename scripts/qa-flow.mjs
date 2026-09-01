const debugPort=process.argv[2]??'9222'
const resume=process.argv[3]==='resume'
const targets=await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r=>r.json())
const target=targets.find(item=>item.type==='page'&&item.url.includes('127.0.0.1:4173'))
if(!target)throw new Error('No se encontró la app abierta')
const socket=new WebSocket(target.webSocketDebuggerUrl);let seq=0;const pending=new Map()
socket.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result)}})
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})})
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))})
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value}
const wait=ms=>new Promise(r=>setTimeout(r,ms));const navigate=async path=>{await send('Page.navigate',{url:`http://127.0.0.1:4173${path}`});await wait(1800)}
const click=async text=>{const ok=await evaluate(`(()=>{const e=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().includes(${JSON.stringify(text)}));if(!e)return false;e.click();return true})()`);if(!ok)throw new Error(`No se encontró: ${text}`);await wait(350)}
const setInput=async(selector,index,value)=>{const ok=await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!e)return false;const proto=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,${JSON.stringify(String(value))});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);if(!ok)throw new Error(`No se encontró input ${selector}[${index}]`);await wait(200)}
if(!resume){await navigate('/empezar')
console.log('QA start',await evaluate(`JSON.stringify({url:location.href,root:document.querySelector('#root')?.innerHTML.slice(0,120),inputs:document.querySelectorAll('.money-input input').length})`))
await setInput('.money-input input',0,800000);await click('Continuar');await setInput('.money-input input',0,400000);await click('Continuar');await setInput('.money-input input',0,30000);await click('Continuar');await click('Agregar mi primera deuda');await setInput('.debt-onboard>input',0,'Visa');await setInput('.debt-onboard .money-input input',0,450000);await setInput('.debt-onboard .money-input input',1,90000);await click('Continuar');await click('5');await click('Continuar');await click('Comparar estrategias')
if(!String(await evaluate('document.querySelector("h1")?.textContent')).includes('Comparar'))throw new Error('No llegó al simulador')
await click('Elegir');await navigate('/plan');if(!String(await evaluate('document.body.innerText')).includes('450.000'))throw new Error('El saldo no llegó al dashboard')
await click('+ Registrar pago');await setInput('.modal .money-input input',0,50000);await click('Guardar pago');if(!String(await evaluate('document.body.innerText')).includes('400.000'))throw new Error('El pago no actualizó el saldo')}
if(resume){await navigate('/plan');console.log('QA resume',await evaluate(`JSON.stringify({url:location.href,text:document.body.innerText.slice(0,500)})`))}await click('Estoy por gastar en una boludez');await setInput('.modal .money-input input',0,28000);await click('Lo compro igual');await click('Volver al plan')
await navigate('/herramientas');if(!String(await evaluate('document.body.innerText')).includes('¿Cuánto es realmente esta plata?'))throw new Error('No abrió herramientas')
await navigate('/mas');if(!String(await evaluate('document.body.innerText')).includes('Exportar mis datos'))throw new Error('No abrió backup')
await send('Page.reload',{ignoreCache:true});await wait(700);await navigate('/plan');if(!String(await evaluate('document.body.innerText')).includes('400.000'))throw new Error('Los datos no persistieron al recargar')
console.log('QA FLOW OK: onboarding → deuda → estrategia → dashboard → pago → impulso → herramientas → backup → reload')
socket.close()
