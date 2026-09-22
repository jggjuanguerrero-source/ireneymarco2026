## Ajuste del formulario de preboda

1. Quitar el campo de alergias del formulario público en los tres idiomas.
2. Dejar de enviar ese dato al guardar una confirmación.
3. Quitar la columna de alergias de la tabla de Preboda en coordinación interna.
4. Eliminar la columna `allergies` de `preboda_rsvp`; esto borra también los datos de prueba actuales de ese campo.
5. Comprobar el formulario y la pestaña interna tras el cambio.

## Detalles técnicos

- Se hará una migración de estructura con `DROP COLUMN allergies`.
- No se modificarán las alergias del RSVP principal de la boda.
