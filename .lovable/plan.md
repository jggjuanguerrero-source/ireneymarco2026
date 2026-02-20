
# Scroll al RSVP tras enviar el formulario

## Problema

Al enviar el formulario RSVP, aparece la notificación de éxito pero la vista se desplaza a otra sección, impidiendo ver el mensaje de confirmación "Gracias por confirmar".

## Solución

Tras el envío exitoso (línea 101 en `handleSubmit`), añadir un `scrollIntoView` al contenedor de la sección RSVP usando el `ref` que ya existe en el componente.

## Detalle técnico

**Archivo:** `src/components/wedding/RSVPSection.tsx`

Después de `setIsSuccess(true)` (línea 101), añadir:

```tsx
ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

Con un pequeño `setTimeout` para que el estado se actualice primero y se renderice el mensaje de confirmación antes de hacer scroll:

```tsx
setIsSuccess(true);
setTimeout(() => {
  ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
```

Es un cambio de 3 líneas. El `ref` ya apunta al `<section id="rsvp">`, así que scrolleará directamente a la sección donde el usuario verá el mensaje de confirmación.
