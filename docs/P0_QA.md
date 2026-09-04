# QA P0 — motor financiero y UX

Fecha: 2026-09-04.

## Carteras verificadas

1. Una deuda de $200.000, sin interés, con $300.000 disponibles: `projected`, 1 mes.
2. Una deuda de $1.000.000, sin interés, con $200.000 disponibles: `projected`, 5 meses.
3. Una deuda de $100.000.000 con $100 mensuales: `extreme_duration`, aproximadamente 1.000.000 de meses, sin construir una fecha.
4. Ingreso $500.000, esenciales $450.000 y compromiso $100.000: déficit $50.000, `no_capacity`, sin meses.
5. Disponible adicional cero y mínimo contractual $100.000 sobre $500.000: `projected`, 5 meses por el cronograma contractual.
6. Visa $1.000.000, Master $300.000 y deuda informal $200.000: cierre mensual explícito y saldos finales exactamente cero.
7. Dos deudas con mínimos de $50: al cerrar la de $100, el mínimo liberado pasa a la siguiente; total 11 meses.
8. Bola de nieve con saldos $100 y $500: termina primero la de $100.
9. Avalancha con tasas 10% y 80%: prioriza la deuda de 80% aunque su saldo sea mayor.
10. Préstamo de $960.000, cuota $80.000, 12 cuotas y sin cancelación anticipada: reconoce 12 períodos.
11. Tasa desconocida: proyección de capital marcada como básica, con intereses `null`.
12. USD 49,99 menos USD 9,99: saldo USD 40,00 sin residuo visible.
13. Valores $999.999.999 y $10.000.000.000: resultados finitos, sin `NaN` ni `Infinity`.

## Perfiles de uso revisados

- Usuario A: seguimiento Simple, una tarjeta, ARS predeterminado y registro directo de pago.
- Usuario B: plan Completo, tres tarjetas y préstamo, sin necesidad de conocer TNA/CFT.
- Usuario C: saldo, cuota y ventana aproximada; puede omitir fecha exacta y tasas.
- Usuario D: puede desplegar detalles y cargar fecha exacta, tasas, cuotas, acreedor, prioridad y posibilidad de adelantar.

## Comprobaciones de interfaz

- Navegación en el orden Hoy, Deudas, Gastos, Evolución, Entender, Simular y Más.
- Hoy responde primero progreso, saldo, próximo compromiso y disponible; Registrar pago conserva la acción principal.
- ARS/USD y vencimiento usan controles segmentados con `aria-pressed` y foco de teclado.
- Las ventanas muestran Principio, Mitad o Fin de mes; no generan fechas falsas.
- La fecha exacta y los datos avanzados están dentro de Más detalles.
- Cafecito sólo se renderiza en Sobre el proyecto.

La conexión de automatización visual al navegador local no estuvo disponible en esta sesión. La verificación funcional se realizó con render, compilación, búsquedas de consumidores y las suites determinísticas anteriores; queda explícita esta limitación para no presentar como manual una inspección visual que no pudo ejecutarse.
