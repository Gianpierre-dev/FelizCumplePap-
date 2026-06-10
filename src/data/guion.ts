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
