// Texto de display libre (se renderiza tal cual en el pie de foto, no es una clave de dominio).
export type Familiar = string;

export type Escena =
  | { tipo: "frase"; texto: string }
  | { tipo: "foto"; imagen: string; frase?: string; familiar?: Familiar }
  | { tipo: "video"; video: string; poster: string; frase?: string; familiar?: Familiar };

// El orden de este arreglo es el orden del recorrido.
// Editar AQUÍ no requiere tocar componentes.
export const guion: Escena[] = [
  { tipo: "frase", texto: "Aunque hoy estés lejos, toda tu familia está contigo." },
  { tipo: "foto", imagen: "foto-01.webp" },
  { tipo: "foto", imagen: "foto-02.webp" },
  { tipo: "foto", imagen: "foto-03.webp" },
  { tipo: "foto", imagen: "foto-04.webp" },
  { tipo: "foto", imagen: "foto-05.webp" },
  { tipo: "frase", texto: "Cada recuerdo contigo es un regalo." },
  { tipo: "foto", imagen: "foto-06.webp" },
  { tipo: "foto", imagen: "foto-07.webp" },
  { tipo: "foto", imagen: "foto-08.webp" },
  { tipo: "video", video: "video-01.mp4", poster: "video-01.webp" },
  { tipo: "foto", imagen: "foto-09.webp" },
  { tipo: "foto", imagen: "foto-10.webp" },
  { tipo: "frase", texto: "La distancia no borra lo que somos: tu familia." },
  { tipo: "foto", imagen: "foto-11.webp" },
  { tipo: "foto", imagen: "foto-12.webp" },
  { tipo: "foto", imagen: "foto-13.webp" },
  { tipo: "foto", imagen: "foto-14.webp" },
  { tipo: "foto", imagen: "foto-15.webp", frase: "Gracias por tanto, papá." },
  // Ajusta libremente: frases, orden y pies de foto (familiar: "mamá", "Cesar", "Steven", etc.).
];

export const dedicatoria = {
  texto:
    "Papá, hoy desde el Perú te abrazamos fuerte. Gracias por ser nuestro ejemplo. " +
    "Aunque el mar nos separe, te llevamos siempre con nosotros. Feliz cumpleaños.",
  firma: "Gaby, Cesar, Steven y Gianpierre",
};
