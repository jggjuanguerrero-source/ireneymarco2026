

# Unificar fondo del countdown en mobile

## Problema

El contenedor del countdown usa `bg-background/60 backdrop-blur-sm`, que genera un rectángulo con fondo semitransparente visible sobre el fondo crema. En desktop el blur ayuda a legibilidad contra la imagen, pero en mobile no hay imagen detrás del countdown, así que solo se ve un parche de color diferente.

## Cambio

En `src/components/wedding/Hero.tsx` (línea 91), cambiar las clases del contenedor del countdown para que en mobile sea transparente y solo aplique el fondo con blur en pantallas más grandes donde la imagen puede quedar detrás:

**Antes:**
```
bg-background/60 backdrop-blur-sm rounded-2xl px-6 py-4
```

**Después:**
```
md:bg-background/60 md:backdrop-blur-sm rounded-2xl px-6 py-4
```

Esto hace que en mobile el fondo sea completamente transparente (se funde con el crema), y en tablet/desktop se mantiene el efecto blur para legibilidad contra la imagen.

## Archivo afectado

- `src/components/wedding/Hero.tsx` -- una sola línea (línea 91)

