# Invitación Cumple 4 Dino

¡Estás invitado al cumple de Dino! 🥳

## Tema

Thomas & Friends — paleta celeste, diseño mobile-first.

---

## Desarrollo local

### Requisitos

- Node.js 20+
- npm

### Setup

```bash
# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores:
#   PUBLIC_RSVP_ENDPOINT=https://script.google.com/macros/s/.../exec
#   PUBLIC_INVITATION_URL=http://localhost:4321
```

### Comandos

```bash
npm run dev      # Servidor de desarrollo en http://localhost:4321
npm run build    # Genera dist/ (nunca correr en producción manualmente)
npm run preview  # Vista previa de dist/
```

---

## Despliegue

### 1. Configurar el endpoint RSVP (una sola vez)

1. Crear una Google Sheet con el nombre `RSVPs - Cumple Dino 4`
2. Añadir fila de cabecera: `Timestamp | Nombre del niño | Adultos`
3. Copiar el **Sheet ID** de la URL de la Sheet
4. Ir a [script.google.com](https://script.google.com) → Nuevo proyecto
5. Copiar el contenido de `gas/Code.gs` y pegar en el editor
6. Reemplazar `YOUR_SHEET_ID_HERE` con el Sheet ID del paso 3
7. **Deploy** → **Nueva implementación** → Web app → Ejecutar como: **Yo** → Quien tiene acceso: **Cualquiera**
8. Copiar la URL del Web app → será tu `PUBLIC_RSVP_ENDPOINT`

### 2. Desplegar el frontend en Netlify

**Opción A: Drag & drop**
```bash
npm install
npm run build
# Arrastrar la carpeta dist/ a netlify.com/drop
```

**Opción B: Git + Netlify**
1. Subir este proyecto a GitHub
2. Conectar el repo en Netlify
3. Configurar variables de entorno en Netlify:
   - `PUBLIC_RSVP_ENDPOINT` = URL del Web App (paso 1.7)
   - `PUBLIC_INVITATION_URL` = URL de tu sitio en Netlify
4. Netlify hace `npm install && npm run build` automáticamente

### 3. Verificar

- [ ] `npm run dev` abre la invitación en http://localhost:4321
- [ ] El countdown muestra los días restantes
- [ ] El botón "Confirmar asistencia" abre el modal
- [ ] Submit del formulario crea una fila en la Google Sheet
- [ ] El enlace de Google Calendar abre con los datos correctos

---

## Estructura de archivos

```
/
├── public/
│   └── favicon.svg          # Icono del tren (placeholder)
├── src/
│   ├── components/
│   │   ├── Countdown.tsx    # Isla React — countdown en tiempo real
│   │   ├── EventDetails.astro
│   │   ├── FAB.astro        # Botón flotante fijo inferior-derecha
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Location.astro
│   │   ├── Notes.astro
│   │   ├── CalendarLink.astro
│   │   └── RSVPModal.tsx    # Isla React — formulario de confirmación
│   ├── layouts/
│   │   └── BaseLayout.astro # HTML shell, Google Fonts, meta tags
│   ├── lib/
│   │   ├── config.ts        # Datos del evento (fecha, dirección, teléfonos)
│   │   └── rsvp.ts          # Fetch wrapper para el endpoint GAS
│   ├── pages/
│   │   └── index.astro      # Composición de todas las secciones
│   └── styles/
│       └── global.css       # Tailwind + variables CSS
├── gas/
│   ├── Code.gs              # Código del Google Apps Script
│   └── README.md            # Instrucciones de deploy del GAS
├── .env.example
├── astro.config.mjs
├── netlify.toml
├── package.json
├── tailwind.config.cjs
└── tsconfig.json
```

---

## Placeholders a reemplazar antes de la fiesta

- [ ] Teléfono de contacto en `src/components/Footer.astro` (ya configurado: +34 630173975)
- [ ] Contenido de las notas en `src/components/Notes.astro` (dress code, qué traer, etc.)
- [ ] Imágenes en `public/images/` (reemplazar placeholders con diseños propios)
- [ ] Horario estimado en `src/components/EventDetails.astro`

---

## Tecnología

- [Astro](https://astro.build) 4.x — generador de sitio estático
- [React](https://react.dev) 18 — islas interactivas (Countdown, RSVPModal)
- [Tailwind CSS](https://tailwindcss.com) 3.x — estilos
- [Google Apps Script](https://developers.google.com/apps-script) — backend RSVP
- [Netlify](https://netlify.com) — hosting del frontend
