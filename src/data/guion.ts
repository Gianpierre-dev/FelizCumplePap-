// Texto de display libre (se renderiza tal cual en el pie de foto, no es una clave de dominio).
export type Familiar = string;

export type Escena =
  | { tipo: "frase"; texto: string }
  | { tipo: "foto"; imagen: string; frase?: string; familiar?: Familiar }
  | { tipo: "video"; video: string; poster: string; frase?: string; familiar?: Familiar };

// El orden de este arreglo es el orden del recorrido.
// Editar AQUÍ no requiere tocar componentes.
export const guion: Escena[] = [
  // ── Capítulo 1: Celebrar juntos ──
  { tipo: "frase", texto: "Aunque hoy estés lejos, toda tu familia está contigo." },
  { tipo: "foto", imagen: "foto-02.webp", frase: "Celebrar contigo siempre fue lo mejor." },
  { tipo: "foto", imagen: "foto-03.webp" },
  { tipo: "foto", imagen: "foto-06.webp" },
  { tipo: "foto", imagen: "foto-04.webp", frase: "Tus tres hijos, siempre a tu lado." },
  { tipo: "foto", imagen: "foto-05.webp" },

  // ── Capítulo 2: Lo cotidiano ──
  { tipo: "frase", texto: "Cada momento contigo es un regalo." },
  { tipo: "foto", imagen: "foto-07.webp", frase: "Hasta una ida al cine contigo es una fiesta." },
  { tipo: "foto", imagen: "foto-09.webp" },
  { tipo: "video", video: "video-01.mp4", poster: "video-01.webp" },

  // ── Capítulo 3: Las aventuras ──
  { tipo: "frase", texto: "Y cuántos caminos recorrimos juntos…" },
  { tipo: "foto", imagen: "foto-10.webp" },
  { tipo: "foto", imagen: "foto-11.webp" },
  { tipo: "foto", imagen: "foto-12.webp" },
  { tipo: "foto", imagen: "foto-13.webp" },
  { tipo: "foto", imagen: "foto-14.webp" },

  // ── Capítulo 4: La pasión que nos diste ──
  { tipo: "frase", texto: "Y nos heredaste una pasión que nos une para siempre." },
  { tipo: "foto", imagen: "foto-08.webp" },
  { tipo: "foto", imagen: "foto-15.webp", frase: "Y dale U, papá. Gracias por tanto." },

  // foto-01 (cine, muy oscura) quedó fuera del recorrido; el archivo sigue disponible.
  // Ajusta libremente: frases, orden y pies de foto (familiar: "mamá", "Cesar", "Steven", etc.).
];

export const dedicatoria = {
  texto:
    "Papá, hoy desde el Perú te abrazamos fuerte. Gracias por ser nuestro ejemplo. " +
    "Aunque el mar nos separe, te llevamos siempre con nosotros. Feliz cumpleaños.",
  firma: "Gaby, Cesar, Steven y Gianpierre",
};
