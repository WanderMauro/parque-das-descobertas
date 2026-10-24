<div align="center">

# 🎡 Parque das Descobertas

### 🌈 Aprender, brincar e descobrir!

**Um jogo educativo e interativo desenvolvido para crianças de 5 a 7 anos.**

![Faixa etária](https://img.shields.io/badge/idade-5%20a%207%20anos-ffb703?style=for-the-badge)
![Atividades](https://img.shields.io/badge/desafios-60-36b6c5?style=for-the-badge)
![Tecnologias](https://img.shields.io/badge/HTML%20%7C%20CSS%20%7C%20JavaScript-7b61ff?style=for-the-badge)

*Um parque de atividades para explorar habilidades de maneira lúdica, respeitando o ritmo de cada criança.*

</div>

---

## 🌟 Sobre o projeto

O **Parque das Descobertas** é um jogo educativo criado para estimular a aprendizagem por meio de desafios visuais, sonoros e interativos.

O jogador entra no parque, escolhe um nível de dificuldade e participa de **20 atividades apresentadas em ordem aleatória**. Cada atividade tem variações conforme o nível escolhido, totalizando **60 desafios (20 por nível)**.

O objetivo é oferecer uma experiência divertida, acessível e acolhedora, na qual a criança possa observar, experimentar, acertar, errar e tentar novamente.

## 🎮 Como jogar

1. Abra o jogo no navegador.
2. Clique em **Jogar**.
3. Escolha a dificuldade: **Fácil**, **Médio** ou **Difícil**.
4. Leia ou escute as instruções e resolva os desafios.
5. Avance pelas atividades até concluir a aventura!

> 💡 **Dica:** para crianças que ainda estão aprendendo a ler, recomenda-se o acompanhamento de um adulto ou educador.

## 🧩 O que a criança encontra no parque?

O jogo reúne diferentes formas de interação e conteúdos, como:

| 🎨 Atividade | 🧠 Habilidade explorada |
|---|---|
| 🍎 Contagem e desafios com maçãs | Quantidades e raciocínio matemático |
| 🐹 Jogo da marmota e rimas | Consciência fonológica |
| 🚂 Trem de padrões | Sequências e reconhecimento de padrões |
| 🧩 Quebra-cabeças | Percepção visual e resolução de problemas |
| 🌀 Labirintos | Atenção e orientação espacial |
| 🎈 Bolhas interativas | Atenção e reconhecimento de respostas |
| 🧠 Jogo da memória | Memória e concentração |
| 🎨 Cores e pintura | Identificação e combinação de cores |
| 👂 Desafios sonoros | Escuta e percepção auditiva |
| 😊 Emoções e associações | Observação e reconhecimento de expressões |

Outras atividades utilizam arrastar e soltar, ligar pontos, sílabas e associação de imagens.

## 🌱 Níveis de dificuldade

| Nível | Proposta | Orientação de uso |
|---|---|---|
| 🌱 **Fácil** | Reconhecimento, comparação e desafios introdutórios | Bom ponto de partida, especialmente aos 5 anos |
| 🎡 **Médio** | Mais atenção, associação e raciocínio | Para crianças com familiaridade com as atividades |
| 🎯 **Difícil** | Desafios com maior complexidade, incluindo multiplicações | Pode exigir mediação, especialmente aos 5 ou 6 anos |

**As idades são referências, não regras.** Cada criança possui um ritmo próprio. O nível mais adequado é aquele que oferece desafios sem provocar frustração excessiva.

## ⏱️ Quanto tempo dura uma partida?

O jogo **não estabelece um tempo fixo** para resolver as atividades. Uma partida de um nível inclui 20 desafios, mas o tempo depende do nível, do tipo de atividade e da experiência do jogador.

Como **referência informal**, uma pessoa que resolveu 6 atividades em 10 minutos levaria cerca de **33 minutos** para concluir 20 atividades no mesmo ritmo. Isso **não é uma média validada com crianças**.

Para uso com crianças de 5 a 7 anos, uma sugestão é realizar sessões de **15 a 25 minutos**, permitindo pausas e acompanhamento quando necessário. Não é obrigatório terminar as 20 atividades de uma vez.

> ❤️ A proposta não é competir por velocidade: aprender com tranquilidade faz parte da brincadeira.

## ✨ Recursos do jogo

- ✅ **60 desafios**, organizados em 3 níveis de dificuldade.
- 🔀 **Ordem aleatória** das atividades em cada partida.
- 🔊 **Recursos de áudio e narração**, incluindo gravações e fala dinâmica quando disponível.
- 🎵 **Música e efeitos sonoros**, com controle de som.
- 🏅 **Estrelas e conquistas** para acompanhar descobertas.
- 🌿 **Modo calmo**, com redução de movimentos.
- 💾 **Registro local de progresso/conquistas** no navegador.
- 📱 Interface com adaptações para diferentes tamanhos de tela.
- 📦 Recursos de **aplicação web instalável/cache offline**, conforme o suporte do navegador e após o carregamento dos arquivos necessários.

**Importante:** o jogo registra conquistas, mas **não restaura exatamente a atividade em que uma partida foi interrompida**.

## 💻 Tecnologias utilizadas

- **HTML5** — estrutura das páginas e dos elementos interativos.
- **CSS3** — visual, responsividade e animações.
- **JavaScript** — lógica dos desafios, interações e progresso.
- **Web App Manifest e Service Worker** — recursos de instalação e cache em navegadores compatíveis.

Não é necessário instalar frameworks nem executar uma etapa de compilação.

## 🚀 Como executar o projeto

1. Faça o download deste repositório ou clone-o:

   ```bash
   git clone URL_DO_SEU_REPOSITORIO
   ```

2. Abra a pasta do projeto.
3. Inicie um servidor local na pasta que contém `index.html`. Por exemplo, com Python:

   ```bash
   python -m http.server 8000
   ```

4. Acesse **http://localhost:8000** no navegador.

> **Observação:** caso o repositório contenha uma pasta `pd`, execute o servidor *dentro dela* ou acesse `http://localhost:8000/pd/`. O uso de servidor local ajuda a testar corretamente recursos como o service worker; abrir `index.html` diretamente pode limitar algumas funções.

## 📁 Estrutura principal

```text
pd/
├── index.html                 # Entrada do jogo
├── manifest.webmanifest       # Configurações da aplicação web
├── sw.js                      # Cache de recursos
├── css/
│   ├── style.css
│   └── ultimate.css
├── js/
│   ├── app.js                 # Atividades e lógica principal
│   └── ultimate.js            # Recursos extras e conquistas
└── assets/
    ├── img/                   # Ilustrações e imagens
    └── audio/                 # Narrações e efeitos de áudio
```

## 🎓 Objetivos educacionais

O jogo busca **estimular**:

- Pensamento lógico e resolução de problemas.
- Contagem, comparação de quantidades e noções matemáticas.
- Percepção auditiva, rimas e consciência fonológica.
- Memória, atenção e reconhecimento de padrões.
- Coordenação motora e interação com elementos na tela.
- Curiosidade, autonomia e confiança para tentar novamente.

Este projeto é um **recurso lúdico complementar** e não substitui o acompanhamento pedagógico.

## 🔎 Estado do projeto e próximos passos

O projeto passou por revisões de código e ajustes de interface, como redução de repetições em perguntas, melhoria de instruções e ajustes no ritmo de algumas animações.

**Testes ainda recomendados antes de uso escolar amplo:** partidas completas em diferentes navegadores e dispositivos; validação de áudio, toque e acessibilidade; observação com crianças de 5, 6 e 7 anos; e avaliação da duração real das atividades.

Melhorias futuras possíveis incluem salvar a atividade exata de uma partida interrompida e medir o tempo de cada desafio, sem aplicar pressão à criança.

## 📷 Imagens do jogo

> Adicione capturas de tela reais do jogo nesta seção quando estiverem disponíveis. Exemplos: tela inicial, escolha de dificuldade e uma atividade. Evite publicar fotos de crianças sem autorização.

## 💖 Considerações finais

O **Parque das Descobertas** foi pensado para transformar pequenas descobertas em momentos de aprendizagem. Mais importante do que terminar rapidamente é **explorar, brincar e aprender no próprio ritmo**.

<div align="center">

### 🎠 Que cada desafio seja uma nova descoberta!

**Feito com dedicação à educação e à aprendizagem lúdica.** 🌟

</div>
