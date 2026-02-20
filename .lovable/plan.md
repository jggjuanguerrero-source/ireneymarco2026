
# Mostrar el botón CTA solo en móvil

## Razonamiento

En desktop y tablet, la sección RSVP ya es visible al hacer un poco de scroll, por lo que el botón CTA no aporta valor y además queda tapado por la imagen de Venecia. En móvil sí tiene sentido porque hay más distancia hasta el formulario.

## Cambio

En `src/components/wedding/Hero.tsx`, añadir `md:hidden` al contenedor del botón CTA (línea 100) para que solo se muestre en pantallas pequeñas:

```
className="mt-4"  -->  className="mt-4 md:hidden"
```

Esto es un cambio de una sola clase CSS. El botón seguirá visible en móvil (menos de 768px) y se ocultará en tablet y desktop.

Además, revertir el cambio de `min-h-[65vh]` a `h-[65vh]` en la zona de texto (línea 25) para restaurar la altura fija original del Hero en desktop, ya que el botón ya no necesitará espacio extra.
