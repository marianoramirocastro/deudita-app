# Proyecto Salida

MVP web/PWA argentino para ordenar deudas con claridad, privacidad local y acompañamiento sin juicio. No tiene backend, cuentas, conexión bancaria, analytics ni API paga.

## Requisitos y comandos

- Node.js 20 o superior
- `npm install`
- `npm run dev` — entorno local
- `npm test` — tests determinísticos
- `npm run lint` — análisis estático
- `npm run build` — TypeScript + build de producción
- `npm run preview` — probar el build

## Arquitectura

- React + TypeScript + Vite.
- React Router para navegación pública y privada/local.
- Dexie sobre IndexedDB para persistencia exclusivamente en el navegador.
- Zod para validar backups antes de importarlos.
- `src/financial-engine/` contiene todas las funciones matemáticas puras.
- Vitest cubre presupuesto, déficit, mínimos, estrategias, interés cero, tasas ausentes, saldos pagados, magnitudes grandes y redondeo seguro.
- `vite-plugin-pwa` genera el service worker y manifiesto instalable.

```
src/
  components/          UI reutilizable
  config/              branding centralizado
  content/             artículos y fuentes actualizables
  financial-engine/    cálculos puros y tests
  hooks/               consultas reactivas
  pages/               pantallas y contenidos públicos
  storage/             IndexedDB, schema y backups
  types/               modelo de dominio
  utils/               ARS, fechas es-AR e IDs
```

## Datos y privacidad

Ingresos, gastos, deudas, pagos, prioridades, snapshots, objetivos y preferencias viven en la base IndexedDB `proyecto-salida`, versión 1. No se envían desde la app. Un archivo de backup JSON sí contiene información sensible y actualmente no está cifrado; debe guardarse de forma segura. Borrar datos del navegador puede borrar el plan.

Ver [PRIVACY.md](./PRIVACY.md) para el inventario detallado.

## Motor financiero

El orden es invariable: ingresos menos gastos esenciales menos el mayor valor entre pago mínimo y cuota pactada de cada deuda. Solo el remanente no negativo se usa como pago adicional. Si existe déficit, la UI entra en modo de crisis y no propone sacrificar mínimos.

Las proyecciones son mensuales y soportan avalancha, bola de nieve, prioridad personal y orden manual. Cuando falta alguna TNA, el cronograma puede aproximar plazo con tasa cero para esa deuda, pero oculta el total de intereses y marca explícitamente que faltan datos. El CFT se conserva como dato informativo; no se mezcla con TNA en la fórmula.

## Deploy gratis en Cloudflare Pages

1. Subir el repositorio a GitHub o GitLab.
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Elegir el repositorio.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Node version: 20 o superior.
8. Desplegar. `public/_redirects` permite abrir rutas internas directamente.

No configurar variables de entorno. En Vercel: importar el repositorio, elegir Vite y conservar `npm run build` / `dist`.

## Limitaciones actuales

- Las proyecciones usan períodos mensuales; no modelan capitalización diaria, impuestos específicos, cambios futuros de tasa ni reglas contractuales particulares.
- El CFT no se usa como tasa de capitalización porque puede incluir componentes que no deben capitalizarse.
- El backup JSON no está cifrado.
- El contenido regulatorio es educativo y enlaza al BCRA; debe revisarse periódicamente.
- No hay sincronización entre dispositivos.
- La sección beta de generación de ingresos extra no forma parte de este corte para mantener seguro el núcleo.
- La PWA puede cachear la interfaz, pero el comportamiento offline final depende de la primera visita y de las políticas del navegador, especialmente en iOS.

## QA manual sugerido

Usar una ventana normal (IndexedDB no siempre persiste en modo privado): completar onboarding, cerrar y recargar, comparar estrategias, registrar un pago, verificar progreso, guardar snapshot, probar compra impulsiva y recorte, exportar, borrar, importar y recargar otra vez. Repetir en Android Chrome e iOS Safari.
