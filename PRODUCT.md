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

## Decisiones importantes

- `max(pago mínimo, cuota pactada)` representa la obligación mensual reservada. Evita sumar dos valores que a menudo describen la misma obligación.
- Los gastos modificables no se descuentan automáticamente del dinero adicional: se muestran separados porque el usuario conserva la decisión. Los esenciales sí se reservan.
- Una tasa ausente equivale a 0 solo para estimar un plazo operativo; el resultado queda marcado como aproximado y no se informa interés total inventado.
- El modo demo es una vista aislada con datos ficticios y no escribe en IndexedDB.
- Los snapshots son explícitos (“Cerrar este mes”) para no crear históricos sin que la persona entienda el momento medido.
- La información regulatoria vive en una estructura de contenido con fuente externa, no dentro del motor.

## Copy y crisis

Las frases se apoyan en datos reales. Si no hubo pagos, no se afirma que hubo progreso. Con déficit se reemplaza la narrativa de avance por obligaciones próximas, faltante y alternativas generales; nunca se sugiere incumplir deliberadamente.

## Después de validar uso real

- Cifrado opcional de backups.
- Motor de fechas/pagos diarios configurable por contrato.
- Recordatorio mensual local con permisos explícitos.
- Módulo beta de habilidades e ingresos extra, sin ofertas engañosas.
- Tests E2E con Playwright en Android/iOS emulados.
- Revisión profesional de accesibilidad y contenido jurídico/crediticio.
