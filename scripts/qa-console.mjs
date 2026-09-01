const endpoint = process.argv[2] ?? 'http://127.0.0.1:9222/json/list'
const targetUrl = process.argv[3] ?? 'http://127.0.0.1:4173/'
const targets = await fetch(endpoint).then(response => response.json())
const target = targets.find(item => item.type === 'page' && item.url.includes('127.0.0.1:4173')) ?? targets.find(item => item.type === 'page')
if (!target) throw new Error('No hay una página disponible para inspeccionar')
const socket = new WebSocket(target.webSocketDebuggerUrl)
let sequence = 0
const send = (method, params = {}) => socket.send(JSON.stringify({ id: ++sequence, method, params }))
socket.addEventListener('open', () => {
  send('Runtime.enable')
  send('Console.enable')
  send('Page.enable')
  send('Page.navigate', { url: targetUrl })
})
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.id && message.result?.result?.value) console.log('EVAL', message.result.result.value)
  if (message.method === 'Runtime.exceptionThrown') console.log('EXCEPTION', JSON.stringify(message.params.exceptionDetails, null, 2))
  if (message.method === 'Runtime.consoleAPICalled') console.log('CONSOLE', message.params.type, message.params.args.map(arg => arg.value ?? arg.description).join(' '))
})
await new Promise(resolve => setTimeout(resolve, 5000))
send('Runtime.evaluate', { expression: `JSON.stringify({html:document.body.innerHTML.slice(0,500),title:document.title,body:getComputedStyle(document.body).cssText,root:document.querySelector('#root')?.getBoundingClientRect().toJSON(),nav:document.querySelector('.landing-nav')?.getBoundingClientRect().toJSON(),navDisplay:document.querySelector('.landing-nav')&&getComputedStyle(document.querySelector('.landing-nav')).display,styles:[...document.styleSheets].map(s=>s.href)})`, returnByValue: true })
await new Promise(resolve => setTimeout(resolve, 1000))
socket.close()
