/* =========================================================
   labirinto.js - Leva o coelhinho até a cenoura.
   ========================================================= */
const Labirinto = {
  coelhinho: null,
  pointerId: null,
  deslocamentoX: 0,
  deslocamentoY: 0,

  iniciar() {
    document.querySelectorAll(".coelhinho-labirinto").forEach((coelhinho) => {
      coelhinho.addEventListener("pointerdown", (evento) => this.pegar(evento, coelhinho));
    });

    document.addEventListener("pointermove", (evento) => this.mover(evento));
    document.addEventListener("pointerup", () => this.soltar());
    document.addEventListener("pointercancel", () => this.soltar());
  },

  pegar(evento, coelhinho) {
    if (evento.button !== 0 || this.coelhinho) return;

    const tela = coelhinho.closest(".tela-labirinto");
    if (!tela.classList.contains("ativa") || tela.dataset.concluida) return;

    evento.preventDefault();
    const retangulo = coelhinho.getBoundingClientRect();
    this.coelhinho = coelhinho;
    this.pointerId = evento.pointerId;
    this.deslocamentoX = evento.clientX - retangulo.left;
    this.deslocamentoY = evento.clientY - retangulo.top;
    coelhinho.setPointerCapture(evento.pointerId);
    coelhinho.classList.add("arrastando");
    Audio_.tocarMusica();
  },

  mover(evento) {
    if (!this.coelhinho || evento.pointerId !== this.pointerId) return;

    const area = this.coelhinho.closest(".area-labirinto");
    const retangulo = area.getBoundingClientRect();
    const esquerda = evento.clientX - retangulo.left - this.deslocamentoX;
    const topo = evento.clientY - retangulo.top - this.deslocamentoY;
    const coelho = this.coelhinho.getBoundingClientRect();
    const largura = coelho.width;
    const altura = coelho.height;

    this.coelhinho.style.left = (Math.max(0, Math.min(esquerda, retangulo.width - largura)) / retangulo.width * 100) + "%";
    this.coelhinho.style.top = (Math.max(0, Math.min(topo, retangulo.height - altura)) / retangulo.height * 100) + "%";
  },

  soltar(evento) {
    if (!this.coelhinho || evento.pointerId !== this.pointerId) return;

    const coelhinho = this.coelhinho;
    const tela = coelhinho.closest(".tela-labirinto");
    const cenoura = tela.querySelector(".cenoura-labirinto");
    coelhinho.classList.remove("arrastando");
    this.coelhinho = null;
    this.pointerId = null;

    if (!this.toca(coelhinho.getBoundingClientRect(), cenoura.getBoundingClientRect()) || tela.dataset.concluida) return;

    tela.dataset.concluida = "sim";
    UI.mensagem("O coelhinho encontrou a cenoura! 🎉", "acerto");
    Audio_.efeito(Audio_.arquivoAcerto);

    const proxima = tela.dataset.proxima;
    if (proxima && document.getElementById(proxima)) {
      setTimeout(() => Navegacao.ir(proxima), Quiz.atrasoAvanco);
    }
  },

  toca(item, alvo) {
    return item.left < alvo.right && item.right > alvo.left &&
           item.top < alvo.bottom && item.bottom > alvo.top;
  }
};

document.addEventListener("DOMContentLoaded", () => Labirinto.iniciar());
