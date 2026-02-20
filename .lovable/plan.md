

# Mejoras del formulario RSVP + Alerta de duplicados en Admin

## 1. Reordenar preguntas del formulario

El orden actual es: Preboda → Pareja → Niños → Alergias → Transporte.

El nuevo orden sera mas logico (primero quien viene, luego necesidades, luego eventos):

1. **Pareja** (quien viene contigo)
2. **Niños** (quien mas viene)
3. **Alergias** (necesidades de todos los asistentes)
4. **Preboda** (evento opcional)
5. **Transporte** (logistica)

## 2. Mejorar labels del formulario

- "Nombre de tu pareja" cambia a "Nombre y apellidos de tu pareja" (3 idiomas)
- El placeholder largo de alergias se convierte en un texto descriptivo bajo el label, con un placeholder corto tipo "Ej: celiaco, vegetariano..."

## 3. Alerta de duplicados en el panel de Admin

En vez de bloquear el envio por duplicado (lo cual podria confundir a invitados que necesitan corregir datos), se implementara una alerta visual en el panel de administracion:

- Al cargar los invitados, detectar emails que aparecen mas de una vez
- Mostrar un banner/alerta amarilla en la parte superior de la tabla: "Se han detectado X registros con emails duplicados"
- Resaltar visualmente las filas duplicadas con un fondo amarillo sutil
- Permitir gestion manual (el admin decide cual mantener/eliminar)

---

## Detalles tecnicos

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/wedding/RSVPSection.tsx` | Reordenar bloques JSX (mover Preboda despues de Alergias), actualizar claves de traduccion |
| `src/i18n/locales/es.json` | Cambiar `plusOneName`, añadir `dietaryDescription`, acortar `dietaryPlaceholder` |
| `src/i18n/locales/en.json` | Mismos cambios en ingles |
| `src/i18n/locales/it.json` | Mismos cambios en italiano |
| `src/pages/Admin.tsx` | Añadir deteccion de duplicados y alerta visual |

### Cambios en RSVPSection.tsx

Reordenar los bloques dentro del `AnimatePresence` (lineas 302-486):

```text
ANTES:                    DESPUES:
1. Preboda Toggle         1. Plus One Toggle
2. Plus One Toggle        2. Plus One Name
3. Plus One Name          3. Children Toggle
4. Children Toggle        4. Children Details
5. Children Details       5. Dietary Requirements
6. Dietary Requirements   6. Preboda Toggle
7. Transport              7. Transport
```

Tambien en Alergias, cambiar de solo placeholder a:
- Label existente
- Nuevo parrafo descriptivo (`dietaryDescription`)
- Textarea con placeholder corto

### Cambios en Admin.tsx

Añadir despues de las metricas y antes de la tabla:

```typescript
// Detectar duplicados por email
const emailCounts = realGuests.reduce((acc, g) => {
  acc[g.email] = (acc[g.email] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const duplicateEmails = Object.entries(emailCounts)
  .filter(([_, count]) => count > 1)
  .map(([email]) => email);
```

- Banner de alerta si `duplicateEmails.length > 0`
- Fondo `bg-amber-50` en filas con email duplicado
- Icono de advertencia junto al nombre del invitado duplicado

### Traducciones nuevas/modificadas

**es.json:**
- `plusOneName`: "Nombre y apellidos de tu pareja"
- `dietaryDescription`: "Indica las alergias o restricciones de todos los asistentes (tu, tu pareja y niños si los hay)"
- `dietaryPlaceholder`: "Ej: celiaco, vegetariano..."

**en.json / it.json:** equivalentes traducidos.

