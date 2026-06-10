# Feliz Cumpleaños, Papá — Documento de diseño

**Fecha:** 2026-06-10
**Autor:** Gianpierre
**Estado:** Diseño aprobado, pendiente de revisión final antes de plan de implementación

---

## 1. Objetivo

Una landing page de regalo de cumpleaños para el papá de Gianpierre (13 de junio). El padre está en España; la familia, en Perú. La experiencia es una **carta visual emotiva con banda sonora**: el usuario recorre fotos y videos familiares mientras suena, de fondo, la voz de Gianpierre cantando "Mi Querido Viejo". El regalo es de parte de toda la familia.

## 2. Usuario y forma de entrega

- **Destinatario:** el papá, que abrirá el enlace desde **WhatsApp en un celular**, probablemente con datos móviles.
- **Consecuencia de diseño:** **mobile-first** obligatorio y **carga instantánea** como prioridad (cero JavaScript innecesario, assets optimizados).
- **Entrega:** un enlace web. (Proveedor de despliegue a definir en la fase de implementación.)

## 3. Concepto de experiencia

Recorrido vertical tipo **scroll cinematográfico**. Cada escena aparece con una transición suave (fade + parallax sutil) al entrar al viewport. La música acompaña todo el recorrido sin interrupciones.

### Secuencia de escenas

1. **Portada** (pantalla completa): saludo + botón "Tocar para comenzar". El toque inicia la música y habilita el recorrido.
2. **Apertura**: una frase breve que abre emocionalmente. Sin foto.
3. **Recorrido de recuerdos**: las 15 fotos + 3 videos de corrido, con frases cortas intercaladas. Las fotos donde aparece un familiar (mamá, Cesar, Steven) llevan un **pie de foto sutil** ("con mamá", "con Cesar", "con Steven") que ancla la presencia de la familia.
4. **Dedicatoria final**: un único mensaje escrito, de parte de toda la familia, firmado "Gaby, Cesar, Steven y Gianpierre".
5. **Cierre**: mensaje colectivo + escudo de Universitario de Deportes como broche + botón "Volver a ver".

### Decisiones de contenido

- **Una sola voz cantada** (Gianpierre). Los demás familiares no graban audio.
- **Sin dedicatorias individuales**: un único mensaje de la familia (decisión "A"). Los familiares están presentes a través de las fotos y los pies de foto, no con textos puestos en su boca.

## 4. Stack técnico

| Capa | Herramienta | Justificación |
|------|-------------|---------------|
| Framework | **Astro** (output estático) | Cero JS por defecto → carga instantánea en datos móviles |
| Lenguaje | **TypeScript** estricto | Sin `any`; modelo de datos tipado |
| Estilos | **Tailwind CSS** | Layout/spacing/responsive (mobile-first nativo) |
| Animación | **CSS scroll-driven nativo** (`animation-timeline: view()`) + fallback `IntersectionObserver` | Corre en el compositor, fluido en móvil; **cero librerías** |
| Interactividad | JavaScript mínimo | Solo control de audio (play/mute) |
| Gestor | **pnpm** | Convención del equipo |

**Restricción explícita:** ninguna librería de animación (GSAP, Framer Motion, AOS, etc.). El peso de JavaScript contradice el objetivo de carga instantánea.

## 5. Estructura de carpetas

```
feliz-cumple-papa/
├── public/
│   └── audio/
│       └── mi-querido-viejo.mp3       # canción (placeholder hasta grabar)
├── src/
│   ├── assets/
│   │   ├── fotos/                      # 15 fotos (optimizadas vía astro:assets)
│   │   ├── videos/                     # 3 videos + posters
│   │   └── escudo-u.svg                # escudo oficial, optimizado con SVGO
│   ├── data/
│   │   └── guion.ts                    # contenido y orden de la experiencia
│   ├── components/
│   │   ├── Portada.astro
│   │   ├── Apertura.astro
│   │   ├── EscenaFoto.astro
│   │   ├── EscenaVideo.astro
│   │   ├── Dedicatoria.astro
│   │   ├── Cierre.astro
│   │   └── ReproductorAudio.astro
│   ├── styles/
│   │   └── animaciones.css
│   ├── layouts/
│   │   └── Base.astro
│   └── pages/
│       └── index.astro                 # recorre el guión y renderiza
├── astro.config.mjs
├── tailwind.config.ts
└── package.json
```

