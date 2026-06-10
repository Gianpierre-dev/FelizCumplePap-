# Feliz Cumpleaños, Papá — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una landing estática mobile-first que reproduce un recorrido cinematográfico de fotos/videos familiares con música de fondo, como regalo de cumpleaños.

**Architecture:** Astro estático (cero JS por defecto). El contenido vive en un único archivo de datos (`guion.ts`) que `index.astro` recorre para renderizar componentes por tipo de escena. Animaciones con CSS scroll-driven nativo + fallback IntersectionObserver. Audio con un único `<audio>` en el layout, iniciado por el gesto del usuario en la portada.

**Tech Stack:** Astro 5, TypeScript estricto, Tailwind CSS v4, Vitest (solo para la lógica del guión), pnpm. Cero librerías de animación.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/data/guion.ts` | Tipos de escena + datos (orden y contenido) + dedicatoria |
| `src/data/guion.test.ts` | Validación del guión (lógica testeable) |
| `src/data/assets.ts` | Resolución de fotos/videos vía `import.meta.glob` |
| `src/layouts/Base.astro` | HTML base, fuentes, `<audio>`, estilos globales |
| `src/components/Portada.astro` | Overlay de bienvenida + botón que inicia audio |
| `src/components/Apertura.astro` | Frase de apertura |
| `src/components/EscenaFoto.astro` | Foto optimizada + frase + pie familiar |
| `src/components/EscenaVideo.astro` | Video + poster + frase + pie familiar |
| `src/components/Dedicatoria.astro` | Mensaje final firmado |
| `src/components/Cierre.astro` | Escudo + mensaje + botón "volver a ver" |
| `src/components/ReproductorAudio.astro` | Control flotante mute/unmute |
| `src/styles/global.css` | Tokens de paleta (Tailwind v4 `@theme`) |
| `src/styles/animaciones.css` | Scroll-driven + reveals |
| `src/scripts/experiencia.ts` | Lógica de inicio de audio, mute, fallback IO |
| `src/pages/index.astro` | Ensambla el recorrido recorriendo el guión |

---

### Task 1: Scaffold del proyecto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`

- [ ] **Step 1: Crear el proyecto Astro mínimo**

Run:
```bash
cd C:/dev/gian/FelizCumplePap-
pnpm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
```
Expected: crea `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`. Si advierte que el directorio no está vacío (existen `fotos/`, `wireframes/`, `docs/`, `assets/`), elegir "Continue".

- [ ] **Step 2: Instalar dependencias (Tailwind v4, fuentes, Vitest)**

Run:
```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add @fontsource-variable/fraunces @fontsource-variable/inter
pnpm add -D vitest
```
Expected: dependencias añadidas sin errores.

- [ ] **Step 3: Configurar Astro + Tailwind v4 vía Vite**

Reemplazar `astro.config.mjs`:
```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Verificar que el proyecto arranca**

Run: `pnpm astro check && pnpm build`
Expected: build exitoso, sin errores de tipos.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold proyecto Astro con Tailwind v4 y Vitest"
```

---

### Task 2: Paleta y estilos globales

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Definir tokens de paleta con Tailwind v4 `@theme`**

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/inter";

@theme {
  --color-crema: #f4ecdf;
  --color-crema-alt: #ead9bf;
  --color-granate: #6e1f2e;
  --color-granate-claro: #8a2a3c;
  --color-tinta: #4a3826;
  --color-tinta-suave: #7a6450;
  --font-titulo: "Fraunces Variable", serif;
  --font-texto: "Inter Variable", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-crema);
}

