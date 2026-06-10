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
