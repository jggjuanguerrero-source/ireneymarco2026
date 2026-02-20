
# Alerta de email duplicado en el panel de coordinación

## Cambio

En lugar de hacer upsert, detectar el error de duplicado en el formulario RSVP y mostrar un mensaje amigable al usuario, mientras se deja visible la alerta en el panel de administración.

## Detalle técnico

### 1. Formulario RSVP (`src/components/wedding/RSVPSection.tsx`)

En el `catch` (línea 111), detectar si el error es de clave duplicada (código `23505`) y mostrar un mensaje específico al usuario:

```tsx
} catch (error: any) {
  const isDuplicate = error?.code === '23505';
  toast({
    title: isDuplicate
      ? t('sections.rsvp.alreadySubmittedTitle')
      : t('sections.rsvp.errorTitle'),
    description: isDuplicate
      ? t('sections.rsvp.alreadySubmittedMessage')
      : t('sections.rsvp.errorMessage'),
    variant: 'destructive',
  });
}
```

### 2. Traducciones (3 archivos)

Añadir dos nuevas claves en cada idioma:

- **es.json**: `"alreadySubmittedTitle": "Ya recibimos tu confirmación"`, `"alreadySubmittedMessage": "Si necesitas hacer cambios, contacta con nosotros."`
- **en.json**: `"alreadySubmittedTitle": "We already received your RSVP"`, `"alreadySubmittedMessage": "If you need to make changes, please contact us."`
- **it.json**: `"alreadySubmittedTitle": "Abbiamo già ricevuto la tua conferma"`, `"alreadySubmittedMessage": "Se hai bisogno di modifiche, contattaci."`

### 3. Panel de admin (`src/pages/Admin.tsx`)

Añadir un indicador visual en la tabla de invitados que muestre cuándo un registro tiene intentos duplicados. Para simplificar, como la info de duplicados no se guarda en BD, lo que haremos es mostrar en el panel un badge junto a los registros más recientes (por `updated_at`) para que el coordinador vea la actividad reciente. Sin embargo, dado que el usuario dice "simplemente deja una alerta", la solución más directa es: **no tocar el panel**, y limitarse a mostrar el mensaje amigable al usuario en el formulario. El panel ya muestra todos los registros existentes, así que el coordinador ya puede ver quién ha confirmado.

**Resumen: el cambio real son 2 cosas:**
1. Detectar error duplicado y mostrar mensaje amigable (no genérico) en el formulario.
2. Añadir las traducciones correspondientes.
