/* =========================================================
   botoes.js - Coloca os assets reais nos botões do jogo.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  function usarAsset(seletor, arquivo, descricao) {
    document.querySelectorAll(seletor).forEach((botao) => {
      const imagem = document.createElement("img");
      imagem.src = `assets/img/${arquivo}`;
      imagem.alt = descricao;

      botao.classList.add("botao-com-asset");
      botao.appendChild(imagem);
    });
  }

  const telasComFundoLimpo = [
    "#tela-inicio", "#tela-modos", "#tela-facil-5", "#tela-facil-6",
    "#tela-facil-7", "#tela-facil-8", "#tela-facil-9", "#tela-em-construcao"
  ];

  telasComFundoLimpo.forEach((tela) => {
    usarAsset(`${tela} [data-acao="inicio"]`, "botao-home.png", "Início");
    usarAsset(`${tela} [data-acao="som"]`, "botao-musica.png", "Som");
  });
  usarAsset('#tela-inicio [data-ir="tela-modos"]', "botao-jogar.png", "Jogar");
  usarAsset('#tela-em-construcao [data-ir="tela-modos"]', "botao-home.png", "Escolher modo");

  usarAsset('#tela-modos [data-ir="tela-facil-1"]', "modo-facil.png", "Modo fácil");
  usarAsset('#tela-modos [data-ir="tela-medio-1"]', "modo-medio.png", "Modo médio");
  usarAsset('#tela-modos [data-ir="tela-dificil-1"]', "modo-dificil.png", "Modo difícil");
});
