
# Analisis UX completo - Web de boda Irene & Marco

## Lo que funciona bien (puntos fuertes)

- **Paleta de colores coherente**: Crema calido, dorado oliva, azul marino suave. Transmite elegancia y calidez.
- **Tipografias bien elegidas**: Great Vibes (nombres), Playfair Display (titulos), Cormorant Garamond (cuerpo). Jerarquia clara.
- **Hero impactante**: La acuarela de Venecia, el countdown y la composicion vertical funcionan muy bien.
- **Navegacion clara**: 6 secciones bien nombradas. Menu movil a pantalla completa, limpio.
- **Timeline visual**: El programa del dia con iconos, linea vertical y badges (Michelin Guide) es muy legible.
- **Formulario RSVP**: Toggles elegantes, animaciones suaves, campos progresivos.

---

## Problemas detectados y mejoras propuestas

### 1. Contraste del countdown con la imagen (CRITICO en movil)
**Problema**: En la zona Hero, el countdown (numeros grandes) se superpone con la acuarela de Venecia. En escritorio el solapamiento es parcial, pero en movil se pierde legibilidad.
**Solucion**: Aumentar el gradiente de transicion entre texto y la imagen, o colocar el countdown sobre un fondo semitransparente sutil (`bg-background/70 backdrop-blur-sm rounded-xl px-6 py-4`).

### 2. Espaciado excesivo entre secciones
**Problema**: El padding actual (`py-32 md:py-40 lg:py-48`, equivalente a 128-192px) es demasiado generoso. Crea enormes bloques de espacio vacio que hacen la pagina muy larga y dan sensacion de contenido escaso.
**Solucion**: Reducir a `py-20 md:py-28 lg:py-32` (80-128px). Sigue siendo espacioso y elegante, pero mas compacto y con mejor ritmo visual.

### 3. Fondo alternante inconsistente
**Problema**: Las secciones alternan entre `bg-background` y `bg-secondary/50`, pero la diferencia de color es minima (96% vs 93% de luminosidad). Apenas se percibe, haciendo que la pagina se sienta como un bloque unico.
**Solucion**: Dos opciones:
  - (A) Aumentar el contraste del fondo alterno a `bg-secondary/80` para que sea mas visible
  - (B) Anadir un separador decorativo sutil entre secciones (la linea con rombo "decorative line" ya existe al inicio de cada seccion, pero queda perdida con tanto espacio)

### 4. Seccion "Preboda" se siente vacia
**Problema**: La seccion de Preboda tiene un badge "POR CONFIRMAR" y un mensaje "Pronto actualizaremos". Es una seccion con poco contenido visual que rompe el ritmo.
**Solucion**: Considerar fusionarla como una sub-seccion dentro de "El Gran Dia" hasta que tenga informacion definitiva, o anadir un elemento visual (una imagen del lugar previsto o un icono decorativo mas grande).

### 5. Seccion "Hotel" muy densa
**Problema**: La tarjeta del hotel tiene mucha informacion (descripcion, precio, instrucciones de reserva, email prefabricado). Es la seccion mas cargada visualmente.
**Solucion**: Organizar en pasos numerados ("1. Escribe al hotel, 2. Indica tus fechas...") y colapsar la plantilla de email por defecto, mostrando solo un boton "Ver plantilla de email" que la expanda.

### 6. Titulo de Musica sin font-serif
**Problema**: El titulo de la seccion Musica usa `font-sans` en vez de `font-serif`, rompiendo la consistencia visual con el resto de secciones.
**Solucion**: Cambiar a `font-serif` como las demas secciones.

### 7. Footer con excesivo espacio inferior
**Problema**: El footer tiene un bloque enorme de espacio vacio por debajo del contenido (visible en el scroll final).
**Solucion**: Reducir el padding del footer de `py-16 md:py-24` a `py-12 md:py-16`.

### 8. Imagenes del timeline sin max-height en movil
**Problema**: Las imagenes de la iglesia y restaurante en el timeline ocupan mucho espacio vertical en movil, empujando el contenido hacia abajo.
**Solucion**: Anadir `max-h-48 md:max-h-auto` para limitar la altura en pantallas pequenas.

### 9. IBAN dificil de leer en movil
**Problema**: El IBAN con tracking amplio puede desbordarse o ser dificil de leer en pantallas estrechas.
**Solucion**: Reducir el `tracking-widest` a `tracking-wider` en movil y asegurar `break-all` si es necesario.

### 10. Falta indicador visual de seccion activa en la navegacion
**Problema**: El navbar solo subraya la seccion al hacer hover, pero no indica en que seccion esta el usuario mientras hace scroll.
**Solucion**: Implementar un "active section" detector con IntersectionObserver que resalte el enlace de la seccion visible.

---

## Resumen de cambios priorizados

| Prioridad | Cambio | Impacto |
|-----------|--------|---------|
| Alta | Mejorar legibilidad del countdown sobre imagen | Legibilidad critica |
| Alta | Reducir espaciado entre secciones | Pagina mucho mas navegable |
| Alta | Corregir font del titulo de Musica | Consistencia visual |
| Media | Limitar altura imagenes timeline en movil | Mejor experiencia movil |
| Media | Colapsar plantilla email del hotel | Reduce carga visual |
| Media | Mejorar contraste fondos alternos | Mejor separacion visual |
| Baja | Indicador de seccion activa en nav | Nice-to-have |
| Baja | Reducir padding footer | Detalle estetico |
| Baja | Fusionar Preboda con El Gran Dia (temporal) | Depende de contenido |

---

## Archivos afectados

| Archivo | Cambios |
|---------|---------|
| `src/index.css` | Ajustar `.section-padding` de py-32/40/48 a py-20/28/32 |
| `src/components/wedding/Hero.tsx` | Fondo semitransparente para countdown |
| `src/components/wedding/WeddingSection.tsx` | max-height en imagenes movil |
| `src/components/wedding/MusicSection.tsx` | Corregir `font-sans` a `font-serif` en titulo |
| `src/components/wedding/TravelSection.tsx` | Colapsar plantilla email (opcional) |
| `src/components/wedding/Footer.tsx` | Reducir padding |
| `src/components/wedding/GiftSection.tsx` | Ajuste tracking IBAN movil |
| `src/components/wedding/Navbar.tsx` | Active section indicator (opcional) |
