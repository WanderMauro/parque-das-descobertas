/* =========================================================
   trem.js - Completa visualmente a sequência do trem.
   As mensagens de acerto e erro continuam centralizadas no Quiz.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("jogo").addEventListener("click", (evento) => {
    const opcao = evento.target.closest(".opcao-trem");
    if (!opcao || opcao.dataset.resposta !== "certa") return;

    const tela = opcao.closest(".tela-trem");
    const vagaFinal = tela.querySelector(".vagao-4");
    vagaFinal.textContent = opcao.textContent;
    vagaFinal.classList.add("completo");
  });
});
