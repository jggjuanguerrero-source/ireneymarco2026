

## Restringir acceso público a rsvp_events

### Problema
La tabla `rsvp_events` contiene nombres y correos electrónicos de invitados. Actualmente tiene una política SELECT pública que permite a cualquiera leer esos datos via API.

### Cambio
Reemplazar la política de lectura pública por una que bloquee todo acceso directo via SELECT. Solo el Service Role Key (usado internamente por las funciones del backend) podrá leer y escribir en esta tabla.

### Impacto
- El panel de coordinacion (`/coordinacion-interna-im`) **NO se ve afectado** porque actualmente no consulta esta tabla.
- La edge function `send-confirmation` **sigue funcionando** porque usa el Service Role Key para insertar eventos.
- Si en el futuro se quiere mostrar datos de esta tabla en el panel, se crearia una funcion backend que los lea de forma segura.

### Detalles tecnicos

**Migracion SQL:**
- `DROP POLICY "Allow read from authenticated or anon" ON public.rsvp_events`
- Crear nueva politica: `CREATE POLICY "Deny public read" ON public.rsvp_events FOR SELECT USING (false)`

Esto bloquea toda lectura via el cliente publico (anon key). El Service Role Key bypasea RLS automaticamente, asi que las funciones backend siguen teniendo acceso completo.
