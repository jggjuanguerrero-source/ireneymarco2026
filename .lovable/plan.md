
# Permitir reenvíos del formulario RSVP y deduplicar en el panel

## Problema

Actualmente el campo `email` tiene una restricción de unicidad (`guests_email_key`), lo que impide que un invitado envíe el formulario más de una vez.

## Solución

### 1. Eliminar la restricción de unicidad en `email` (migración SQL)

```sql
ALTER TABLE public.guests DROP CONSTRAINT IF EXISTS guests_email_key;
```

Esto permite que un mismo email envíe múltiples veces. Cada envío se guarda como registro independiente.

### 2. Formulario RSVP (`src/components/wedding/RSVPSection.tsx`)

Detectar si el email ya existe antes de insertar. Si existe, insertar igualmente pero mostrar un mensaje diferente:

- Antes de insertar, hacer un `SELECT` rápido para comprobar si el email ya tiene registros.
- Si es la primera vez: mostrar el mensaje actual de éxito ("Gracias por confirmar").
- Si ya existía: mostrar un mensaje tipo "Gracias por actualizar tu confirmación".
- Eliminar la lógica de `catch` para duplicados (ya no habrá error 23505).

### 3. Traducciones (3 archivos)

Reutilizar las claves `alreadySubmittedTitle` y `alreadySubmittedMessage`, cambiando su texto a:

- **es.json**: `"alreadySubmittedTitle": "Confirmación actualizada"`, `"alreadySubmittedMessage": "Gracias por actualizar vuestra confirmación."`
- **en.json**: `"alreadySubmittedTitle": "RSVP updated"`, `"alreadySubmittedMessage": "Thank you for updating your confirmation."`
- **it.json**: `"alreadySubmittedTitle": "Conferma aggiornata"`, `"alreadySubmittedMessage": "Grazie per aver aggiornato la vostra conferma."`

### 4. Panel de admin (`src/pages/Admin.tsx`)

Añadir un indicador visual para emails duplicados:

- Al cargar los invitados, contar cuántas veces aparece cada email.
- Si un email aparece más de una vez, mostrar un badge "Duplicado" junto al nombre para que el coordinador pueda revisarlo y deduplicar manualmente.
- Ordenar por `created_at` descendente para ver los más recientes primero.
