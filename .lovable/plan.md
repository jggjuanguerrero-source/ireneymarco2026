
# Botón "Confirma tu asistencia" en el Hero

## Objetivo

Añadir un botón CTA elegante en la sección Hero que haga scroll suave hasta el formulario RSVP.

## Diseño propuesto

El botón se colocará justo debajo del contador (Countdown), dentro de la zona de texto del Hero. Será sutil y elegante para no romper la estética minimalista:

- **Estilo:** Fondo transparente, borde fino dorado (primary), texto serif en color primary
- **Hover:** El fondo se rellena suavemente con el color primary y el texto pasa a blanco
- **Animación:** Aparece con fade-in tras el countdown (delay ~1.3s)
- **Acción:** Scroll suave hasta la sección RSVP (`#rsvp`)

## Detalles técnicos

### Archivo: `src/components/wedding/Hero.tsx`

Añadir después del bloque del Countdown (línea 93), un nuevo `motion.div` con el botón:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.3, duration: 0.8 }}
  className="mt-4"
>
  <a
    href="#rsvp"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
    }}
    className="inline-block font-serif text-sm md:text-base tracking-widest 
               border border-primary/60 text-primary px-8 py-3 rounded-full
               transition-all duration-500 
               hover:bg-primary hover:text-white hover:border-primary"
  >
    {t('hero.cta')}
  </a>
</motion.div>
```

### Archivos de traducción

Añadir la clave `hero.cta` en los tres idiomas:

| Idioma | Valor |
|--------|-------|
| `es.json` | "Confirma tu asistencia" |
| `en.json` | "Confirm your attendance" |
| `it.json` | "Conferma la tua presenza" |

### Requisito previo

Verificar que la sección RSVP tenga `id="rsvp"` en su elemento raíz (en `RSVPSection.tsx`) para que el scroll funcione correctamente.
