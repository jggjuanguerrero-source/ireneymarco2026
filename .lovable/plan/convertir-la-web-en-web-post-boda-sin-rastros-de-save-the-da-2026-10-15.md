# Convertir la web en web post-boda (sin rastros de save the date)

La boda ya se celebró (10 de octubre de 2026). La web debe transmitir: felicitación a los novios, subir fotos y facilitar los regalos. Se eliminan los textos que la presentan como una invitación futura ("save the date").

## Cambios

### 1. Hero (src/components/wedding/Hero.tsx)
- Eliminar el texto "save the date" (la etiqueta cursiva sobre los nombres).
- Sustituir la fecha y ubicación grandes por una sola línea discreta conmemorativa: "10 de Octubre, 2026 · Venecia" (usando `hero.date` y `hero.location` ya existentes en i18n), en tipografía pequeña.
- Mantener los nombres "Irene & Marco" y el mensaje "¡Vivan los novios!" como protagonista.

### 2. Título y metadatos (index.html)
- Title: "Irene & Marco | ¡Nos hemos casado!" (og:title y twitter:title igual).
- Description (og, twitter y meta): "¡Irene y Marco se han casado en Venecia! Comparte tus fotos y vídeos del gran día y consulta los datos del regalo."

### 3. Traducciones (es/en/it.json — los tres idiomas con el mismo tono)
- Nuestra Historia, descripción: pasado en vez de futuro:
  - es: "¡Nos casamos!" → "¡Nos hemos casado!"
  - en: "We're getting married!" → "We got married!"
  - it: "Ci sposiamo!" → "Ci siamo sposati!"
- Página 404:
  - "Volver a la invitación" → "Volver al inicio" / "Back to the home page" / "Torna alla home".
  - Chiste del pie "La boda sigue en pie, tranquilo/a 😅" → versión en pasado: es "La boda fue genial... esta página no tanto 😅", en "The wedding was great... this page, not so much 😅", it "Il matrimonio è stato bellissimo... questa pagina un po' meno 😅".

### 4. Sin cambios en: Fotos (ya orientada a post-boda), Regalo (ya facilita el IBAN y está segundo en el menú), panel interno, ni secciones ocultas.

## Verificación
- Compilación sin errores (tsgo).
- Revisión en el navegador (escritorio y móvil) del hero sin "save the date" y con la línea conmemorativa.
