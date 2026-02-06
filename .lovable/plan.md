
# Anadir seccion "Preboda" con datos provisionales (TBC)

## Resumen

Crear una nueva seccion "Preboda" / "Pre-Wedding" / "Pre-Matrimonio" que se colocara justo despues de la seccion "La Boda" y antes de "Viaje y Hoteles". Mostrara la informacion confirmada (hora: 19:00, zona: Jesolo) y marcara el lugar exacto como "por confirmar" (TBC).

---

## Que se vera en la seccion

La seccion seguira el mismo estilo elegante del resto de la web. Incluira:

- Titulo: "Preboda" (ES) / "Pre-Wedding" (EN) / "Pre-Matrimonio" (IT)
- Subtitulo con la fecha o un mensaje invitando al evento previo
- Una tarjeta informativa con dos bloques:
  - **Hora:** 19:00h (confirmado)
  - **Lugar:** Jesolo (por confirmar) -- con una etiqueta visual "TBC" / "Por confirmar" sutil
- Un mensaje amigable indicando que se actualizara la ubicacion exacta pronto

---

## Detalles tecnicos

### 1. Nuevo componente: `src/components/wedding/PreWeddingSection.tsx`

Se creara un componente dedicado que:
- Usa `framer-motion` para animaciones de entrada (coherente con el resto de secciones)
- Muestra iconos de `lucide-react` (Clock para hora, MapPin para ubicacion)
- Incluye una etiqueta/badge "TBC" / "Por confirmar" al lado de la ubicacion
- Sigue el espaciado "luxury" existente (py-32 a py-48)

### 2. Actualizacion de `src/pages/Index.tsx`

- Importar el nuevo componente `PreWeddingSection`
- Colocarlo entre la seccion "La Boda" (`<Section id="wedding" .../>`) y `<TravelSection />`

### 3. Actualizacion del Navbar (`src/components/wedding/Navbar.tsx`)

- Anadir un nuevo enlace de navegacion "Preboda" con ancla `#prewedding`
- Colocarlo como segundo item, justo despues de "La Boda" y antes de "Viaje y Hoteles"

### 4. Traducciones (es.json, en.json, it.json)

Nuevas claves:

```
nav.prewedding: "Preboda" / "Pre-Wedding" / "Pre-Matrimonio"

sections.prewedding.title: "Preboda" / "Pre-Wedding" / "Pre-Matrimonio"
sections.prewedding.subtitle: "Acompananos la vispera..." / "Join us the evening before..." / "Unisciti a noi la sera prima..."
sections.prewedding.description: breve texto invitando al evento
sections.prewedding.time: "19:00h"
sections.prewedding.timeLabel: "Hora" / "Time" / "Ora"
sections.prewedding.locationLabel: "Lugar" / "Location" / "Luogo"
sections.prewedding.location: "Jesolo"
sections.prewedding.tbc: "Por confirmar" / "To be confirmed" / "Da confermare"
sections.prewedding.updateSoon: "Actualizaremos la ubicacion exacta pronto" / "We'll update the exact location soon" / "Aggiorneremo presto la posizione esatta"
```

### Archivos a crear/modificar

1. **Crear** `src/components/wedding/PreWeddingSection.tsx` -- componente nuevo
2. **Modificar** `src/pages/Index.tsx` -- importar y posicionar la nueva seccion
3. **Modificar** `src/components/wedding/Navbar.tsx` -- anadir enlace de navegacion
4. **Modificar** `src/i18n/locales/es.json` -- nuevas traducciones en espanol
5. **Modificar** `src/i18n/locales/en.json` -- nuevas traducciones en ingles
6. **Modificar** `src/i18n/locales/it.json` -- nuevas traducciones en italiano
