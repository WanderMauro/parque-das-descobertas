/* =========================================================
   audio.js - Música de fundo e efeitos sonoros
   Coloque os arquivos de som em assets/audio/
   ========================================================= */
const Audio_ = {
  // ---- CONFIGURAÇÃO: nomes dos arquivos (troque quando tiver os seus) ----
  arquivoMusica: "assets/audio/musica-fundo.mp3",
  arquivoAcerto: "assets/audio/acerto.mp3",
  arquivoErro:   "assets/audio/erro.mp3",

  mudo: false,      // estado do botão de som
  musica: null,     // objeto de áudio da música

  // Cria a música (chamado uma vez no início)
  iniciar() {
    this.musica = new Audio(this.arquivoMusica);
    this.musica.loop = true;       // repete sem parar
    this.musica.volume = 0.4;      // 0 a 1
  },

  // Navegadores bloqueiam som antes do 1º clique, então tocamos após a primeira interação
  tocarMusica() {
    if (this.mudo || !this.musica) return;
    // catch: se o arquivo ainda não existir, o jogo não quebra
    this.musica.play().catch(() => {});
  },

  // Liga/desliga todo o som (botão do alto-falante)
  alternarSom() {
    this.mudo = !this.mudo;
    if (this.mudo) this.musica.pause();
    else this.tocarMusica();
    UI.mensagem(this.mudo ? "Som desligado" : "Som ligado");
  },

  // Toca um efeito curto (acerto, erro, etc.)
  efeito(arquivo) {
    if (this.mudo) return;
    new Audio(arquivo).play().catch(() => {});
  }
};
