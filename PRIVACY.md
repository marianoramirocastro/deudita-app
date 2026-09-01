# Modelo de privacidad

## Datos financieros locales

La base IndexedDB `proyecto-salida` contiene:

- ingresos: etiqueta, tipo y monto;
- gastos: etiqueta, grupo y monto;
- deudas: nombre, tipo, saldo, saldo inicial, mínimos/cuotas, tasas opcionales, vencimiento, acreedor, notas y prioridad;
- pagos: deuda, monto, fecha y nota opcional;
- snapshots mensuales: totales de ingreso, gastos y deuda;
- objetivos de reducción;
- preferencias de estrategia, progreso, comodidad y movimiento;
- versión de schema y fechas técnicas locales.

No existen campos de nombre real, DNI, CUIL/CUIT, email, teléfono, domicilio o cuenta bancaria.

## Tráfico de red

La aplicación consulta exclusivamente estos endpoints públicos de DolarAPI para mostrar referencias de dólar blue y dólar tarjeta:

- `https://dolarapi.com/v1/dolares/blue`
- `https://dolarapi.com/v1/dolares/tarjeta`

Esas solicitudes no incluyen saldos, nombres de deudas, pagos ni otros datos financieros. Las respuestas se cachean localmente para que la referencia siga visible sin conexión y se rotulan con fecha, proveedor y fuente informada. La aplicación no implementa backend financiero, analytics, cuentas, sincronización ni IA.

El navegador también descarga los archivos estáticos desde el hosting. Tanto el proveedor de hosting como el servicio de cotizaciones pueden conservar logs técnicos normales (por ejemplo IP, user-agent, hora y recurso solicitado) según sus políticas.

## Exportación e importación

La exportación crea un JSON legible sin cifrado. La descarga ocurre mediante APIs del navegador. Importar valida schema, versiones, tipos y montos no negativos antes de reemplazar la base dentro de una transacción. La UI exige confirmación de reemplazo.

## Borrado

“Borrar todos mis datos” exige abrir una acción destructiva y escribir `BORRAR`. Limpia tablas financieras, historial y preferencias; luego recrea preferencias vacías. Un backup descargado fuera del navegador no puede ser eliminado por la aplicación.

## Riesgos

- Alguien con acceso al perfil del navegador o al backup puede ver la información.
- El modo privado puede descartar IndexedDB.
- Limpiar datos del sitio o perder el dispositivo elimina el plan si no hay backup.
- No hay cifrado local adicional ni bloqueo con PIN.
