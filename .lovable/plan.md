
# Cambiar el toggle del bus al mismo estilo Sí/No

## Cambio

Reemplazar el componente `BusToggle` (líneas 128-148) y su uso (línea 485) por el mismo patrón de botones Sí/No que usan las demás preguntas (pareja, niños, preboda), usando la función `toggleBtn` ya existente.

## Detalle técnico

**Archivo:** `src/components/wedding/RSVPSection.tsx`

1. **Eliminar** el componente `BusToggle` (líneas 128-148).
2. **Reemplazar** `<BusToggle />` en la línea 485 por:

```tsx
<div className="flex gap-3">
  <button
    type="button"
    onClick={() => handleInputChange('busIda', true)}
    className={toggleBtn(formData.busIda)}
  >
    {t('sections.rsvp.yes')}
  </button>
  <button
    type="button"
    onClick={() => handleInputChange('busIda', false)}
    className={toggleBtn(!formData.busIda)}
  >
    No
  </button>
</div>
```

Esto unifica el estilo con las demás preguntas del formulario sin añadir ni quitar texto.