body {
  margin: 0;
  font-family: var(--font-texto);
  color: var(--color-tinta);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Verificar que compila**

Run: `pnpm build`
Expected: build exitoso.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: paleta vintage y fuentes en estilos globales"
```

---

### Task 3: Modelo de datos del guión (TDD)

**Files:**
- Create: `src/data/guion.ts`
- Test: `src/data/guion.test.ts`

- [ ] **Step 1: Escribir el test que falla**

```ts
// src/data/guion.test.ts
import { describe, it, expect } from "vitest";
import { guion, dedicatoria, type Escena } from "./guion";

describe("guion", () => {
  it("no está vacío", () => {
    expect(guion.length).toBeGreaterThan(0);
  });

  it("toda escena tiene un tipo válido", () => {
    const tipos = new Set(["frase", "foto", "video"]);
    for (const escena of guion) {
      expect(tipos.has(escena.tipo)).toBe(true);
    }
  });

  it("las fotos referencian un archivo de imagen", () => {
    const fotos = guion.filter((e): e is Extract<Escena, { tipo: "foto" }> => e.tipo === "foto");
    for (const foto of fotos) {
      expect(foto.imagen).toMatch(/\.(jpe?g|png|webp)$/i);
    }
  });

  it("la dedicatoria está firmada por la familia", () => {
    expect(dedicatoria.firma).toContain("Gianpierre");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `pnpm vitest run src/data/guion.test.ts`
Expected: FAIL — `Cannot find module './guion'`.

- [ ] **Step 3: Implementar el modelo de datos**

```ts
// src/data/guion.ts
export type Familiar = "mamá" | "Cesar" | "Steven";

export type Escena =
  | { tipo: "frase"; texto: string }
  | { tipo: "foto"; imagen: string; frase?: string; familiar?: Familiar }
  | { tipo: "video"; video: string; poster: string; frase?: string; familiar?: Familiar };

// El orden de este arreglo es el orden del recorrido.
// Editar AQUÍ no requiere tocar componentes.
export const guion: Escena[] = [
  { tipo: "frase", texto: "Aunque hoy estés lejos, toda tu familia está contigo." },
  { tipo: "foto", imagen: "foto-01.webp", frase: "Donde empezó todo." },
  { tipo: "foto", imagen: "foto-02.webp", familiar: "mamá" },
  { tipo: "foto", imagen: "foto-03.webp", familiar: "Cesar" },
  { tipo: "video", video: "video-01.mp4", poster: "video-01.webp", familiar: "Steven" },
  { tipo: "foto", imagen: "foto-04.webp", frase: "Gracias por tanto." },
  // El usuario completará el resto con sus 15 fotos + 3 videos.
];

export const dedicatoria = {
  texto:
    "Papá, hoy desde el Perú te abrazamos fuerte. Gracias por ser nuestro ejemplo. " +
    "Aunque el mar nos separe, te llevamos siempre con nosotros. Feliz cumpleaños.",
  firma: "Gaby, Cesar, Steven y Gianpierre",
};
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `pnpm vitest run src/data/guion.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/guion.ts src/data/guion.test.ts
git commit -m "feat: modelo de datos del guión con validación"
```

---

### Task 4: Resolución de assets (fotos/videos)

**Files:**
- Create: `src/data/assets.ts`

Astro optimiza imágenes que importa como módulos. Como el guión usa nombres en texto, resolvemos cada nombre a su `ImageMetadata` con `import.meta.glob`.

- [ ] **Step 1: Implementar el resolutor de assets**

```ts
// src/data/assets.ts
import type { ImageMetadata } from "astro";

const imagenesGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/fotos/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

const postersGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/videos/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

function indexar(glob: Record<string, { default: ImageMetadata }>): Map<string, ImageMetadata> {
  const mapa = new Map<string, ImageMetadata>();
  for (const [ruta, modulo] of Object.entries(glob)) {
    const nombre = ruta.split("/").pop()!;
    mapa.set(nombre, modulo.default);
  }
  return mapa;
}

const imagenes = indexar(imagenesGlob);
const posters = indexar(postersGlob);

export function resolverImagen(nombre: string): ImageMetadata {
  const imagen = imagenes.get(nombre);
  if (!imagen) throw new Error(`Foto no encontrada en src/assets/fotos: ${nombre}`);
  return imagen;
}

export function resolverPoster(nombre: string): ImageMetadata {
  const poster = posters.get(nombre);
  if (!poster) throw new Error(`Poster no encontrado en src/assets/videos: ${nombre}`);
  return poster;
}

// Los videos se sirven desde /public/videos para streaming; devolvemos su ruta pública.
export function rutaVideo(nombre: string): string {
  return `/videos/${nombre}`;
}
```

- [ ] **Step 2: Crear carpetas de assets y colocar placeholders**

Run:
```bash
mkdir -p src/assets/fotos src/assets/videos public/videos public/audio
```
Mover el escudo ya optimizado a su lugar definitivo:
```bash
mv assets/escudo-u.svg src/assets/escudo-u.svg
```
El usuario colocará luego sus fotos (`foto-01.webp`…), videos (`public/videos/video-01.mp4`), posters (`src/assets/videos/video-01.webp`) y la canción (`public/audio/mi-querido-viejo.mp3`).

- [ ] **Step 3: Commit**

```bash
git add src/data/assets.ts src/assets/escudo-u.svg
git commit -m "feat: resolución de fotos, posters y videos"
```

---

### Task 5: Layout base con audio

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Implementar el layout**

```astro
---
// src/layouts/Base.astro
import "../styles/global.css";
import "../styles/animaciones.css";

interface Props {
  titulo: string;
}
const { titulo } = Astro.props;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content="Un regalo de cumpleaños de toda tu familia." />
  </head>
  <body>
    <slot />
    <audio id="cancion" src="/audio/mi-querido-viejo.mp3" loop preload="auto"></audio>
    <script src="../scripts/experiencia.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: build exitoso (aunque falten assets reales).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: layout base con elemento de audio"
```

---

### Task 6: Animaciones nativas

**Files:**
- Create: `src/styles/animaciones.css`

- [ ] **Step 1: Implementar reveals scroll-driven + fallback**

```css
/* src/styles/animaciones.css */
/* Estado base: oculto, listo para revelarse */
.revelar {
  opacity: 0;
  transform: translateY(24px);
}

/* Navegadores con scroll-driven animations: revelado automático al entrar */
@supports (animation-timeline: view()) {
  .revelar {
    animation: aparecer linear both;
    animation-timeline: view();
    animation-range: entry 5% cover 30%;
  }
}

/* Fallback: la clase .visible (añadida por IntersectionObserver) revela con transición */
@supports not (animation-timeline: view()) {
  .revelar {
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .revelar.visible {
    opacity: 1;
    transform: none;
  }
}

@keyframes aparecer {
  to {
    opacity: 1;
    transform: none;
  }
}

/* Parallax sutil para imágenes a pantalla completa */
.parallax {
  animation: subir linear both;
  animation-timeline: view();
}
@keyframes subir {
  from { transform: scale(1.08) translateY(2%); }
  to { transform: scale(1.08) translateY(-2%); }
}

/* Respeto a usuarios que reducen movimiento */
@media (prefers-reduced-motion: reduce) {
  .revelar,
  .parallax {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/animaciones.css
git commit -m "feat: animaciones scroll-driven con fallback y reduced-motion"
```

---

### Task 7: Script de experiencia (audio + fallback IO)

**Files:**
- Create: `src/scripts/experiencia.ts`

- [ ] **Step 1: Implementar la lógica de cliente**

```ts
// src/scripts/experiencia.ts
// Inicia la música tras el gesto del usuario (política de autoplay),
// controla el mute y aplica el fallback de revelado.

function iniciarExperiencia(): void {
  const audio = document.querySelector<HTMLAudioElement>("#cancion");
  const botonComenzar = document.querySelector<HTMLButtonElement>("[data-comenzar]");
  const portada = document.querySelector<HTMLElement>("[data-portada]");

  botonComenzar?.addEventListener("click", () => {
    void audio?.play().catch(() => undefined);
    portada?.classList.add("oculto");
    document.body.style.overflow = "auto";
  });

  const botonMute = document.querySelector<HTMLButtonElement>("[data-mute]");
  botonMute?.addEventListener("click", () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    botonMute.setAttribute("aria-pressed", String(audio.muted));
    botonMute.textContent = audio.muted ? "🔇" : "🔊";
  });
}

function activarFallbackRevelado(): void {
  if (CSS.supports("animation-timeline: view()")) return;
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarExperiencia();
  activarFallbackRevelado();
});
```

- [ ] **Step 2: Verificar build**

Run: `pnpm build`
Expected: build exitoso.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/experiencia.ts
git commit -m "feat: inicio de audio, control de mute y fallback de revelado"
```

---

### Task 8: Componente Portada

**Files:**
- Create: `src/components/Portada.astro`

- [ ] **Step 1: Implementar la portada**

```astro
---
// src/components/Portada.astro
---
<section
  data-portada
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-crema px-6 text-center transition-opacity duration-700"
>
  <p class="mb-3 rounded-full border border-granate/40 px-3 py-1 text-xs text-granate">🎈 13 de junio</p>
  <h1 class="font-titulo text-3xl font-semibold text-tinta">Feliz cumpleaños, papá</h1>
  <p class="mt-2 text-sm text-tinta-suave">Toda tu familia, desde el Perú</p>
  <button
    data-comenzar
    type="button"
    class="mt-6 rounded-full bg-granate px-6 py-3 text-sm font-semibold text-crema"
  >
    ▶ Tocar para comenzar
  </button>
  <p class="mt-2 text-xs text-tinta-suave">(con sonido)</p>
</section>

<style>
  :global([data-portada].oculto) {
    opacity: 0;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Bloquear scroll hasta comenzar**

Añadir a `src/styles/global.css` al final:
```css
body {
  overflow: hidden; /* el script lo libera al tocar "Comenzar" */
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Portada.astro src/styles/global.css
git commit -m "feat: portada con botón de inicio"
```

---

### Task 9: Componentes de contenido (Apertura, Foto, Video, Dedicatoria)

**Files:**
- Create: `src/components/Apertura.astro`, `EscenaFoto.astro`, `EscenaVideo.astro`, `Dedicatoria.astro`

- [ ] **Step 1: Apertura**

```astro
---
// src/components/Apertura.astro
interface Props { texto: string }
const { texto } = Astro.props;
---
<section class="flex min-h-screen items-center justify-center px-8">
  <p class="revelar max-w-md text-center font-titulo text-2xl leading-relaxed text-tinta">{texto}</p>
</section>
```

- [ ] **Step 2: EscenaFoto**

```astro
---
// src/components/EscenaFoto.astro
import { Image } from "astro:assets";
import { resolverImagen } from "../data/assets";
import type { Familiar } from "../data/guion";

interface Props {
  imagen: string;
  frase?: string;
  familiar?: Familiar;
}
const { imagen, frase, familiar } = Astro.props;
const fuente = resolverImagen(imagen);
---
<section class="relative flex min-h-screen flex-col">
  <div class="relative flex-1 overflow-hidden">
    <Image src={fuente} alt={frase ?? "Recuerdo familiar"} class="parallax h-full w-full object-cover" />
    {familiar && (
      <span class="absolute bottom-4 left-4 rounded-full border border-granate bg-crema/90 px-3 py-1 text-xs text-granate">
        📍 con {familiar}
      </span>
    )}
  </div>
  {frase && <p class="revelar bg-crema px-6 py-5 text-center font-titulo text-lg text-tinta">{frase}</p>}
</section>
```

- [ ] **Step 3: EscenaVideo**

```astro
---
// src/components/EscenaVideo.astro
import { resolverPoster, rutaVideo } from "../data/assets";
import type { Familiar } from "../data/guion";

interface Props {
  video: string;
  poster: string;
  frase?: string;
  familiar?: Familiar;
}
const { video, poster, frase, familiar } = Astro.props;
const fuentePoster = resolverPoster(poster);
---
<section class="relative flex min-h-screen flex-col">
  <div class="relative flex-1 overflow-hidden bg-black">
    <video
      class="h-full w-full object-cover"
      src={rutaVideo(video)}
      poster={fuentePoster.src}
      controls
      playsinline
      preload="metadata"
    ></video>
    {familiar && (
      <span class="absolute bottom-4 left-4 z-10 rounded-full border border-granate bg-crema/90 px-3 py-1 text-xs text-granate">
        📍 con {familiar}
      </span>
    )}
  </div>
  {frase && <p class="revelar bg-crema px-6 py-5 text-center font-titulo text-lg text-tinta">{frase}</p>}
</section>
```

- [ ] **Step 4: Dedicatoria**

```astro
---
// src/components/Dedicatoria.astro
import { dedicatoria } from "../data/guion";
---
<section class="flex min-h-screen items-center justify-center bg-crema-alt px-8">
  <div class="revelar max-w-md text-center">
    <p class="mb-4 text-xs uppercase tracking-widest text-granate">De tu familia</p>
    <p class="font-titulo text-xl leading-relaxed text-tinta">{dedicatoria.texto}</p>
    <p class="mt-6 font-semibold text-granate">— {dedicatoria.firma}</p>
  </div>
</section>
```

- [ ] **Step 5: Verificar build + commit**

Run: `pnpm build`
Expected: build exitoso.
```bash
git add src/components/Apertura.astro src/components/EscenaFoto.astro src/components/EscenaVideo.astro src/components/Dedicatoria.astro
git commit -m "feat: componentes de apertura, foto, video y dedicatoria"
```

---

### Task 10: Cierre con escudo + reproductor

**Files:**
- Create: `src/components/Cierre.astro`, `src/components/ReproductorAudio.astro`

- [ ] **Step 1: Cierre con escudo inline**

```astro
---
// src/components/Cierre.astro
import EscudoU from "../assets/escudo-u.svg";
import { dedicatoria } from "../data/guion";
---
<section class="flex min-h-screen flex-col items-center justify-center bg-crema px-8 text-center">
  <EscudoU
    width={84}
    height={84}
    role="img"
    aria-label="Escudo del Club Universitario de Deportes"
    class="revelar mb-6"
  />
  <h2 class="font-titulo text-2xl font-semibold text-tinta">Te queremos, papá</h2>
  <p class="mt-1 text-sm text-tinta-suave">{dedicatoria.firma}</p>
  <button
    type="button"
    onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
    class="mt-6 rounded-full border border-granate px-5 py-2 text-sm font-semibold text-granate"
  >
    🔁 Volver a ver
  </button>
</section>
```

Nota: importar `.svg` como componente requiere que Astro lo soporte de forma nativa (Astro 5 lo hace). Verificar en el build.

- [ ] **Step 2: ReproductorAudio (control flotante)**

```astro
---
// src/components/ReproductorAudio.astro
---
<button
  data-mute
  type="button"
  aria-pressed="false"
  aria-label="Silenciar o activar la música"
  class="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-granate bg-crema/90 text-base"
>
  🔊
</button>
```

- [ ] **Step 3: Verificar build + commit**

Run: `pnpm build`
Expected: build exitoso, el SVG se inlinea.
```bash
git add src/components/Cierre.astro src/components/ReproductorAudio.astro
git commit -m "feat: cierre con escudo y control de música"
```

---

### Task 11: Ensamblar index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Recorrer el guión y renderizar por tipo**

```astro
---
// src/pages/index.astro
import Base from "../layouts/Base.astro";
import Portada from "../components/Portada.astro";
import Apertura from "../components/Apertura.astro";
import EscenaFoto from "../components/EscenaFoto.astro";
import EscenaVideo from "../components/EscenaVideo.astro";
import Dedicatoria from "../components/Dedicatoria.astro";
import Cierre from "../components/Cierre.astro";
import ReproductorAudio from "../components/ReproductorAudio.astro";
import { guion } from "../data/guion";
---
<Base titulo="Feliz cumpleaños, papá">
  <Portada />
  <ReproductorAudio />
  <main>
    {
      guion.map((escena) => {
        if (escena.tipo === "frase") return <Apertura texto={escena.texto} />;
        if (escena.tipo === "foto")
          return <EscenaFoto imagen={escena.imagen} frase={escena.frase} familiar={escena.familiar} />;
        // escena.tipo === "video"
        return (
          <EscenaVideo
            video={escena.video}
            poster={escena.poster}
            frase={escena.frase}
            familiar={escena.familiar}
          />
        );
      })
    }
    <Dedicatoria />
    <Cierre />
  </main>
</Base>
```

- [ ] **Step 2: Verificar build + typecheck**

Run: `pnpm astro check && pnpm build`
Expected: sin errores de tipos; la unión discriminada cubre los tres casos.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: ensamblar el recorrido desde el guión"
```

---

### Task 12: Assets placeholder y verificación visual

**Files:**
- Create: placeholders en `src/assets/fotos`, `src/assets/videos`, `public/audio`

- [ ] **Step 1: Generar placeholders mínimos para que el build complete**

Colocar al menos `foto-01.webp`…`foto-04.webp` en `src/assets/fotos/`, `video-01.webp` (poster) en `src/assets/videos/`, `video-01.mp4` en `public/videos/`, y un `mi-querido-viejo.mp3` (silencio) en `public/audio/`. Pueden ser archivos temporales hasta que el usuario entregue los reales.

- [ ] **Step 2: Levantar dev y verificar en el navegador (móvil)**

Run: `pnpm dev`
Verificar manualmente:
- La portada cubre la pantalla y bloquea el scroll.
- Al tocar "Comenzar": suena el audio, la portada se desvanece, el scroll se libera.
- Las escenas se revelan al hacer scroll.
- El pie "📍 con …" aparece solo en escenas con `familiar`.
- El control 🔊 silencia/reactiva.
- El cierre muestra el escudo nítido y "Volver a ver" sube al inicio.

- [ ] **Step 3: Verificar accesibilidad básica**

- `prefers-reduced-motion` activo → sin animaciones, contenido visible.
- El botón de mute cambia `aria-pressed`.
- Contraste tinta/crema legible.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: placeholders de assets para verificación"
```

---

### Task 13: Build de producción

- [ ] **Step 1: Build final + preview**

Run: `pnpm build && pnpm preview`
Expected: build sin errores; preview sirve la página estática.

- [ ] **Step 2: Confirmar cero JS innecesario**

Verificar en el output que solo se incluye el script de experiencia (sin runtime de framework).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: build de producción verificado"
```

---

## Pendientes del usuario (no bloquean la estructura)

1. Grabar y colocar `public/audio/mi-querido-viejo.mp3`.
2. Colocar las 15 fotos en `src/assets/fotos/` y los 3 videos en `public/videos/` (+ posters en `src/assets/videos/`).
3. Completar `src/data/guion.ts`: orden, frases, pies familiares y el texto de la dedicatoria.
4. Definir proveedor de despliegue.
