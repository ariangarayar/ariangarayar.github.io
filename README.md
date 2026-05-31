# Ast4 Personal Site

Página personal estática para publicar resoluciones de laboratorios de redes y ciberseguridad.

## Estructura

- `index.html`: inicio tipo blog con sidebar, búsqueda, filtros y lista de resoluciones.
- `tags.html`: índice interactivo de etiquetas con buscador y acceso a máquinas relacionadas.
- `sobre-mi.html`: perfil profesional con certificaciones, contacto y comunidad.
- `writeup.html`: plantilla individual para abrir cada máquina en una pestaña nueva.
- `styles.css`: tema oscuro/dorado, fondo animado, layout responsive y estilo de artículo.
- `app.js`: listado de las 10 máquinas, búsqueda, filtros y rail lateral.
- `writeup-data.js`: texto completo e imágenes locales de las resoluciones extraídas desde Notion.
- `writeup.js`: renderiza cada resolución paso por paso, con bloques desplegables, comandos y capturas en orden.
- `assets/avatar.jpg`: avatar principal.
- `assets/anime-bedroom-bg.jpg`: fondo animado del dormitorio nocturno.
- `assets/ast4-writeup-cover.png`: portada común para las tarjetas de resoluciones.
- `assets/black-clover-banner.gif`: animación lateral enlazada desde la sección de etiquetas.
- `assets/certifications/`: certificados visuales del perfil profesional.
- `assets/notion-writeups/`: capturas completas de las máquinas.

## Máquinas incluidas

ICA: 1, MyExpense: 1, Blog, Easy Peasy, Source, Basic Pentesting, RootMe,
Startup, Chill Hack y Conversor.

## Publicar en GitHub Pages

1. Crea un repositorio llamado `tuusuario.github.io`.
2. Sube estos archivos a la raíz del repositorio.
3. Activa GitHub Pages desde `Settings > Pages`.

Para agregar otra máquina, añade una tarjeta en `app.js` y su resolución completa en `writeup-data.js`.
