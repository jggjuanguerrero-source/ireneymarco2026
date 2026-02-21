

## Anadir eventos de Umami a toda la web

### Resumen
Integrar llamadas `window.umami?.track()` en todas las secciones de la web para tener visibilidad completa de como interactuan los invitados.

### Eventos por seccion

**1. Selector de idioma (`LanguageSelector.tsx`)**
- `language_change` con datos `{ from, to }` -- en la funcion `changeLanguage`

**2. Hero (`Hero.tsx`)**
- `hero_cta_click` -- en el boton CTA que lleva al RSVP (el `<a href="#rsvp">`)

**3. Hotel / Alojamiento (`TravelSection.tsx`)**
- `hotel_book_email_click` -- click en el boton "Reservar por email" (mailto)
- `hotel_call_click` -- click en el boton de telefono
- `hotel_web_click` -- click en el enlace a la web del hotel
- `hotel_email_template_open` -- click en el desplegable de la plantilla de email
- `hotel_email_template_copy` -- click en copiar la plantilla

**4. Como llegar (`GettingThereSection.tsx`)**
- `getting_there_maps_click` con datos `{ transport }` -- click en cualquier boton de Google Maps, identificando si es aeropuerto Marco Polo, Treviso o coche

**5. Regalo (`GiftSection.tsx`)**
- `gift_iban_copy` -- click en el boton de copiar IBAN

**6. Musica (`MusicSection.tsx`)**
- `music_spotify_click` -- click en el boton de abrir Spotify
- `music_song_submit` -- envio exitoso de una sugerencia de cancion
- `music_song_error` -- error al enviar la sugerencia

---

### Cambios tecnicos por archivo

**`src/components/wedding/LanguageSelector.tsx`**
- En la funcion `changeLanguage` (linea 44), anadir:
  ```
  window.umami?.track('language_change', { from: i18n.language, to: code });
  ```

**`src/components/wedding/Hero.tsx`**
- En el `onClick` del enlace CTA (linea 104), anadir:
  ```
  window.umami?.track('hero_cta_click');
  ```

**`src/components/wedding/TravelSection.tsx`**
- En el `onClick` del boton de email (linea 133), anadir `hotel_book_email_click`
- En el `<a>` del telefono (linea 143), envolver con `onClick` para `hotel_call_click`
- En el `<a>` de la web (linea 101), envolver con `onClick` para `hotel_web_click`
- En el boton de mostrar/ocultar plantilla (linea 154), anadir `hotel_email_template_open` (solo al abrir)
- En el boton de copiar plantilla (linea 188), anadir `hotel_email_template_copy`

**`src/components/wedding/GettingThereSection.tsx`**
- En cada `<a>` de Maps (linea 107), envolver con `onClick` para `getting_there_maps_click` con `{ transport: 'marco_polo' | 'treviso' | 'car' }`
- Se usara un array de identificadores `['marco_polo', 'treviso', 'car']` alineado con el array `cards`

**`src/components/wedding/GiftSection.tsx`**
- En la funcion `handleCopy` (linea 14), tras el `if (success)` (linea 45), anadir:
  ```
  window.umami?.track('gift_iban_copy');
  ```

**`src/components/wedding/MusicSection.tsx`**
- En `handleSpotifyClick` (linea 31), anadir `music_spotify_click`
- Tras el insert exitoso (linea 57), anadir `music_song_submit`
- En el catch de error (linea 66), anadir `music_song_error`

### Archivos modificados (6 archivos)
1. `src/components/wedding/LanguageSelector.tsx`
2. `src/components/wedding/Hero.tsx`
3. `src/components/wedding/TravelSection.tsx`
4. `src/components/wedding/GettingThereSection.tsx`
5. `src/components/wedding/GiftSection.tsx`
6. `src/components/wedding/MusicSection.tsx`

### Sin dependencias nuevas
El tipado de `window.umami` ya existe en `src/vite-env.d.ts`. Todas las llamadas usan optional chaining para evitar errores si el script no esta cargado.
