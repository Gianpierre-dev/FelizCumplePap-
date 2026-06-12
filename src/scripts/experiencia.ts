// Inicia la música tras el gesto del usuario (política de autoplay),
// controla el mute y aplica el fallback de revelado.

// Marca que el JS está activo: habilita el bloqueo de scroll y el control de la portada.
document.documentElement.classList.add("js");

function iniciarExperiencia(): void {
  const audio = document.querySelector<HTMLAudioElement>("#cancion");
  const botonComenzar = document.querySelector<HTMLButtonElement>("[data-comenzar]");
  const portada = document.querySelector<HTMLElement>("[data-portada]");

  const botonMute = document.querySelector<HTMLButtonElement>("[data-mute]");

  botonComenzar?.addEventListener("click", () => {
    void audio?.play().catch(() => undefined);
    portada?.classList.add("oculto");
    document.body.style.overflow = "auto";
    portada?.setAttribute("inert", "");
    document.querySelector<HTMLElement>("main")?.focus();
    botonMute?.classList.add("sonando");
  });

  botonMute?.addEventListener("click", () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    botonMute.setAttribute("aria-pressed", String(audio.muted));
    botonMute.textContent = audio.muted ? "🔇" : "🔊";
    botonMute.classList.toggle("sonando", !audio.muted);
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
