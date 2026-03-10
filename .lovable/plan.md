

## Plan: Página 404 multiidioma con i18n

Tienes razón: el idioma ya se guarda en `localStorage` cuando el usuario selecciona idioma en la web, así que la mayoría de visitantes ya tendrán su idioma configurado. El fallback será inglés como pides.

### Cambios

**1. Añadir traducciones en los 3 JSON de idioma** (`es.json`, `en.json`, `it.json`):

Clave `notFound` con: `messages` (array de frases graciosas), `backHome` (texto del botón), `footer` (el comentario del pie).

- **ES**: Las frases actuales de góndola + "Volver a la invitación" + "La boda sigue en pie, tranquilo/a"
- **EN**: Versiones en inglés tipo "This gondola got lost in the canals...", "Not even the best gondolier could find this page..." + "Back to the invitation" + "The wedding is still on, don't worry"
- **IT**: Versiones en italiano tipo "Questa gondola si è persa nei canali...", "Nemmeno il gondoliere più esperto troverebbe questa pagina..." + "Torna all'invito" + "Il matrimonio è ancora in piedi, tranquillo/a"

**2. Actualizar `NotFound.tsx`**:

- Importar `useTranslation` de `react-i18next`
- Usar `t('notFound.messages', { returnObjects: true })` para obtener el array de mensajes y seleccionar uno aleatorio
- Usar `t('notFound.backHome')` y `t('notFound.footer')` para los textos estáticos
- El idioma se resolverá automáticamente desde lo que el usuario eligió (guardado en localStorage), con fallback a español (que es el `fallbackLng` configurado)

### Nota sobre el fallback

Tu `i18n/index.ts` tiene `fallbackLng: 'es'`. Si prefieres que el fallback sea inglés para visitantes nuevos, se puede cambiar a `'en'`, pero eso afectaría a toda la web. Alternativamente dejamos el fallback en español como está (ya que la mayoría de invitados son hispanohablantes).

