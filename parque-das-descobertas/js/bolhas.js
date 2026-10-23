/* =========================================================
   bolhas.js - Estoura visualmente a bolha escolhida.
   O Quiz continua responsável por validar a resposta.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("jogo").addEventListener("click", (evento) => {
    const bolha = evento.target.closest(".bolha-certa");
    if (!bolha) return;

    bolha.style.transform = "scale(1.35)";
    bolha.style.opacity = "0";
  });
});
