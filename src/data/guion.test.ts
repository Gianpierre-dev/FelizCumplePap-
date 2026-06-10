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
