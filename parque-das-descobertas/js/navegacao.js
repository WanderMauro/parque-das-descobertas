/* =========================================================
   navegacao.js - Troca de telas
   ========================================================= */
const Navegacao = {
  telaAtual: "tela-inicio",   // id da tela que está aparecendo

  // Mostra a tela com o id informado e esconde as outras
  ir(idTela) {
    const nova = document.getElementById(idTela);

    // Se a tela ainda não foi criada, avisa em vez de quebrar
    if (!nova) {
      UI.mensagem("Em construção... 🚧");
      return;
    }

    document.getElementById(this.telaAtual).classList.remove("ativa");
    nova.classList.add("ativa");
    this.telaAtual = idTela;

    // Avisa as mecânicas que a nova tela já está visível.
    document.dispatchEvent(new CustomEvent("telaalterada", {
      detail: { id: idTela }
    }));
  }
};
