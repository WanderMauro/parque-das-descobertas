/* =========================================================
   raspadinha.js - Apaga a camada de tinta e revela o prêmio.
   A fase termina quando mais da metade da área foi raspada.
   ========================================================= */
const Raspadinha = {
  pincel: 34,
  tela: null,
  canvas: null,
  contexto: null,
  raspando: false,
  concluida: false,

  iniciar() {
    document.querySelectorAll(".canvas-raspadinha").forEach((canvas) => {
      // Telas escondidas têm largura e altura zero. A cobertura só pode ser
      // desenhada depois que a tela da raspadinha estiver visível.
      if (canvas.closest(".tela").classList.contains("ativa")) this.preparar(canvas);
      canvas.addEventListener("pointerdown", (evento) => this.comecar(evento, canvas));
      canvas.addEventListener("pointermove", (evento) => this.raspar(evento));
      canvas.addEventListener("pointerup", () => this.parar());
      canvas.addEventListener("pointercancel", () => this.parar());
    });

    document.addEventListener("telaalterada", (evento) => {
      const tela = document.getElementById(evento.detail.id);
      if (!tela || !tela.classList.contains("tela-raspadinha")) return;

      tela.querySelectorAll(".canvas-raspadinha").forEach((canvas) => {
        if (!canvas.dataset.preparada) this.preparar(canvas);
      });
    });
  },

  preparar(canvas) {
    const tamanho = window.devicePixelRatio || 1;
    const retangulo = canvas.getBoundingClientRect();
    if (!retangulo.width || !retangulo.height) return;
    const contexto = canvas.getContext("2d");

    canvas.width = Math.round(retangulo.width * tamanho);
    canvas.height = Math.round(retangulo.height * tamanho);
    contexto.scale(tamanho, tamanho);
    contexto.fillStyle = "#c76232";
    contexto.fillRect(0, 0, retangulo.width, retangulo.height);
    canvas.dataset.preparada = "sim";
    canvas.classList.add("preparada");
  },

  comecar(evento, canvas) {
    const tela = canvas.closest(".tela-raspadinha");
    if (!tela.classList.contains("ativa") || tela.dataset.concluida) return;

    if (!canvas.dataset.preparada) this.preparar(canvas);
    if (!canvas.dataset.preparada) return;

    this.tela = tela;
    this.canvas = canvas;
    this.contexto = canvas.getContext("2d");
    this.raspando = true;
    canvas.setPointerCapture(evento.pointerId);
    Audio_.tocarMusica();
    this.apagar(evento);
  },

  raspar(evento) {
    if (!this.raspando) return;
    this.apagar(evento);
  },

  apagar(evento) {
    const retangulo = this.canvas.getBoundingClientRect();
    const x = evento.clientX - retangulo.left;
    const y = evento.clientY - retangulo.top;

    this.contexto.save();
    this.contexto.globalCompositeOperation = "destination-out";
    this.contexto.beginPath();
    this.contexto.arc(x, y, this.pincel, 0, Math.PI * 2);
    this.contexto.fill();
    this.contexto.restore();
  },

  parar() {
    if (!this.raspando) return;
    this.raspando = false;
    if (this.areaRaspada() >= .55) this.revelar();
  },

  areaRaspada() {
    const dados = this.contexto.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    let transparente = 0;
    let total = 0;

    for (let i = 3; i < dados.length; i += 64) {
      total++;
      if (dados[i] === 0) transparente++;
    }

    return transparente / total;
  },

  revelar() {
    if (this.tela.dataset.concluida) return;

    this.tela.dataset.concluida = "sim";
    this.canvas.classList.add("revelada");
    Audio_.efeito(Audio_.arquivoAcerto);

    const proxima = this.tela.dataset.proxima;
    if (proxima && document.getElementById(proxima)) {
      // A criança vê somente a imagem revelada antes de seguir para a fase seguinte.
      setTimeout(() => Navegacao.ir(proxima), 650);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => Raspadinha.iniciar());