## 6. Modelo de datos: el "guión"

Todo el contenido y su orden viven en un único archivo, `src/data/guion.ts`. Editarlo no requiere tocar componentes. Se modela con una **unión discriminada** para que el compilador obligue a manejar cada tipo de escena.

```ts
export type Familiar = "mamá" | "Cesar" | "Steven";

export type Escena =
  | { tipo: "frase"; texto: string }
  | { tipo: "foto"; imagen: string; frase?: string; familiar?: Familiar }
  | { tipo: "video"; video: string; poster: string; frase?: string; familiar?: Familiar };

export const guion: Escena[] = [ /* ... */ ];

export const dedicatoria = {
  texto: "…",                               // mensaje de parte de todos
  firma: "Gaby, Cesar, Steven y Gianpierre",
};
```

`index.astro` recorre `guion` con un `switch` sobre `escena.tipo` y renderiza el componente correspondiente.

## 7. Audio

- Un único elemento `<audio loop>` vive en el layout y **no se desmonta** durante el recorrido.
- El **autoplay con sonido está bloqueado** por los navegadores; requiere un gesto del usuario. Por eso la portada exige un toque ("Tocar para comenzar"), que:
  1. Llama a `audio.play()` (gesto válido para la política de autoplay).
  2. Hace fade-out de la portada y habilita el recorrido.
- Control flotante 🔊 para silenciar/reactivar en cualquier momento.
- Mientras la canción no esté grabada, se usa un MP3 placeholder; al grabarla se reemplaza **un solo archivo**.

## 8. Animaciones

- **Principal:** `animation-timeline: view()` en `animaciones.css`. Reveals y parallax sutil al entrar al viewport, sin JavaScript.
- **Fallback:** `IntersectionObserver` mínimo (API nativa, no librería) que agrega la clase `.visible` en navegadores sin soporte de scroll-timeline. Mejora progresiva: en el mejor caso es óptimo, en el peor sigue funcionando.

## 9. Identidad visual

Paleta "álbum vintage" que coincide con el crema de Universitario de Deportes (el papá es hincha).

| Rol | Color |
|-----|-------|
| Fondo crema | `#F4ECDF` |
| Fondo alterno | `#EAD9BF` |
| Acento granate (U) | `#6E1F2E` |
| Granate claro | `#8A2A3C` |
| Tinta (texto) | `#4A3826` |
| Texto suave | `#7A6450` |

- **Guiño a la U, sutil:** el crema ya es la base vintage y a la vez el color del club. El granate entra como acento (botones, pies de foto, firmas, divisores). El **escudo** se reserva para el cierre, como broche — no como fondo. Las fotos siguen siendo las protagonistas.
- Tipografía: serif para títulos (tono de carta), sans para texto corrido. (Familias a definir en implementación.)

## 10. Assets

| Asset | Estado |
|-------|--------|
| 15 fotos | Disponibles (`/fotos`), pendiente seleccionar/ordenar y optimizar |
| 3 videos | Disponibles, pendiente comprimir + generar posters |
| Canción "Mi Querido Viejo" (voz de Gianpierre) | **Pendiente de grabar** — placeholder mientras tanto |
| Escudo de la U | Descargado y optimizado con SVGO (`assets/escudo-u.svg`) |

Optimización: fotos y videos pasan por `astro:assets` (`<Image>`) → WebP, lazy-load, dimensiones fijas (evita layout shift).

## 11. Accesibilidad

- El escudo se renderiza con `role="img"` y `aria-label` descriptivo.
- Botones reales (`<button>`), foco gestionado, contraste validado entre tinta y crema.
- Respeto a `prefers-reduced-motion`: si el usuario lo activa, se reducen las animaciones de scroll.

## 12. Fuera de alcance (YAGNI)

- Sin audio individual de cada familiar.
- Sin secciones de dedicatoria por persona.
- Sin backend, base de datos, ni autenticación. Es estático.
- Sin internacionalización: el texto va en español neutral.

## 13. Pendientes del usuario antes de implementar

1. Grabar la canción (o confirmar placeholder temporal).
2. Escribir el texto de la **apertura**, las **frases** del recorrido y la **dedicatoria final**.
3. Seleccionar y ordenar las fotos/videos; indicar cuáles llevan pie de foto familiar.
