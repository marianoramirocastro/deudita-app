export interface Reflection {id:string;author:string;text:string;source?:string;type:'quote'|'paraphrase';contextTags:string[];interpretation?:string}
export const reflections:Reflection[]=[
  {id:'ortega-circunstancia',author:'José Ortega y Gasset',text:'Yo soy yo y mi circunstancia, y si no la salvo a ella no me salvo yo.',source:'Meditaciones del Quijote (1914)',type:'quote',contextTags:['plan','onboarding'],interpretation:'Tu plan tiene que servir para tu circunstancia, no para la de otra persona.'},
  {id:'descartes-partes',author:'René Descartes',text:'Dividir una dificultad en tantas partes como haga falta para resolverla mejor.',source:'Idea de la segunda regla del Discurso del método (1637); paráfrasis del producto',type:'paraphrase',contextTags:['plan','deficit'],interpretation:'Con la deuda hacemos algo parecido: buscamos la próxima parte, no resolver todo hoy.'},
  {id:'furor-sanandi',author:'DeudARG',text:'El apuro por arreglarlo todo hoy también puede jugar en contra.',source:'Copy propio, inspirado en la idea psicoanalítica del furor sanandi',type:'paraphrase',contextTags:['support','deficit']},
  {id:'micro',author:'DeudARG',text:'Un poco también mueve la barra.',type:'paraphrase',contextTags:['progress','plan']}
]
export function reflectionForDate(date=new Date()){const key=Number(`${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`);return reflections[key%reflections.length]}
