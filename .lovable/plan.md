

## Plan: Filtros rápidos para las tablas del panel de coordinación

### Enfoque

Añadir una barra de filtros rápidos (chips/botones toggle) encima de la tabla de invitados, más un buscador de texto. Esto permite ver de un vistazo alergias, confirmados, pendientes, etc.

### Cambios en `src/pages/Admin.tsx`

1. **Nuevo estado de filtro**:
   - `filterText` (string) — búsqueda por nombre/email
   - `activeFilter` (enum: `'all' | 'confirmed' | 'pending' | 'dietary' | 'plusOne' | 'bus' | 'preboda'`)

2. **Barra de filtros** encima de la tabla de invitados (dentro del CardHeader o justo debajo):
   - Input de búsqueda por nombre/email
   - Chips clickables: "Todos", "Confirmados", "Pendientes", "Con alergias/dieta", "+1", "Bus", "Preboda"
   - Cada chip muestra su contador (ej: "Con dieta (8)")
   - El chip activo se resalta visualmente

3. **Filtrado de `realGuests`**: Crear un `filteredGuests` memo que aplique ambos filtros (texto + categoría) y usar ese array para renderizar la tabla.

4. **Contador en tabla**: Mostrar "Mostrando X de Y invitados" cuando hay filtro activo.

### Resultado

El usuario podrá hacer clic en "Con dieta" y ver solo los invitados con restricciones alimentarias, o buscar por nombre. Los filtros se combinan entre sí.

