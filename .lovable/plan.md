

## Plan: Mostrar total real de personas (incluyendo parejas y niños)

### Cambio

En `src/pages/Admin.tsx`, modificar el cálculo de `metrics.total` para que sume:
- **1** por cada invitado
- **+1** si `plus_one === true`
- **+ `children_count`** si tiene valor

Actualizar la línea 217 de:
```ts
total: realGuests.length,
```
a:
```ts
total: realGuests.reduce((sum, g) => sum + 1 + (g.plus_one ? 1 : 0) + (g.children_count ?? 0), 0),
```

También actualizar el KPI de "Confirmados" (línea 218) con la misma lógica, pero solo para los que tienen `rsvp_status === true`.

Opcionalmente, añadir un segundo indicador que muestre "X registros" vs "Y personas" para mayor claridad.

### Detalle de implementación

- Cambiar `metrics.total` para sumar personas reales
- Cambiar `metrics.confirmed` para sumar personas confirmadas reales
- Añadir label "(personas)" bajo el total para que quede claro

