

## Mejoras en el Panel de Coordinación

### 1. Botón de refrescar datos
Se añadirá un botón de "Refrescar" en la cabecera de la sección de gestión de invitados (junto a "Descargar CSV" y "Añadir Invitado") que llame a `fetchGuests()` sin necesidad de recargar la página completa. Usará el icono `RefreshCw` de Lucide.

### 2. Botón de mostrar/ocultar contraseña
En la pantalla de acceso con código, se añadirá un botón con icono de ojo (`Eye` / `EyeOff` de Lucide) dentro del campo de contraseña para alternar entre `type="password"` y `type="text"`.

---

### Detalles técnicos

**Archivo a modificar:** `src/pages/Admin.tsx`

**Cambio 1 - Botón refrescar:**
- Importar `RefreshCw` de `lucide-react`
- Añadir un nuevo estado `refreshing` para feedback visual (spinner)
- Colocar el botón junto a "Descargar CSV" en la cabecera de la tabla de invitados
- Al hacer clic, ejecuta `fetchGuests()` y muestra un toast de confirmación

**Cambio 2 - Toggle de visibilidad del código:**
- Importar `Eye` y `EyeOff` de `lucide-react`
- Añadir estado `showPassword` (boolean)
- Cambiar el `type` del Input entre `"password"` y `"text"` según el estado
- Añadir un botón con icono de ojo posicionado dentro del campo de entrada (usando un wrapper `relative` con el botón en `absolute right`)

