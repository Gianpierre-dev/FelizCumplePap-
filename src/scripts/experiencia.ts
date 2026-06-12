// Controla la entrada desde la portada y aplica el fallback de revelado.

// Marca que el JS está activo: habilita el bloqueo de scroll y el control de la portada.
document.documentElement.classList.add("js");

function iniciarExperiencia(): void {
  const botonComenzar = document.querySelector<HTMLButtonElement>("[data-comenzar]");
  const portada = document.querySelector<HTMLElement>("[data-portada]");

  botonComenzar?.addEventListener("click", () => {
    portada?.classList.add("oculto");
    document.body.style.overflow = "auto";
    portada?.setAttribute("inert", "");
    document.querySelector<HTMLElement>("main")?.focus();
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
