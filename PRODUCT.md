# Decisiones de producto

## Promesa

Transformar una situación difusa en un próximo paso visible: cuánto se debe, qué vence, qué es obligatorio, cuánto queda disponible y qué alternativas existen. La app no promete “salvar” ni califica conductas.

## Prioridades del MVP

1. Datos locales y recuperables.
2. Matemática transparente y segura.
3. Onboarding breve con guardado automático.
4. Dashboard que responde las seis preguntas centrales.
5. Comparación neutral de estrategias.
6. Registro de pagos y progreso verificable.
7. Crisis mensual sin recomendaciones peligrosas.
8. Herramientas conductuales sin culpa.
9. Entrada Simple o Completa sin bases de datos separadas.
10. Deudas ARS/USD sin sumar monedas de forma implícita.

## Decisiones importantes

- `max(pago mínimo, cuota pactada)` representa la obligación mensual reservada. Evita sumar dos valores que a menudo describen la misma obligación.
- Los gastos modificables no se descuentan automáticamente del dinero adicional: se muestran separados porque el usuario conserva la decisión. Los esenciales sí se reservan.
- Una tasa ausente equivale a 0 solo para estimar un plazo operativo; el resultado queda marcado como aproximado y no se informa interés total inventado.
- El modo demo es una vista aislada con datos ficticios y no escribe en IndexedDB.
- Los snapshots son explícitos (“Cerrar este mes”) para no crear históricos sin que la persona entienda el momento medido.
- La información regulatoria vive en una estructura de contenido con fuente externa, no dentro del motor.
- En carteras mixtas, el progreso usa la referencia ARS fijada al alta; si no existe, promedia el avance relativo de cada deuda y lo explica. La cotización diaria nunca reescribe el avance histórico.
- Las cotizaciones blue y tarjeta se usan como referencia explícita, con fecha, atribución, caché offline y posibilidad manual. No son una promesa de precio.

## Corrección P0 de progreso y modos

Antes de esta iteración, `useFinance` llamaba a una función de progreso basada solo en saldos, mientras Dashboard, Simple y Evolución elegían ramas y formatos propios según la moneda. En ARS la suma era correcta, pero no existía un contrato único que obligara a todas las interfaces a usar la cartera completa; la presentación mixta podía parecer el avance de un subconjunto.

La fuente única ahora es `calculatePortfolioProgress(debts, payments)`. Para una moneda calcula `sum(initialBalance)` contra `sum(balance)`. En una cartera ARS/USD pondera cada deuda con su conversión inicial bloqueada; si falta esa referencia, usa el promedio del avance relativo y lo identifica como aproximado. Ninguna pantalla vuelve a calcular el porcentaje.

El conflicto de modos no provenía de bases separadas: Simple y Completo siempre compartieron IndexedDB. La interferencia estaba en la navegación Simple → Completo, que volvía a abrir el onboarding sobre una cartera existente y permitía recargar datos equivalentes. Cambiar de modo ahora modifica únicamente `experienceMode` y navega a la interfaz correspondiente; deudas, saldos, pagos e historial no se tocan.

## Copy y crisis

Las frases se apoyan en datos reales. Si no hubo pagos, no se afirma que hubo progreso. Con déficit se reemplaza la narrativa de avance por obligaciones próximas, faltante y alternativas generales; nunca se sugiere incumplir deliberadamente.

## Después de validar uso real

- Cifrado opcional de backups.
- Motor de fechas/pagos diarios configurable por contrato.
- Recordatorio mensual local con permisos explícitos.
- Módulo beta de habilidades e ingresos extra, sin ofertas engañosas.
- Tests E2E con Playwright en Android/iOS emulados.
- Revisión profesional de accesibilidad y contenido jurídico/crediticio.
