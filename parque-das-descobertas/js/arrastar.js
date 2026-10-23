/* =========================================================
   arrastar.js - Mecânica reutilizável de arrastar e soltar
   A fase só termina quando todos os itens estão no lugar certo.
   ========================================================= */
const Arrastar = {
  itemAtivo: null,
  deslocamentoX: 0,
  deslocamentoY: 0,

  iniciar() {
    document.querySelectorAll(".tela-arrastar").forEach((tela) => {
      tela.querySelectorAll(".item-arrastavel").forEach((item) => {
        item.addEventListener("pointerdown", (evento) => this.pegar(evento, item));
      });
    });

    document.addEventListener("pointermove", (evento) => this.mover(evento));
    document.addEventListener("pointerup", () => this.soltar());
    document.addEventListener("pointercancel", () => this.soltar());
  },

  pegar(evento, item) {
    const tela = item.closest(".tela-arrastar");
    if (!tela.classList.contains("ativa")) return;

    const itemRect = item.getBoundingClientRect();
    this.itemAtivo = item;
    this.deslocamentoX = evento.clientX - itemRect.left;
    this.deslocamentoY = evento.clientY - itemRect.top;
    item.setPointerCapture(evento.pointerId);
    item.classList.add("arrastando");
    Audio_.tocarMusica();
  },

  mover(evento) {
    if (!this.itemAtivo) return;

    const tela = this.itemAtivo.closest(".tela-arrastar");
    const telaRect = tela.getBoundingClientRect();
    const largura = this.itemAtivo.offsetWidth;
    const altura = this.itemAtivo.offsetHeight;
    const esquerda = evento.clientX - telaRect.left - this.deslocamentoX;
    const topo = evento.clientY - telaRect.top - this.deslocamentoY;

    const x = Math.max(0, Math.min(esquerda, telaRect.width - largura));
    const y = Math.max(0, Math.min(topo, telaRect.height - altura));

    this.itemAtivo.style.left = (x / telaRect.width * 100) + "%";
    this.itemAtivo.style.top = (y / telaRect.height * 100) + "%";
  },

  soltar() {
    if (!this.itemAtivo) return;

    const item = this.itemAtivo;
    const tela = item.closest(".tela-arrastar");
    item.classList.remove("arrastando");
    this.itemAtivo = null;
    this.verificar(tela);
  },

  verificar(tela) {
    const caixa = tela.querySelector(".alvo-caixa").getBoundingClientRect();
    const ursinho = tela.querySelector("[data-item='ursinho']");
    const bola = tela.querySelector("[data-item='bola']");
    const ursinhoNaCaixa = this.estaDentro(ursinho.getBoundingClientRect(), caixa);
    const bolaForaDaCaixa = !this.toca(bola.getBoundingClientRect(), caixa);

    ursinho.classList.toggle("correto", ursinhoNaCaixa);
    bola.classList.toggle("correto", bolaForaDaCaixa);

    if (!ursinhoNaCaixa || !bolaForaDaCaixa || tela.dataset.concluida) return;

    tela.dataset.concluida = "sim";
    UI.mensagem("Muito bem! Você encontrou o lugar certo! 🎉", "acerto");
    Audio_.efeito(Audio_.arquivoAcerto);

    // A próxima fase será exibida automaticamente quando ela for adicionada.
    const proxima = tela.dataset.proxima;
    if (proxima && document.getElementById(proxima)) {
      setTimeout(() => Navegacao.ir(proxima), Quiz.atrasoAvanco);
    }
  },

  estaDentro(item, alvo) {
    return item.left >= alvo.left && item.right <= alvo.right &&
           item.top >= alvo.top && item.bottom <= alvo.bottom;
  },

  toca(item, alvo) {
    return item.left < alvo.right && item.right > alvo.left &&
           item.top < alvo.bottom && item.bottom > alvo.top;
  }
};

document.addEventListener("DOMContentLoaded", () => Arrastar.iniciar());
