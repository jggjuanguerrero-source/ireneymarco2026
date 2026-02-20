

# Actualizaciones solicitadas por la novia

## Cambios a realizar

### 1. Timeline de la boda (WeddingSection.tsx)

**1.1 Imagen de la iglesia debajo del boton de Google Maps en "Ceremonia"**
- Copiar `user-uploads://iglesia.jpeg` a `src/assets/iglesia.jpg`
- En el timeline, tras el boton de Maps del paso 3 (Ceremonia), mostrar la imagen con estilo redondeado y sombra suave

**1.2 Imagen del restaurante debajo del boton de Google Maps en "Recepcion y Comida"**
- Copiar `user-uploads://restaurante.jpeg` a `src/assets/restaurante.jpg`
- En el timeline, tras el boton de Maps del paso 5 (Recepcion), mostrar la imagen

**1.3 Nuevo punto "Fotos" a las 13:00 entre Ceremonia y Salida de la Iglesia**
- Insertar un nuevo item en el array `timeline` entre el paso 3 (Ceremonia 12:00) y el paso 4 (Salida 13:30)
- Icono: `Camera` de lucide-react
- Hora: 13:00h
- Texto descriptivo: "El fotografo inmortalizara los mejores momentos" (o similar, traducido a 3 idiomas)
- Sin boton de Maps

**Implementacion tecnica:** Anadir propiedades opcionales `image` a los items del timeline y renderizar `<img>` debajo del boton de Maps cuando exista. Anadir nuevas claves de traduccion para el paso de fotos (step3b).

### 2. Cambio de wording en "El Gran Dia"

- Cambiar `sections.wedding.description` en los 3 idiomas:
  - ES: "Queremos compartir este dia tan especial para nosotros"
  - EN: "We want to share this very special day with you"
  - IT: "Vogliamo condividere questo giorno cosi speciale per noi"

### 3. Formulario RSVP

**3.1 Checkbox de asistencia a la Preboda**
- Anadir campo `preboda` (boolean) al schema zod y al estado del formulario
- Anadir nueva pregunta visible cuando el usuario confirma asistencia: "Asistiras a la Preboda?" con toggle Si/No
- Guardar en la base de datos: requiere nueva columna `preboda boolean DEFAULT false` en la tabla `guests`
- Migracion SQL necesaria

**3.2 Nota informativa en la seccion de transporte**
- Anadir debajo del titulo "Transporte" una nota: "Contamos con todos los invitados para el traslado en barco a la iglesia y de vuelta al restaurante"
- Traducir a los 3 idiomas
- Se mostrara como texto informativo (distinto del `transportDescription` que es la pregunta del bus)

### 4. Base de datos

- Migracion: `ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS preboda boolean NOT NULL DEFAULT false;`

---

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `src/assets/iglesia.jpg` | Nuevo (copia de upload) |
| `src/assets/restaurante.jpg` | Nuevo (copia de upload) |
| `src/components/wedding/WeddingSection.tsx` | Imagenes en timeline, nuevo paso "Fotos", import de imagenes |
| `src/components/wedding/RSVPSection.tsx` | Campo preboda + nota transporte |
| `src/i18n/locales/es.json` | Nuevas claves (fotos, preboda, transportNote) + cambio description |
| `src/i18n/locales/en.json` | Idem en ingles |
| `src/i18n/locales/it.json` | Idem en italiano |
| `src/pages/Admin.tsx` | Nueva columna "Preboda" en tabla y CSV |
| Migracion SQL | Columna `preboda` |

