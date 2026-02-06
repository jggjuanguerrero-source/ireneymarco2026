
# Actualizar la seccion "Donde Dormir" con hoteles definitivos

## Resumen

Reemplazar los hoteles placeholder actuales (Hotel Danieli, Gritti Palace, etc.) con los 3 hoteles reales proporcionados. Cada tarjeta mostrara el precio fijo (sin "desde"), un campo de codigo de descuento con boton de copiar, y un boton de reserva con enlace directo.

---

## Cambios detallados

### 1. Datos de hoteles (`TravelSection.tsx`)

Eliminar los 6 hoteles actuales y sustituirlos por los 3 definitivos:

| Hotel | Precio | URL |
|---|---|---|
| Hotel Europa | Doble: 90 EUR/noche | hoteleuropajesolo.it |
| Hotel Atlantico | Doble: 80 EUR/noche | hotel-atlantico.it |
| Hotel Casablanca | Doble: 70 EUR / Triple: 105 EUR/noche | casablancajesolo.it |

- Se eliminara el sistema de categorias (luxury/smart/budget) ya que solo hay 3 hoteles y no tiene sentido agruparlos.
- Se anadira un campo `prices` a la interfaz `Hotel` para mostrar precios fijos (ej: `{ double: "90€/noche", triple?: "105€/noche" }`).
- El codigo de descuento sera el mismo para todos: `BODA-IRENE-MARCO`.

### 2. Rediseno de tarjetas de hotel

Cada tarjeta incluira:

- Imagen de stock elegante (se mantendran imagenes de Unsplash representativas de hoteles italianos).
- Nombre del hotel.
- Precios exactos mostrados de forma clara y destacada (sin la palabra "desde"), por ejemplo: "Doble: 90 EUR/noche" y si aplica "Triple: 105 EUR/noche".
- Bloque de "Codigo de Descuento" con:
  - El codigo `BODA-IRENE-MARCO` en tipografia monospace.
  - Un boton pequeno de "Copiar" al lado que use `navigator.clipboard.writeText()` y muestre feedback visual (icono check o toast).
- Boton "Reservar" que abra la URL del hotel en nueva pestana.

### 3. Traducciones (es.json, en.json, it.json)

Anadir nuevas claves de traduccion:

- `sections.travel.priceDouble` - "Habitacion doble" / "Double room" / "Camera doppia"
- `sections.travel.priceTriple` - "Habitacion triple" / "Triple room" / "Camera tripla"
- `sections.travel.perNight` - "/noche" / "/night" / "/notte"
- `sections.travel.copyCode` - "Copiar" / "Copy" / "Copia"
- `sections.travel.codeCopied` - "Copiado!" / "Copied!" / "Copiato!"

### 4. Layout del grid

Con 3 hoteles, se usara un grid de 3 columnas en desktop (`grid-cols-1 md:grid-cols-3`) para que las tarjetas se distribuyan uniformemente en una sola fila.

---

## Seccion tecnica

### Interfaz Hotel actualizada

```typescript
interface Hotel {
  id: string;
  name: string;
  image: string;
  description: { es: string; en: string; it: string; };
  prices: {
    double: number;
    triple?: number;
  };
  discountCode: string;
  bookingUrl: string;
}
```

### Funcionalidad de copiar codigo

Se usara un estado local `copiedId` para mostrar feedback visual temporal (2 segundos) cuando se copia el codigo:

```typescript
const [copiedId, setCopiedId] = useState<string | null>(null);

const handleCopy = (code: string, hotelId: string) => {
  navigator.clipboard.writeText(code);
  setCopiedId(hotelId);
  setTimeout(() => setCopiedId(null), 2000);
};
```

Se usaran los iconos `Copy` y `Check` de `lucide-react` para el boton.

### Archivos modificados

1. **`src/components/wedding/TravelSection.tsx`** - Reemplazo de datos de hoteles, eliminacion de categorias, nuevo diseno de tarjetas con precios y boton copiar.
2. **`src/i18n/locales/es.json`** - Nuevas claves de traduccion para precios y boton copiar.
3. **`src/i18n/locales/en.json`** - Idem en ingles.
4. **`src/i18n/locales/it.json`** - Idem en italiano.
