

## Actualizar botones de Google Maps para mostrar rutas predefinidas

Actualmente los botones abren Google Maps en modo "buscar ubicación", lo que solo muestra un pin. Se cambiarán para que abran rutas completas con origen y destino predefinidos.

### Que cambia para el usuario

- Al pulsar el boton en la tarjeta del aeropuerto Marco Polo, se abre Google Maps con la ruta desde el aeropuerto hasta Jesolo Autostazione.
- Lo mismo para Treviso Airport.
- La tarjeta de alquiler de coches abre la ruta sin origen fijo, permitiendo que Google use la ubicacion del usuario.

### Cambios tecnicos

**`src/components/wedding/GettingThereSection.tsx`**

- Eliminar la constante compartida `GOOGLE_MAPS_URL`.
- Agregar una propiedad `mapsUrl` a cada tarjeta en el array `cards`:
  - VCE: `https://www.google.com/maps/dir/?api=1&origin=Venice+Marco+Polo+Airport&destination=Jesolo+Autostazione`
  - TSF: `https://www.google.com/maps/dir/?api=1&origin=Treviso+Airport&destination=Jesolo+Autostazione`
  - Car: `https://www.google.com/maps/dir/?api=1&destination=Jesolo+Autostazione`
- Actualizar el `onClick` del boton para usar `card.mapsUrl` en lugar de la constante global.

Solo se modifica 1 archivo. No se necesitan cambios en las traducciones.

