

# Mejorar los Emails de Confirmacion RSVP

## Problemas detectados

1. **El email no distingue correctamente entre "asiste" y "no asiste"**: El screenshot muestra que un invitado que marca "No asiste" recibe el mismo email de confirmacion con el resumen de datos (bus, alergias, etc.), en lugar de recibir el email afectuoso y diferenciado que ya esta programado en la funcion.

2. **El estilo del email no refleja la estetica de la web**: La web usa una paleta de crema calido (#F8F5F0), texto azul-carbon (#2C3E50) y oro oliva (#8B7355), con tipografias como Playfair Display y Great Vibes. El email actual usa tonos marrones/tostados que no coinciden.

---

## Plan de cambios

### 1. Corregir la logica condicional del email

Revisare el dato `rsvp_status` que se envia desde el formulario a la Edge Function para asegurar que llega como booleano y que la funcion lo interpreta correctamente. Actualmente la funcion compara `guest.rsvp_status === true`, pero puede haber un desajuste de tipos si el payload llega como string.

### 2. Redisenar el HTML de ambos emails para alinearlos con la web

**Paleta actualizada para los emails:**
- Fondo general: `#F8F5F0` (crema calido, igual que la web)
- Fondo del card: `#FFFFFF`
- Header del email (asiste): gradiente basado en oro oliva `#8B7355` / `#B8A07A`
- Header del email (no asiste): tono mas suave `#B8A07A` / `#C4B59A`
- Texto principal: `#2C3E50` (carbon azulado, como la web)
- Texto secundario: `#6B7B8C`
- Botones CTA: `#8B7355` (oro oliva)
- Bordes y separadores: `#E8E2D8`

**Tipografia:** Usar `Georgia, 'Playfair Display', serif` como font-family principal, que es lo mas cercano a la web en clientes de correo.

### 3. Archivos a modificar

- `supabase/functions/send-confirmation/index.ts`:
  - Actualizar colores del HTML en `buildAttendingEmailHtml` y `buildDeclineEmailHtml`
  - Actualizar `emailShell` con la nueva paleta
  - Asegurar que la comprobacion de `rsvp_status` maneje tanto booleanos como strings
  - Anadir log para depuracion del valor recibido

---

## Detalles tecnicos

La funcion `send-confirmation` ya tiene la estructura correcta con dos plantillas separadas (`buildAttendingEmailHtml` y `buildDeclineEmailHtml`). Los cambios son:

1. En la linea 258 de la funcion, anadir una comprobacion mas robusta:
```typescript
const attending = guest.rsvp_status === true || guest.rsvp_status === 'true';
```

2. Reemplazar todos los colores inline de ambas plantillas HTML:
   - `#D4A574` (header attending) pasa a `#8B7355`
   - `#C4956A` pasa a `#B8A07A`
   - `#B8A89A` (header decline) pasa a `#B8A07A`
   - `#A89888` pasa a `#C4B59A`
   - `#5C4A3A` (texto fuerte) pasa a `#2C3E50`
   - `#7A6B5D` (texto body) pasa a `#6B7B8C`
   - `#FAF7F2` (fondo) pasa a `#F8F5F0`
   - `#F5EFE7` (fondo IBAN) pasa a `#F3EDE4`
   - `#E8E0D8` (bordes) pasa a `#E8E2D8`
   - `#B8A89A` (footer) pasa a `#B8A07A`

3. Redesplegar la Edge Function tras los cambios.

