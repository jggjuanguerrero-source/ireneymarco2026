

## Plan: Hotel Agotado + Lista de Espera

### Resumen
Marcar el Hotel Orizzonte como "AGOTADO" con una cinta visual, reemplazar los botones de reserva por un formulario de solicitud de alojamiento alternativo, crear la tabla `hotel_requests` en la base de datos, y añadir una sección en el panel de coordinación para gestionar las solicitudes.

---

### 1. Base de datos — Crear tabla `hotel_requests`

```sql
CREATE TABLE public.hotel_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  people_count integer NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hotel_requests ENABLE ROW LEVEL SECURITY;

-- Invitados pueden insertar pero no leer
CREATE POLICY "Allow public insert" ON public.hotel_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Deny public read" ON public.hotel_requests
  FOR SELECT USING (false);
```

### 2. Frontend — `TravelSection.tsx`

**Cambios principales:**

- **Cinta "AGOTADO"**: Añadir un ribbon diagonal sobre la imagen del hotel con CSS (`rotate-45`, posición absoluta, fondo rojo/rosa).
- **Eliminar sección de reserva**: Quitar los botones "Reservar por Email" y llamada telefónica, los pasos de reserva, y la plantilla de email colapsable.
- **Nuevo formulario "Buscando alojamiento alternativo"**: Debajo de la descripción del hotel, con 4 campos:
  - Nombre del invitado (Input texto)
  - Número de personas (Input numérico)
  - Check-in (Input type="date")
  - Check-out (Input type="date")
  - Botón "Solicitar alternativa"
- El formulario inserta directamente en `hotel_requests` vía Supabase client.
- Toast de confirmación tras envío exitoso.

### 3. Traducciones — `es.json`, `en.json`, `it.json`

Añadir claves nuevas bajo `sections.travel`:
- `soldOut`: "AGOTADO" / "SOLD OUT" / "ESAURITO"
- `alternativeTitle`: "Buscando alojamiento alternativo" / equivalentes
- `guestName`, `peopleCount`, `checkIn`, `checkOut`, `submitRequest`
- `requestSuccess`, `requestError`

### 4. Panel Admin — `Admin.tsx`

Añadir una nueva sección (Card) titulada "Solicitudes de Hotel Alternativo" con:
- Fetch de `hotel_requests` ordenado por `created_at DESC` (usando service role via la lectura directa ya que RLS bloquea SELECT público — pero el panel admin usa el client anon, así que necesitaremos **ajustar la política RLS** para permitir lectura autenticada, o bien usar una política que permita lectura con el service role).

**Nota importante sobre RLS**: Como el panel admin no usa autenticación real (usa código de acceso client-side), no podemos usar RLS basado en `auth.uid()`. La tabla `guests` ya tiene `USING (true)` para SELECT. Para `hotel_requests` usaremos la misma estrategia: `USING (true)` para SELECT (los datos no contienen PII sensible más allá del nombre).

Actualizo la política:
```sql
-- Reemplazar "Deny public read" por lectura pública (igual que guests)
CREATE POLICY "Allow public read" ON public.hotel_requests
  FOR SELECT USING (true);
```

- Tabla con columnas: Nombre, Personas, Check-in, Check-out, Fecha solicitud
- Botón de refrescar consistente con el resto del panel

### Archivos modificados
1. **Migración SQL** — nueva tabla `hotel_requests`
2. **`src/components/wedding/TravelSection.tsx`** — ribbon + formulario, eliminar booking
3. **`src/i18n/locales/es.json`** — nuevas claves
4. **`src/i18n/locales/en.json`** — nuevas claves
5. **`src/i18n/locales/it.json`** — nuevas claves
6. **`src/pages/Admin.tsx`** — nueva sección de solicitudes

