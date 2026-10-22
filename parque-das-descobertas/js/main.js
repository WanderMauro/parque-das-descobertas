/* =========================================================
   main.js - Liga tudo: escuta todos os cliques do jogo
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  Audio_.iniciar();

  // Um único "ouvinte" no palco resolve o clique de TODOS os botões invisíveis
  document.getElementById("jogo").addEventListener("click", (evento) => {
    const botao = evento.target.closest(".hotspot");
    if (!botao) return;                       // clicou fora de um botão

    Audio_.tocarMusica();                     // 1º clique libera a música

    // 1) Botão que leva a outra tela
    if (botao.dataset.ir) {
      Navegacao.ir(botao.dataset.ir);
      return;
    }

    // 2) Botão de resposta de quiz
    if (botao.dataset.resposta) {
      Quiz.responder(botao);
      return;
    }

    // 3) Botões de ação global
    switch (botao.dataset.acao) {
      case "inicio":  Navegacao.ir("tela-inicio"); break;
      case "som":     Audio_.alternarSom();        break;
      case "narrar":  UI.mensagem("🔊 Narração em breve"); break; // TODO: tocar áudio da pergunta
    }
  });

  // Tecla "D" liga/desliga o modo debug (mostra os botões invisíveis)
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d") document.body.classList.toggle("debug");
  });
});
