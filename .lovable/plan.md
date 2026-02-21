
## Integrar eventos de Umami en el formulario RSVP

### Que se va a hacer
Anadir llamadas a `umami.track()` en los puntos clave del flujo RSVP para tener visibilidad completa del embudo de confirmacion.

### Eventos a implementar

1. **`rsvp_form_view`** - Se dispara cuando la seccion RSVP entra en el viewport (aprovechando el `useInView` que ya existe)
2. **`rsvp_attending_yes`** - Click en el boton "Asistiré"
3. **`rsvp_attending_no`** - Click en "No puedo asistir"
4. **`rsvp_submit_attempt`** - Al inicio de `handleSubmit`, antes de cualquier validacion
5. **`rsvp_validation_error`** - Cuando Zod rechaza el formulario, incluyendo los campos que fallaron
6. **`rsvp_submit_success`** - Tras insertar exitosamente en la base de datos
7. **`rsvp_submit_error`** - Si la llamada a la base de datos falla
8. **`rsvp_update`** - Cuando se detecta que el email ya existia

### Cambios tecnicos

**Archivo: `src/components/wedding/RSVPSection.tsx`**

Se anadiran llamadas a `umami.track()` en los siguientes puntos del codigo existente:

- **En el `useInView` effect**: Un nuevo `useEffect` que observe `isInView` y dispare `rsvp_form_view` una sola vez.
- **En los botones de asistencia (lineas ~273-300)**: Llamada a `umami.track('rsvp_attending_yes')` o `umami.track('rsvp_attending_no')` en los `onClick`.
- **En `handleSubmit` (linea ~62)**: Llamada a `umami.track('rsvp_submit_attempt')` al inicio de la funcion.
- **En el bloque de error de validacion (linea ~71-78)**: Llamada a `umami.track('rsvp_validation_error', { fields: ... })` con los nombres de los campos que fallaron.
- **Tras el insert exitoso (linea ~119)**: Llamada a `umami.track('rsvp_submit_success')` y si era update, tambien `umami.track('rsvp_update')`.
- **En el catch de error (linea ~133)**: Llamada a `umami.track('rsvp_submit_error')`.

Para evitar errores si Umami no esta cargado, cada llamada usara optional chaining: `window.umami?.track(...)`.

Se anadira tambien una declaracion de tipo para `window.umami` al inicio del archivo o en un archivo de tipos, para evitar errores de TypeScript.

### Archivos modificados
- `src/components/wedding/RSVPSection.tsx` - Anadir las llamadas de tracking
- `src/vite-env.d.ts` - Anadir tipado de `window.umami`

### Sin dependencias nuevas
No se instala ningun paquete. Umami ya esta cargado via el script en `index.html`.
