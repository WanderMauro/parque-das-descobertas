/* =========================================================
   ui.js - Mensagens flutuantes na tela
   Uso: UI.mensagem("Acertou!", "acerto")  // tipos: "acerto", "erro" ou nada
   ========================================================= */
const UI = {
  _timer: null,   // guarda o temporizador para não sobrepor mensagens

  mensagem(texto, tipo = "") {
    const el = document.getElementById("mensagem");
    el.textContent = texto;
    el.className = "visivel " + tipo;   // mostra e aplica a cor

    clearTimeout(this._timer);
    // Some depois de 1,5 segundo
    this._timer = setTimeout(() => { el.className = ""; }, 1500);
  }
};
