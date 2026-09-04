# QA P0 — progreso separado ARS / USD

Fecha: 2026-09-04.

## Matriz de los 10 casos solicitados

1. **Solo ARS — correcto.** Se calcula una sola cartera ARS y el DOM contiene únicamente `Progreso total`, sin etiqueta, card ni espacio reservado para USD.
2. **Solo USD — correcto.** El DOM contiene una única barra principal `Progreso en dólares`; no se crea una barra ARS vacía ni se aplica el estilo secundario compacto.
3. **ARS + USD — correcto.** Se muestran dos barras apiladas. El escenario crítico conserva ARS 25% y USD 50% con montos rotulados en su moneda.
4. **Pagar solo ARS — correcto.** Un pago ARS lleva el caso de 25% a 35% y USD permanece exactamente en 50%.
5. **Pagar solo USD — correcto.** El pago posterior lleva USD de 50% a 60% y ARS permanece exactamente en 35%.
6. **Cambiar cotización cinco veces — correcto.** Con referencias 1.000, 5.000, 500, 2.199,99 y 1, los resultados continúan en ARS 25% y USD 50%.
7. **Cerrar toda deuda USD — correcto.** El resultado es exactamente 100%, la deuda histórica sigue dentro del denominador y la barra permanece visible con el mensaje de plan USD terminado.
8. **Cerrar toda deuda ARS — correcto.** El resultado es exactamente 100% y la barra histórica ARS permanece visible.
9. **Cerrar todo — correcto.** ARS y USD quedan en 100% simultáneamente, sin `NaN`; el DOM mantiene ambas barras.
10. **Alternar Simple/Completo — correcto.** Ambos modos consumen `progressByCurrency` y el mismo componente. La regresión que alterna modos durante una secuencia de pagos termina exactamente en 100% sin cambiar de fuente de datos.

## Evolución y compatibilidad

- Los cierres nuevos guardan `debtTotalARS` y `debtTotalUSD` por separado, sin cotizaciones.
- Cada gráfico usa solamente la serie de su moneda.
- Los snapshots históricos sin desglose siguen en IndexedDB y backups, pero no se grafican para evitar una mezcla engañosa.
- IndexedDB permanece en versión 4 y el formato de backup permanece en versión 3, compatible con importaciones v1/v2/v3.
- `conversionRate` e `initialConvertedBalanceARS` se conservan para las funciones orientativas existentes; el progreso no los lee.

## Alcance de la comprobación

Los diez casos quedaron cubiertos mediante escenarios determinísticos y render del DOM, además de revisión de la composición vertical y estilos responsive. Se intentó la pasada visual manual en la aplicación local, pero la conexión de automatización con el navegador no pudo iniciarse en esta sesión. La limitación queda explícita: no se presenta esa inspección visual como ejecutada. Lint, build y `git diff --check` se registran en la validación final del commit.
