

## Aumentar separacion entre el Hero y la primera seccion en desktop

### Problema
En desktop, la seccion "Nuestra Historia" queda demasiado cerca del Hero visualmente. Aunque el Hero ocupa toda la pantalla (`h-screen`), al hacer scroll la transicion es muy abrupta.

### Solucion
Agregar un espaciador decorativo entre el Hero y la primera seccion. En lugar de simplemente meter mas padding (que afectaria el espaciado interno de la seccion), se anade un div separador que solo es visible en pantallas medianas y grandes.

### Cambios tecnicos

**`src/pages/Index.tsx`**
- Insertar un `div` espaciador entre `<Hero />` y `<OurStorySection />` con clases `hidden md:block md:h-16 lg:h-24 bg-background`. Esto anade 4-6rem de aire extra solo en desktop/tablet sin afectar la vista movil.

Solo se modifica 1 archivo. Es un cambio minimo y reversible.
