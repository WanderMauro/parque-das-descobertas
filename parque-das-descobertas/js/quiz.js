/* =========================================================
   quiz.js - Lógica de acerto e erro das fases
   Funciona com botões que têm data-resposta="certa" ou "errada".
   Se for certa, e tiver data-proxima="id-da-tela", avança para ela.
   ========================================================= */
const Quiz = {
  // Tempo (ms) de espera antes de avançar, para a criança ver o "Acertou!"
  atrasoAvanco: 900,

  // Chamado quando clicam em um botão de resposta
  responder(botao) {
    const certa = botao.dataset.resposta === "certa";

    if (certa) {
      UI.mensagem("Muito bem! 🎉", "acerto");
      Audio_.efeito(Audio_.arquivoAcerto);

      // Avança para a próxima tela, se houver
      const proxima = botao.dataset.proxima;
      if (proxima) {
        setTimeout(() => Navegacao.ir(proxima), this.atrasoAvanco);
      }
    } else {
      UI.mensagem("Tente de novo! 💪", "erro");
      Audio_.efeito(Audio_.arquivoErro);
    }
  }
};
