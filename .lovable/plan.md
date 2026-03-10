

## Línea de tiempo para alojamiento alternativo

Con los datos actuales, una línea de tiempo tiene bastante sentido: todos los registros tienen `check_in` y `check_out`, así que se pueden representar como barras horizontales por invitado sobre un eje de fechas (9, 10, 11, 12 oct).

### Propuesta

Añadir una vista visual tipo "timeline/Gantt" encima o como alternativa a la tabla actual en la pestaña de Alojamiento:

- **Eje horizontal**: días (9 oct → 12 oct), calculados dinámicamente del rango min/max de los datos
- **Eje vertical**: cada fila = un invitado (nombre + nº personas)
- **Barras horizontales**: coloreadas, mostrando la estancia de cada invitado
- **Resumen por noche**: debajo del timeline, un mini-resumen "Noche del 9: X personas / Noche del 10: Y personas / Noche del 11: Z personas"
- Se mantiene la tabla actual debajo (con la funcionalidad de borrar y totales)
- Implementado con divs + Tailwind, sin dependencias extra

### Cambios

Solo en `src/pages/Admin.tsx`: añadir el componente visual de timeline dentro de la pestaña de Alojamiento, antes de la tabla existente.

