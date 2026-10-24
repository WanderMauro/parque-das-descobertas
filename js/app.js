(() => {
  'use strict';
  // Revisão V20: dublagem gravada por frase, narração consistente e ajustes de acessibilidade.

  const app = document.getElementById('app');
  const toast = document.getElementById('feedback-toast');
  const LEVELS = {
    easy: { label: 'Fácil', emoji: '🌱', cls: 'level-easy' },
    medium: { label: 'Médio', emoji: '🎡', cls: 'level-medium' },
    hard: { label: 'Difícil', emoji: '🎯', cls: 'level-hard' }
  };
  const mechanics = {
    quiz: 'Quiz clássico', mole: 'Jogo da marmota', drag: 'Arrastar e soltar', train: 'Trem de padrões', scratch: 'Raspadinha / revelar',
    clap: 'Palmas e sílabas', maze: 'Mini labirinto', feed: 'Alimentar o Tobi', bubble: 'Estourar bolhas', puzzle: 'Mini quebra-cabeça',
    paint: 'Pintar e misturar cores', match: 'Ligue as colunas', lantern: 'Lanterna no escuro', memory: 'Jogo da memória',
    detective: 'Lupa do detetive', dots: 'Ligue os pontos', soundquiz: 'Quiz sonoro', habitat: 'Arrastar e soltar', emotion: 'Quebra-cabeça de emoções'
  };
  const levelsOrder = ['easy', 'medium', 'hard'];
  const activityArtwork = Object.freeze({
    1:'maca', 2:'toca-topeira', 3:'caixa', 4:'frente-trem', 5:'zebra',
    6:'coelhinho', 7:'labirinto', 8:'tobi', 9:'onda', 10:'sol',
    11:'margarida', 12:'card', 13:'carrinho', 14:'card',
    15:'bola', 16:'arvore', 17:'frente-trem', 18:'galinha',
    19:'onda', 20:'tobi'
  });

  const activities = [
    { id:1, title:'Quantas maçãs?', emoji:'🍎', type:'quiz', short:'Mais, soma e multiplicação com maçãs.', levels:{
      easy:{prompt:'Qual prato tem MAIS maçãs?', instruction:'Compare os pratos e escolha o que tem mais frutas.', plates:[1,2], correct:1, explanation:'Isso mesmo! Duas maçãs são mais do que uma.'},
      medium:{prompt:'Qual prato tem a quantidade de 2 + 2 maçãs?', instruction:'Conte as quatro maçãs e encontre o prato com a quantidade certa.', plates:[3,4,5], correct:1, explanation:'Muito bem! 2 + 2 = 4 maçãs.'},
      hard:{prompt:'Qual prato mostra o resultado de 3 × 3 maçãs?', instruction:'Três vezes três maçãs formam nove maçãs.', plates:[2,4,6,9], correct:3, explanation:'Muito bem! 3 × 3 = 9 maçãs.'}
    }},
    { id:2, title:'Qual rima?', emoji:'🦫', type:'mole', short:'Acerte a marmota com a palavra que rima.', levels:{
      easy:{prompt:'Acerte a marmota que traz uma figura que rima com PATO.', instruction:'Toque na marmota que mostra gato!', options:[['🐱','Gato'],['🐸','Sapo'],['🐻','Urso'],['🦓','Zebra']], correct:0, explanation:'Pato e gato terminam com o mesmo som: “ato”.'},
      medium:{prompt:'Qual palavra rima com BOLA?', instruction:'A marmota certa traz a palavra cola.', options:[['🪢','Cola'],['🏠','Casa'],['🐸','Sapo'],['🧳','Mala']], correct:0, explanation:'Bola e cola rimam: terminam com o som “ola”.'},
      hard:{prompt:'Qual palavra não rima com bola?', instruction:'Três palavras rimam com bola. Encontre cela, a diferente.', options:[['🌀','Mola'],['⚽','Bola'],['🏰','Cela'],['👕','Gola']], correct:2, explanation:'Cela tem som final diferente. Mola, bola e gola rimam.'}
    }},
    { id:3, title:'Dentro ou fora?', emoji:'📦', type:'drag', short:'Posicione objetos nos lugares corretos.', levels:{
      easy:{prompt:'Coloque cada objeto no lugar pedido.', instruction:'Arraste o ursinho para DENTRO da caixa e a bola para FORA.', items:[{id:'bear',emoji:'🧸',label:'Ursinho'},{id:'ball',emoji:'⚽',label:'Bola'}], zones:[{id:'inside',label:'DENTRO da caixa',emoji:'📦'},{id:'outside',label:'FORA da caixa',emoji:'🌳'}], correctMap:{bear:'inside',ball:'outside'}},
      medium:{prompt:'Organize os brinquedos em relação à mesa.', instruction:'Ursinho à ESQUERDA; bola à DIREITA.', items:[{id:'bear',emoji:'🧸',label:'Ursinho'},{id:'ball',emoji:'⚽',label:'Bola'}], zones:[{id:'left',label:'← ESQUERDA',emoji:'🪑'},{id:'right',label:'DIREITA →',emoji:'🪑'}], correctMap:{bear:'left',ball:'right'}},
      hard:{prompt:'Complete a matriz espacial 2 × 2.', instruction:'Ponha o ursinho EM CIMA, na linha VERMELHA, e a bola ABAIXO, na linha AZUL.', items:[{id:'bear',emoji:'🧸',label:'Ursinho'},{id:'ball',emoji:'⚽',label:'Bola'}], zones:[{id:'topLeft',label:'EM CIMA • linha vermelha',emoji:'🟥'},{id:'topRight',label:'EM CIMA • linha vermelha',emoji:'🟥'},{id:'bottomLeft',label:'ABAIXO • linha azul',emoji:'🟦'},{id:'bottomRight',label:'ABAIXO • linha azul',emoji:'🟦'}], correctMap:{bear:['topLeft','topRight'],ball:['bottomLeft','bottomRight']}}
    }},
    { id:4, title:'O que vem depois?', emoji:'🚂', type:'train', short:'Descubra qual vagão vem a seguir.', levels:{
      easy:{prompt:'Complete o padrão do trem.', instruction:'Vermelho, amarelo, vermelho… Qual cor vem agora?', sequence:['🔴','🟡','🔴','❔'], options:['🔴','🟡','🟢'], correct:1, explanation:'O padrão alterna vermelho e amarelo.'},
      medium:{prompt:'Complete o padrão duplo.', instruction:'Observe os pares: vermelho, vermelho, amarelo, amarelo…', sequence:['🔴','🔴','🟡','🟡','🔴','❔'], options:['🔴','🟡','🟢'], correct:0, explanation:'Depois do primeiro vermelho do novo par, vem outro vermelho.'},
      hard:{prompt:'Complete o trem de formas.', instruction:'A sequência se repete: estrela, círculo, quadrado…', sequence:['⭐','🔴','🟦','⭐','🔴','❔'], options:['🟦','⭐','🔴'], correct:0, explanation:'A forma que completa a sequência é o quadrado azul.'}
    }},
    { id:5, title:'Que bichinho é esse?', emoji:'🔎', type:'scratch', short:'Raspe a camada para revelar o animal.', levels:{
      easy:{prompt:'Que animal tem pelo macio?', instruction:'Raspe a camada de papel para revelar o gatinho.', target:'🐱', targetName:'Gatinho', explanation:'O gatinho tem pelo macio e fofinho.'},
      medium:{prompt:'Que animal tem listras no corpo?', instruction:'Raspe a camada de papel para descobrir o animal listrado.', target:'🦓', targetName:'Zebra', explanation:'A zebra é conhecida por suas listras pretas e brancas.'},
      hard:{prompt:'Qual animal possui pele escamosa?', instruction:'Raspe e descubra o animal com pele coberta por escamas.', target:'🐊', targetName:'Jacaré', explanation:'O jacaré tem pele grossa e escamosa.'}
    }},
    { id:6, title:'Vamos bater palmas!', emoji:'👏', type:'clap', short:'Escute a palavra e conte suas palmas.', levels:{
      easy:{prompt:'Quantas palmas tem a palavra bola?', word:'BOLA', split:'BO • LA', syllables:2, instruction:'Ouça a palavra e marque uma palma para cada pedaço.'},
      medium:{prompt:'Quantas palmas tem a palavra CACHORRO?', word:'CACHORRO', split:'CA • CHOR • RO', syllables:3, instruction:'Diga devagar: ca-chor-ro. Quantas partes você escuta?'},
      hard:{prompt:'Qual palavra tem exatamente 4 sílabas?', word:'ABACAXI', split:'A • BA • CA • XI', syllables:4, options:[{word:'ABACAXI',split:'A • BA • CA • XI',syllables:4},{word:'PATO',split:'PA • TO',syllables:2},{word:'CASA',split:'CA • SA',syllables:2},{word:'JANELA',split:'JA • NE • LA',syllables:3}], correct:0, instruction:'Ouça as opções e escolha a palavra que tem quatro pedaços/sílabas.'}
    }},
    { id:7, title:'Qual é o caminho?', emoji:'🧭', type:'maze', short:'Guie o personagem pelo caminho.', levels:{
      easy:{prompt:'Leve o coelhinho até a cenoura.', instruction:'Siga o caminho simples até a saída. Use as setas para mover o personagem.', player:'🐰', goal:'🥕', path:[[6,0],[5,0],[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[1,4],[0,4]]},
      medium:{prompt:'Ajude o carrinho a encontrar a saída.', instruction:'Este labirinto tem mais curvas. Planeje cada movimento e observe os becos sem saída.', player:'🚗', goal:'🏁', path:[[6,1],[5,1],[4,1],[4,2],[4,3],[3,3],[2,3],[2,4],[2,5],[1,5],[0,5]]},
      hard:{prompt:'Guie o peixinho pelo labirinto.', instruction:'Este é o maior labirinto, com mais cruzamentos e becos sem saída. Explore com calma e encontre a saída.', player:'🐠', goal:'🪸', path:[[6,6],[6,5],[5,5],[4,5],[4,4],[3,4],[3,3],[2,3],[2,2],[1,2],[0,2]]}
    }},
    { id:8, title:'Hora de comer!', emoji:'🧸', type:'feed', short:'Escolha alimentos seguindo uma regra.', levels:{
      easy:{prompt:'Dê ao Tobi somente o alimento VERMELHO.', instruction:'Escolha a maçã vermelha e entregue ao ursinho.', foods:[['🍎','Maçã',true],['🍌','Banana madura',false],['🥒','Pepino',false],['🍇','Uvas',false],['🍋','Limão amarelo',false]]},
      medium:{prompt:'Alimente o Tobi com itens que começam com M.', instruction:'Escolha os três alimentos que começam com M: Maçã, Melancia e Melão.', foods:[['🍎','Maçã',true],['🍉','Melancia',true],['🍌','Banana madura',false],['🍇','Uvas',false],['🍒','Acerola',false],['🍈','Melão',true]]},
      hard:{prompt:'Alimente o Tobi com um alimento de 3 sílabas.', instruction:'Diga os nomes em voz alta e escolha PI-PO-CA.', foods:[['🍿','Pipoca',true],['🍞','Pão',false],['🍇','Uva',false],['🍍','Abacaxi',false],['🥥','Coco',false],['🍯','Mel',false]]}
    }},
    { id:9, title:'Estoure as bolhas!', emoji:'🫧', type:'bubble', short:'Encontre o número pedido entre as bolhas que flutuam.', levels:{
      easy:{prompt:'Estoure a bolha com o número 3.', instruction:'Encontre o número pedido entre as bolhas que flutuam.', options:['1','3','5','8'], correct:1},
      medium:{prompt:'Estoure a palavra que rima com BOLA.', instruction:'Procure a palavra COLA, que termina com o mesmo som de BOLA.', options:['CASA','COLA','PATO','MALA'], correct:1},
      hard:{prompt:'Quanto é 5 − 2?', instruction:'Encontre o número pedido entre as bolhas que flutuam.', options:['2','4','3','5'], correct:2}
    }},
    { id:10, title:'Monte o desenho!', emoji:'🧩', type:'puzzle', short:'Encaixe as peças para completar a figura.', levels:{
      easy:{prompt:'Monte o Sol com 4 peças.', instruction:'Arraste cada peça para o espaço que combina ou toque numa peça e depois no espaço.', slots:[{id:'left',label:'Metade esquerda',need:'sunL'},{id:'right',label:'Metade direita',need:'sunR'}], pieces:[{id:'sunR',label:'Sol • direita',emoji:'🌞'},{id:'sunL',label:'Sol • esquerda',emoji:'☀️'}]},
      medium:{prompt:'Monte a borboleta com 6 peças.', instruction:'Arraste cada peça até o espaço certo ou toque na peça e depois no lugar.', slots:[{id:'wing',label:'Asa que falta',need:'mirror'}], pieces:[{id:'wrongWing',label:'Asa diferente',emoji:'🦋'},{id:'mirror',label:'Asa espelhada',emoji:'🪽'}]},
      hard:{prompt:'Monte a árvore com 12 peças.', instruction:'Observe a figura e encaixe cada pedaço no lugar certo. Você consegue!', slots:[{id:'p1',label:'1ª letra',need:'C'},{id:'p2',label:'2ª letra',need:'A1'},{id:'p3',label:'3ª letra',need:'S'},{id:'p4',label:'4ª letra',need:'A2'}], pieces:[{id:'S',label:'S',emoji:'S'},{id:'A2',label:'A',emoji:'A'},{id:'C',label:'C',emoji:'C'},{id:'A1',label:'A',emoji:'A'}]}
    }},
    { id:11, title:'Vamos pintar!', emoji:'🎨', type:'paint', short:'Escolha tintas, misture e pinte.', levels:{
      easy:{prompt:'Pinte o balão de azul.', instruction:'Escolha a tinta azul e toque no balão para pintá-lo.', colors:[['blue','Azul','#3299e8'],['red','Vermelho','#e64a3d'],['yellow','Amarelo','#f4d13f']], regions:[{id:'balloon',label:'Balão',art:'balloon',correct:'blue'}]},
      medium:{prompt:'Misture amarelo e vermelho para fazer LARANJA.', instruction:'Selecione as duas tintas e misture; depois pinte o desenho com a cor resultante.', colors:[['yellow','Amarelo','#f4d13f'],['red','Vermelho','#e64a3d'],['blue','Azul','#3299e8']], regions:[{id:'sun',label:'Sol',art:'sun',correct:'orange'},{id:'flower',label:'Flor',art:'flower',correct:'orange'}], mix:true},
      hard:{prompt:'Pinte seguindo o código de cores.', instruction:'Código: 1 = VERDE e 2 = ROXO. Pinte cada parte conforme o número.', colors:[['green','Verde','#52a94e'],['purple','Roxo','#9861c7'],['orange','Laranja','#f28a3a']], regions:[{id:'wing1',label:'Asa 1',art:'wing1',code:'1',correct:'green'},{id:'wing2',label:'Asa 2',art:'wing2',code:'2',correct:'purple'},{id:'wing3',label:'Asa 3',art:'wing3',code:'1',correct:'green'},{id:'wing4',label:'Asa 4',art:'wing4',code:'2',correct:'purple'}]}
    }},
    { id:12, title:'Quem combina?', emoji:'🔗', type:'match', short:'Ligue cada item ao seu correspondente.', levels:{
      easy:{prompt:'Ligue cada animal ao seu par.', instruction:'Toque num cartão da esquerda e depois no correspondente à direita.', pairs:[{left:'Galinha',li:'🐔',right:'Pintinho',ri:'🐥'},{left:'Cachorro',li:'🐶',right:'Osso',ri:'🦴'}]},
      medium:{prompt:'Ligue a palavra à imagem certa.', instruction:'Encontre a imagem que corresponde a cada palavra escrita.', pairs:[{left:'BOLA',li:'🔤',right:'Bola',ri:'⚽'},{left:'CASA',li:'🔤',right:'Casa',ri:'🏠'}]},
      hard:{prompt:'Associe cada animal ao habitat natural.', instruction:'Ligue todos os animais ao lugar em que vivem.', pairs:[{left:'Peixe azul',li:'🐟',right:'Água',ri:'🌊'},{left:'Camelo',li:'🐪',right:'Deserto',ri:'🏜️'},{left:'Urso-polar',li:'🐻‍❄️',right:'Gelo',ri:'🧊'}]}
    }},
    { id:13, title:'Cadê? Ache na escuridão!', emoji:'🔦', type:'lantern', short:'Ilumine o cenário e encontre o alvo.', levels:{
      easy:{prompt:'Encontre o brinquedo grande no quarto escuro.', instruction:'Mova a lanterna com o dedo ou mouse. Toque no brinquedo quando o encontrar.', targets:[{id:'toy',emoji:'🧸',label:'Brinquedo',x:28,y:65,correct:true},{id:'ball',emoji:'⚽',label:'Bola',x:70,y:35},{id:'book',emoji:'📚',label:'Livro',x:57,y:72},{id:'box',emoji:'📦',label:'Caixa',x:82,y:62}]},
      medium:{prompt:'Encontre a única forma que é um CÍRCULO.', instruction:'Passe a lanterna pelas formas escondidas e selecione o círculo.', targets:[{id:'circle',emoji:'🔵',label:'Círculo',x:27,y:35,correct:true},{id:'square',emoji:'🟦',label:'Quadrado',x:72,y:30},{id:'triangle',emoji:'🔺',label:'Triângulo',x:44,y:72},{id:'star',emoji:'⭐',label:'Estrela',x:80,y:72}]},
      hard:{prompt:'Encontre a letra que inicia a palavra ESCOLA.', instruction:'Use a lupa para localizar a letra E, que aparece no começo de ESCOLA.', targets:[{id:'E',emoji:'E',label:'Letra E',x:24,y:31,correct:true},{id:'A',emoji:'A',label:'Letra A',x:73,y:68},{id:'O',emoji:'O',label:'Letra O',x:58,y:31},{id:'S',emoji:'S',label:'Letra S',x:42,y:67},{id:'M',emoji:'M',label:'Letra M',x:82,y:39}]}
    }},
    { id:14, title:'Jogo da memória', emoji:'🃏', type:'memory', short:'Vire as cartas e encontre pares.', levels:{
      easy:{prompt:'Encontre o par de gatinhos.', instruction:'Vire duas cartas de cada vez até achar os dois gatinhos iguais.', targetKey:'cat',cards:[{id:'cat1',key:'cat',front:'🐱',label:'Gatinho'},{id:'dog1',key:'dog',front:'🐶',label:'Cachorro'},{id:'cat2',key:'cat',front:'🐱',label:'Gatinho'},{id:'bird',key:'bird',front:'🐦',label:'Pássaro'}]},
      medium:{prompt:'Associe a letra A à imagem que começa com A.', instruction:'Vire as cartas e encontre o par A com Avião.', targetKey:'A',cards:[{id:'A',key:'A',front:'A',label:'Letra A'},{id:'plane',key:'A',front:'✈️',label:'Avião'},{id:'ball',key:'B',front:'⚽',label:'Bola'},{id:'house',key:'C',front:'🏠',label:'Casa'}]},
      hard:{prompt:'Associe a conta ao resultado.', instruction:'Encontre o par 2 + 1 e o número 3.', targetKey:'3',cards:[{id:'sum',key:'3',front:'2 + 1',label:'Conta'},{id:'three',key:'3',front:'3',label:'Resultado 3'},{id:'sum2',key:'4',front:'2 + 2',label:'Outra conta'},{id:'four',key:'4',front:'4',label:'Resultado 4'}]}
    }},
    { id:15, title:'Detetive da lupa', emoji:'🔍', type:'detective', short:'Use a lupa para descobrir pequenos detalhes.', levels:{
      easy:{prompt:'Encontre o único peixe virado para a direita.', instruction:'Explore o aquário e toque no peixe que nada para a direita.', targets:[{id:'fish1',emoji:'🐟 ←',x:20,y:34},{id:'fish2',emoji:'🐠 →',x:55,y:60,correct:true},{id:'fish3',emoji:'🐟 ←',x:78,y:27},{id:'fish4',emoji:'🐠 ←',x:36,y:77}]},
      medium:{prompt:'Encontre a fruta amarela escondida na árvore.', instruction:'Explore as folhas e toque na fruta amarela.', targets:[{id:'leaf1',emoji:'🍃',x:38,y:29},{id:'leaf2',emoji:'🌿',x:45,y:41},{id:'fruit',emoji:'🍌',x:58,y:31,correct:true},{id:'leaf3',emoji:'🍀',x:42,y:53},{id:'flower',emoji:'🌼',x:62,y:51}]},
      hard:{prompt:'Encontre todos os pequenos itens escondidos.', instruction:'Procure e selecione a chave, a estrela e o botão escondidos no cenário.', targets:[{id:'key',emoji:'🔑',x:21,y:31,correct:true},{id:'star',emoji:'⭐',x:74,y:34,correct:true},{id:'button',emoji:'🔘',x:52,y:76,correct:true},{id:'leaf',emoji:'🍃',x:42,y:36},{id:'flower',emoji:'🌸',x:82,y:74},{id:'shell',emoji:'🐚',x:24,y:73}]}
    }},
    { id:16, title:'Ligue os pontinhos', emoji:'🔢', type:'dots', short:'Conecte os pontos na ordem certa.', levels:{
      easy:{prompt:'Ligue os pontos de 1 a 3.', instruction:'Toque nos pontos na ordem numérica para completar o desenho.', points:[{x:70,y:195,label:'1'},{x:250,y:50,label:'2'},{x:430,y:195,label:'3'}]},
      medium:{prompt:'Conecte A, B e C em ordem alfabética.', instruction:'Toque nas letras na sequência correta para formar o caminho.', points:[{x:70,y:195,label:'A'},{x:250,y:50,label:'B'},{x:430,y:195,label:'C'}]},
      hard:{prompt:'Complete a sequência mista de números e letras.', instruction:'Siga a sequência: 1 → A → 2 → B → 3 → C.', points:[{x:55,y:190,label:'1'},{x:130,y:60,label:'A'},{x:210,y:190,label:'2'},{x:290,y:60,label:'B'},{x:370,y:190,label:'3'},{x:455,y:60,label:'C'}]}
    }},
    { id:17, title:'Que som é esse?', emoji:'🥁', type:'soundquiz', short:'Ouça os sons e identifique o instrumento.', levels:{
      easy:{prompt:'Qual instrumento faz uma batida forte?', instruction:'Ouça os dois sons e escolha entre bumbo e violão.', samples:['kick','guitar'], options:['Bumbo','Violão'], correct:0},
      medium:{prompt:'Qual instrumento faz um som agudo e metálico?', instruction:'Ouça os sons 1 e 2 e escolha o instrumento correto.', samples:['triangle','drum'], options:['Triângulo','Tambor'], correct:0},
      hard:{prompt:'Qual som pertence a um instrumento de cordas?', instruction:'Escute os dois sons em sequência e identifique o violino.', samples:['drum','violin'], options:['Tambor','Violino'], correct:1}
    }},
    { id:18, title:'Onde eu moro?', emoji:'🌎', type:'habitat', short:'Leve cada animal para o habitat certo.', levels:{
      easy:{prompt:'Leve cada animal ao seu lugar.', instruction:'Arraste o peixe para o MAR e o passarinho para o CÉU.', items:[{id:'fish',emoji:'🐟',label:'Peixe azul'},{id:'bird',emoji:'🐦',label:'Passarinho'}], zones:[{id:'sea',label:'MAR',emoji:'🌊'},{id:'sky',label:'CÉU',emoji:'☁️'}], correctMap:{fish:'sea',bird:'sky'}},
      medium:{prompt:'Classifique os animais por habitat.', instruction:'Arraste o sapo para a ÁGUA e o cachorro para a TERRA.', items:[{id:'frog',emoji:'🐸',label:'Sapo'},{id:'dog',emoji:'🐶',label:'Cachorro'}], zones:[{id:'water',label:'ÁGUA',emoji:'🌊'},{id:'land',label:'TERRA',emoji:'🌳'}], correctMap:{frog:'water',dog:'land'}},
      hard:{prompt:'Organize os animais por bioma.', instruction:'Floresta: macaco. Gelo: urso-polar. Deserto: camelo.', items:[{id:'monkey',emoji:'🐒',label:'Macaco'},{id:'polar',emoji:'🐻‍❄️',label:'Urso-polar'},{id:'camel',emoji:'🐪',label:'Camelo'}], zones:[{id:'forest',label:'FLORESTA',emoji:'🌲'},{id:'ice',label:'GELO',emoji:'🧊'},{id:'desert',label:'DESERTO',emoji:'🏜️'}], correctMap:{monkey:'forest',polar:'ice',camel:'desert'}}
    }},
    { id:19, title:'Estoure as bolhas!', emoji:'🫧', type:'bubble', short:'Encontre o número pedido entre as bolhas que flutuam.', levels:{
      easy:{prompt:'Estoure a bolha com o número 1.', instruction:'Encontre o número pedido entre as bolhas que flutuam.', options:['4','1','3','2'], correct:1},
      medium:{prompt:'Quanto é 1 + 2?', instruction:'Encontre o número pedido entre as bolhas que flutuam.', options:['2','4','3','1'], correct:2},
      hard:{prompt:'Quanto é 4 − 2?', instruction:'Encontre o número pedido entre as bolhas que flutuam.', options:['1','3','2','4'], correct:2}
    }},
    { id:20, title:'Como me sinto?', emoji:'🙂', type:'emotion', short:'Monte a expressão e descubra o sentimento.', levels:{
      easy:{prompt:'Complete a carinha FELIZ.', instruction:'Escolha a peça que forma um sorriso feliz.', options:[['🙂','Feliz'],['🙁','Triste'],['😠','Bravo']], correct:0},
      medium:{prompt:'Monte a expressão pedida triste.', instruction:'Ouça o comando e escolha a carinha triste. Você também pode ouvir a instrução.', options:[['🙂','Feliz'],['🙁','Triste'],['😠','Bravo']], correct:1, speech:'Monte a expressão pedida triste.'},
      hard:{prompt:'Ganhou um presente: como a criança pode se sentir?', instruction:'Pense na situação e escolha a emoção que combina com ela.', options:[['😢','Triste'],['😡','Bravo'],['😊','Feliz']], correct:2, scene:'🎁'}
    }}
  ];

  // V14: 20 tipos de atividade, cada um com uma versão Fácil, Média e Difícil = 60 desafios.
  const CHALLENGES_PER_LEVEL = activities.length;
  const challengeCatalog = levelsOrder.flatMap(level => activities.map(activity => ({
    key: `${activity.id}-${level}`, activityId: activity.id, level,
    title: activity.title, type: activity.type, definition: activity.levels[level]
  })));
  const TOTAL_CHALLENGES = challengeCatalog.length;

  const state = {
    screen:'home', level:'easy', activityIndex:0, score:0, completed:new Set(), complete:false, mechanic:{},
    levelData:null, roundOrder:[], roundPosition:0, roundActive:false, roundMode:'adventure', roundCompleted:new Set(),
    pointerDrag:null, suppressClickUntil:0
  };
  const SAVE_KEY='parque-descobertas-progresso-v3';
  function loadProgress(){
    try { const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');
      if(Array.isArray(saved.completed))state.completed=new Set(saved.completed.filter(k=>/^([1-9]|1[0-9]|20)-(easy|medium|hard)$/.test(k)));
      state.score=Number.isFinite(saved.score)?Math.max(0,Number(saved.score)):state.completed.size*10;
      if(LEVELS[saved.level])state.level=saved.level;
    }catch(e){/* Browsers can disallow local storage. */}
  }
  function saveProgress(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({level:state.level,completed:[...state.completed],score:state.score}));}catch(e){}}
  loadProgress();
  let moleTimerId = null;
  let toastId = null;
  let memoryTimeout = null;
  let audioContext = null;
  let soundEnabled = true;
  let musicEnabled = true;
  let narrationVolume = .6;
  let musicVolume = .19;
  let musicDucked = false;
  let activeNarration = null;
  let narrationToken = 0;
  const CURRICULAR_AUDIO_DIR = 'assets/audio/curricularizacao/';
  // Controlador único de voz: usa apenas gravações, sem SpeechSynthesis.
  function normalizeAudioText(text) {
    return String(text || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[×]/g, ' x ').replace(/[−–—]/g, ' - ')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  const AUDIO_TEXT_ALIASES = Object.freeze({
    'abacaxi': 'a ba ca xi', 'pato': 'pa to', 'casa': 'ca sa', 'bola': 'bo la',
    'cachorro': 'ca chor ro', 'janela': 'ja ne la',
    'monte a expressao triste': 'monte a expressao pedida triste',
    'ouca as opcoes e escolha a palavra que tem quatro pedacos silabas': 'ouca as opcoes e escolha a palavra que tem quatro pedacossilabas'
  });
  function recordedAudioPath(text) {
    const raw = normalizeAudioText(text);
    const key = AUDIO_TEXT_ALIASES[raw] || raw;
    return window.PD_RECORDED_AUDIO && window.PD_RECORDED_AUDIO[key] || null;
  }
  function resolveAudioSource(filename) {
    if (/^(?:\.\/|\/|https?:\/\/|assets\/)/i.test(String(filename))) return String(filename);
    return CURRICULAR_AUDIO_DIR + encodeURIComponent(String(filename));
  }
  function syncMusicVolume() {
    if (typeof bgMusic === 'undefined') return;
    bgMusic.volume = musicDucked ? musicVolume * .22 : musicVolume;
  }
  function duckMusicForVoice() { musicDucked = true; syncMusicVolume(); }
  function restoreMusicAfterVoice() { musicDucked = false; syncMusicVolume(); }

  function stopVoicePlayback() {
    narrationToken++;
    if (activeNarration) {
      activeNarration.onplay = null; activeNarration.onended = null; activeNarration.onerror = null;
      try { activeNarration.pause(); activeNarration.currentTime = 0; } catch (error) {}
      activeNarration = null;
    }
    // Cancel any old browser speech left by an earlier cached version, but never create TTS.
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    restoreMusicAfterVoice();
  }

  function playNarrationFiles(files, fallbackText = '', options = {}) {
    if (!soundEnabled || !Array.isArray(files) || !files.length) return false;
    stopVoicePlayback();
    const token = narrationToken;
    let index = 0, failedCount = 0, playedCount = 0, blocked = false;
    const finish = () => {
      if (token !== narrationToken) return;
      activeNarration = null; restoreMusicAfterVoice();
      // A fallback is allowed only when an exact recorded phrase exists.
      const fallbackPath = fallbackText ? recordedAudioPath(fallbackText) : null;
      if (playedCount === 0 && failedCount >= files.length && fallbackPath && !files.includes(fallbackPath) && !blocked) {
        playNarrationFiles([fallbackPath], '', options);
        return;
      }
      options.onFinished?.();
    };
    const playNext = () => {
      if (token !== narrationToken || !soundEnabled) return;
      if (index >= files.length) { finish(); return; }
      const filename = files[index++];
      const audio = new Audio(resolveAudioSource(filename));
      audio.preload = 'auto'; audio.volume = Math.max(0, Math.min(1, narrationVolume));
      let settled = false; activeNarration = audio;
      const clearActive = () => { if (activeNarration === audio) activeNarration = null; };
      const fail = error => {
        if (settled || token !== narrationToken) return;
        settled = true; clearActive(); audio.onplay = null; audio.onended = null; audio.onerror = null;
        if (error && error.name === 'NotAllowedError') { blocked = true; restoreMusicAfterVoice(); options.onBlocked?.(); return; }
        failedCount++; playNext();
      };
      audio.onplay = () => {
        if (settled || token !== narrationToken) return;
        playedCount++; duckMusicForVoice(); options.onStarted?.();
      };
      audio.onended = () => {
        if (settled || token !== narrationToken) return;
        settled = true; clearActive(); audio.onplay = null; audio.onerror = null; playNext();
      };
      audio.onerror = () => fail(audio.error);
      duckMusicForVoice();
      try { const request=audio.play(); if(request && typeof request.catch==='function') request.catch(fail); }
      catch(error) { fail(error); }
    };
    playNext(); return true;
  }

  function playRecordedText(text, options = {}) {
    const path=recordedAudioPath(text);
    if (!path) {
      if (options.showMissing) showToast('Esta frase ainda não tem uma gravação correspondente.');
      options.onFinished?.(); return false;
    }
    return playNarrationFiles([path], '', options);
  }
  function playRecordedSequence(texts, options = {}) {
    const paths=(texts || []).map(text => recordedAudioPath(text));
    const missing=(texts || []).filter((text, i) => !paths[i]);
    const files=paths.filter(Boolean);
    if (missing.length && options.showMissing) showToast('Há uma frase sem gravação correspondente nesta fase.');
    if (!files.length) { options.onFinished?.(); return false; }
    return playNarrationFiles(files, '', options);
  }
  function playActivityNarration(text) { return playRecordedText(text, { showMissing: true }); }

  const bgMusic = new Audio('assets/musica.mpeg');
  window.__pd = {
    bgMusic, state,
    open: i => openActivity(i),
    say: t => say(t),
    act: () => currentActivity(),
    lvl: () => currentLevel(),
    playNarrationFiles: files => playNarrationFiles(files),
    isNarrating: () => !!activeNarration,
    setVolume: value => {
      narrationVolume = Math.max(0, Math.min(1, Number(value) || 0));
      musicVolume = narrationVolume * .32;
      syncMusicVolume();
      if (activeNarration) activeNarration.volume = narrationVolume;
    },
    stopVoicePlayback,
    reset() { state.completed = new Set(); state.score = 0; saveProgress(); renderHome(); }
  };
  bgMusic.loop = true; bgMusic.volume = musicVolume; bgMusic.preload = 'auto';
  function updateMusic() {
    if (!musicEnabled || !soundEnabled || document.hidden) { bgMusic.pause(); return; }
    syncMusicVolume();
    if (bgMusic.paused) bgMusic.play().catch(() => { /* navegador pode exigir um gesto do usuário */ });
  }
  function say(text) {
    if (!soundEnabled) return false;
    return playRecordedText(text);
  }

  let homeIntroEligible = true;
  let homeIntroStarted = false;
  let homeIntroPending = false;
  function closeInitialIntro() { homeIntroEligible = false; homeIntroPending = false; }
  function startOpeningNarration() {
    if (!homeIntroEligible || homeIntroStarted || !soundEnabled || state.screen !== 'home') return;
    homeIntroStarted = true;
    homeIntroPending = false;
    playNarrationFiles(['Inicio 1.mp3', 'Inicio 2.mp3'], 'Bem-vindo ao Parque das Descobertas. Uma aventura para brincar e descobrir.', {
      onFinished: () => { closeInitialIntro(); },
      onBlocked: () => { if (homeIntroEligible) { homeIntroStarted = false; homeIntroPending = true; } }
    });
  }
  function unlockAndMaybeStartHomeAudio(event) {
    updateMusic();
    const target = event && event.target;
    const action = target && target.closest ? target.closest('[data-action]')?.dataset.action : '';
    const navigationActions = ['start-adventure', 'random-round', 'show-attractions', 'choose-level', 'sound', 'home', 'menu'];
    if (homeIntroPending && homeIntroEligible && state.screen === 'home' && soundEnabled && !navigationActions.includes(action)) {
      startOpeningNarration();
    }
  }
  document.addEventListener('pointerdown', unlockAndMaybeStartHomeAudio, true);
  document.addEventListener('keydown', unlockAndMaybeStartHomeAudio, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoicePlayback(); updateMusic(); });
  function toggleSound() {
    soundEnabled = !soundEnabled; musicEnabled = soundEnabled;
    if (!soundEnabled) {
      stopVoicePlayback();
      if (audioContext) { const oldContext = audioContext; audioContext = null; try { oldContext.close(); } catch (error) {} }
    }
    window.dispatchEvent(new CustomEvent('pd:soundchange', { detail: { enabled: soundEnabled } }));
    updateMusic();
    showToast(soundEnabled ? 'Som e música ativados' : 'Som e música desligados');
    app.querySelectorAll('[data-action="sound"]').forEach(b => {
      b.setAttribute('aria-label', soundEnabled ? 'Desligar som e música' : 'Ligar som e música');
      b.title = soundEnabled ? 'Som ligado' : 'Som desligado';
      b.classList.toggle('sound-off', !soundEnabled);
    });
  }
  function brandMarkup(){return '<img class="brand-logo" src="assets/img/ilustracoes/titulo.webp" alt="Parque das Descobertas">';}
  function soundIconMarkup(){return '<span class="audio-state-icon" aria-hidden="true"><img src="assets/img/ilustracoes/botao-musica.webp" alt=""><span class="audio-mute-slash"></span></span>'; }
  function musicButton(){return `<button type="button" class="scene-icon music-toggle ${soundEnabled?'':'sound-off'}" data-action="sound" aria-label="${soundEnabled?'Desligar':'Ligar'} som e música" title="${soundEnabled?'Som ligado':'Som desligado'}">${soundIconMarkup()}</button>`;}


  function esc(value){ return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function currentActivity(){ return activities[state.activityIndex]; }
  function currentLevel(){ return state.levelData || currentActivity().levels[state.level]; }
  function shuffleArray(list){
    const result = list.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function shuffledIndexes(length){ return shuffleArray(Array.from({length},(_,i)=>i)); }
  function pick(list){ return list[Math.floor(Math.random()*list.length)]; }
  function makeCountQuestion(level, usedQuestions=[]) {
    const base=activities[0].levels[level];
    let prompt, instruction, explanation, values, target;
    if(level==='easy'){
      let a=1+Math.floor(Math.random()*5), b=1+Math.floor(Math.random()*5);
      while(a===b || usedQuestions.includes([a,b].sort((x,y)=>x-y).join('-'))){a=1+Math.floor(Math.random()*5);b=1+Math.floor(Math.random()*5);}
      target=Math.max(a,b); values=[a,b];
      prompt='Qual prato tem mais maçãs?';
      instruction='Compare os pratos e escolha o que tem mais frutas.';
      explanation=`Isso! ${target} maçãs são mais do que ${Math.min(a,b)}.`;
    }else if(level==='medium'){
      // Só contas que possuem pergunta e dica gravadas: 1+3, 2+2 ou 1+4.
      const sums=[[1,3],[2,2],[1,4]];
      const available=sums.filter(pair=>!usedQuestions.includes(pair.join("+")));
      const sum=pick(available.length?available:sums);
      target=sum[0]+sum[1];
      prompt=`Qual prato tem a quantidade de ${sum[0]} + ${sum[1]} maçãs?`;
      instruction=target===4
        ? 'Conte as quatro maçãs e encontre o prato com a quantidade certa.'
        : 'Conte as cinco maçãs e encontre o prato com a quantidade certa.';
      values=target===4?[3,4,5]:[3,5,6];
      explanation=`Muito bem! ${sum[0]} + ${sum[1]} = ${target} maçãs.`;
    }else{
      // Há pergunta gravada para 3×2, mas a única dica matemática gravada correta
      // é para 3×3. Mantemos 3×3 para não associar a fala errada à conta.
      target=9;
      prompt='Qual prato mostra o resultado de 3 × 3 maçãs?';
      instruction='Três vezes três maçãs formam nove maçãs.';
      values=[6,8,9,10];
      explanation='Muito bem! 3 × 3 = 9 maçãs.';
    }
    values=shuffleArray([...new Set(values)]);
    if(level!=='easy'){for(let v=1;values.length<3&&v<=10;v++){if(!values.includes(v))values.push(v);}}
    if(!values.includes(target))values[Math.floor(Math.random()*values.length)]=target;
    values=shuffleArray(values);
    const questionKey=level==='hard'?prompt.match(/\d+ × \d+/)?.[0]:level==='medium'?prompt.match(/\d+ \+ \d+/)?.[0]:values.slice().sort((a,b)=>a-b).join('-');
    return {...base,prompt,instruction,plates:values,correct:values.indexOf(target),explanation,questionKey};
  }
  function makeMoleQuestion(level,excludeTarget=null){
    const base=activities[1].levels[level];let target,options,prompt,instruction,explanation;
    const chooseDifferent=(list)=>{const pool=list.filter(v=>v!==excludeTarget);return pick(pool.length?pool:list);};
    if(level==='easy'){
      target=chooseDifferent(['Gato','Rato']);
      const pictures={'Gato':'🐱','Rato':'🐭'};
      options=[[pictures[target],target],['🐸','Sapo'],['🐻','Urso'],['🦓','Zebra']];
      prompt='Acerte a marmota que traz uma figura que rima com PATO.';
      instruction=`Toque na marmota que mostra ${target.toLowerCase()}!`;
      explanation=`Pato e ${target.toLowerCase()} rimam: os dois terminam com o som “ato”.`;
    }else if(level==='medium'){
      target=chooseDifferent(['Cola','Mola']);
      const visuals={'Cola':'🧴','Mola':'🌀','Rola':'🕊️'};
      options=[[visuals[target],target],...([['🏠','Casa'],['🐸','Sapo'],['🧳','Mala']])];
      prompt='Qual palavra rima com BOLA?';instruction=`A marmota certa traz a palavra ${target.toLowerCase()}.`;
      explanation=`Bola e ${target.toLowerCase()} rimam pelo som final.`;
    }else{
      target=chooseDifferent(['Cela','Mala','Casa']);
      const visuals={'Cela':'🏰','Mala':'🧳','Casa':'🏠'};
      const rhymes=shuffleArray([['🌀','Mola'],['⚽','Bola'],['🧴','Cola'],['👕','Gola']]).slice(0,3);
      options=[[visuals[target],target],...rhymes];
      prompt='Qual palavra não rima com bola?';instruction=`Três palavras rimam com bola. Encontre ${target.toLowerCase()}, a diferente.`;
      explanation=`${target} não termina com o mesmo som de bola, mola, cola e gola.`;
    }
    const pairs=shuffleArray(options);
    return {...base,prompt,instruction,options:pairs,correct:pairs.findIndex(o=>o[1]===target),explanation,variantKey:target};
  }
  function makeBubbleQuestion(activityId,level,excludeVariant=null){
    const base=activities[activityId-1].levels[level];let target,prompt,instruction,options,variantKey;
    const chooseDifferent=(list)=>{const pool=list.filter(v=>String(v)!==String(excludeVariant));return pick(pool.length?pool:list);};
    if(activityId===9&&level==='easy'){
      target=chooseDifferent([1,3,4,5]);variantKey=String(target);
      prompt=`Estoure a bolha com o número ${target}.`;instruction='Encontre o número pedido entre as bolhas que flutuam.';
      const distractors=shuffleArray([1,2,3,4,5,6,7,8].filter(n=>n!==target)).slice(0,3);options=shuffleArray([target,...distractors].map(String));
    }else if(activityId===9&&level==='medium'){
      target=chooseDifferent(['COLA','MOLA','ROLA']);variantKey=target;
      prompt='Estoure a palavra que rima com BOLA.';instruction=`Procure a palavra ${target}, que termina com o mesmo som de BOLA.`;
      const distractors=shuffleArray(['CASA','PATO','MALA','ROLAR']).slice(0,3);
      options=shuffleArray([target,...distractors]);
    }else if(activityId===9&&level==='hard'){
      const eq=chooseDifferent(['5−2','6−3','7−4']);const [a,b]=eq.split('−').map(Number);target=a-b;variantKey=eq;
      prompt=`Quanto é ${a} − ${b}?`;instruction='Resolva a subtração e estoure a bolha com o resultado.';
      options=makeNumberOptions(target);
    }else if(activityId===19&&level==='easy'){
      target=chooseDifferent([1,3,4,5]);variantKey=String(target);
      prompt=`Estoure a bolha com o número ${target}.`;instruction='Encontre o número pedido entre as bolhas que flutuam.';
      options=shuffleArray([target,...shuffleArray([0,1,2,3,4,5,6].filter(n=>n!==target)).slice(0,3)].map(String));
    }else if(activityId===19&&level==='medium'){
      const eq=chooseDifferent(['1+2','2+3']);const [a,b]=eq.split('+').map(Number);target=a+b;variantKey=eq;
      prompt=`Quanto é ${a} + ${b}?`;instruction='Some os números e estoure a bolha com a resposta certa.';options=makeNumberOptions(target);
    }else{
      const eq=chooseDifferent(['4−2','5−2','6−3','7−3']);const [a,b]=eq.split('−').map(Number);target=a-b;variantKey=eq;
      prompt=`Quanto é ${a} − ${b}?`;instruction='Resolva a subtração e estoure a bolha com o resultado.';options=makeNumberOptions(target);
    }
    return {...base,prompt,instruction,options,correct:options.indexOf(String(target)),variantKey,explanation:`Muito bem! A resposta é ${target}.`};
  }
  function makeNumberOptions(target){
    const all=Array.from({length:11},(_,i)=>String(i)).filter(v=>Number(v)!==target);
    return shuffleArray([String(target),...shuffleArray(all).slice(0,3)]);
  }
  function makeSyllableQuestion(level){
    const base=activities[5].levels[level];
    if(level==='easy'){
      return {...base,prompt:'Quantas palmas tem a palavra bola?',word:'BOLA',split:'BO • LA',syllables:2};
    }
    if(level==='medium'){
      return {...base,prompt:'Quantas palmas tem a palavra CACHORRO?',word:'CACHORRO',split:'CA • CHOR • RO',syllables:3};
    }
    const opts=[
      {word:'ABACAXI',split:'A • BA • CA • XI',syllables:4},
      {word:'PATO',split:'PA • TO',syllables:2},
      {word:'CASA',split:'CA • SA',syllables:2},
      {word:'JANELA',split:'JA • NE • LA',syllables:3}
    ];
    return {...base,prompt:'Qual palavra tem exatamente 4 sílabas?',word:'ABACAXI',split:'A • BA • CA • XI',syllables:4,options:opts,correct:0};
  }
  function makeMazeBranches(solution, branchCount){
    const open=new Map(solution.map(([r,c])=>[`${r},${c}`,[r,c]]));
    const key=([r,c])=>`${r},${c}`;
    const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
    const candidates=()=>{
      const result=[];
      for(const cell of solution.slice(1,-1)) for(const [dr,dc] of dirs){
        const next=[cell[0]+dr,cell[1]+dc];
        if(next[0]<0||next[0]>6||next[1]<0||next[1]>6||open.has(key(next)))continue;
        let neighbors=0;for(const [ar,ac] of dirs)if(open.has(`${next[0]+ar},${next[1]+ac}`))neighbors++;
        if(neighbors===1)result.push({cell,next,dr,dc});
      }
      return result;
    };
    for(let n=0;n<branchCount;n++){
      const opts=candidates();if(!opts.length)break;
      const {next,dr,dc}=pick(opts);open.set(key(next),next);
      // Sometimes extend a branch one more cell, keeping it a dead end.
      if(Math.random()<.55){const end=[next[0]+dr,next[1]+dc];if(end[0]>=0&&end[0]<=6&&end[1]>=0&&end[1]<=6&&!open.has(key(end))){let neighbors=0;for(const [ar,ac] of dirs)if(open.has(`${end[0]+ar},${end[1]+ac}`))neighbors++;if(neighbors===1)open.set(key(end),end);}}
    }
    return [...open.values()];
  }
  function seededRandom(seed){
    let value=seed>>>0;
    return function(){value=(value+0x6D2B79F5)>>>0;let t=value;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
  }
  function shuffleWithRandom(list,rng){
    const result=list.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function generateMazeLayout(level,rng=Math.random){
    const rooms=level==='easy'?3:level==='medium'?4:5;
    const size=rooms*2-1;
    const grid=Array.from({length:size},()=>Array(size).fill(false));
    const visited=new Set(['0,0']);
    const stack=[[0,0]];grid[0][0]=true;
    const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
    while(stack.length){
      const [r,c]=stack[stack.length-1];
      const opts=shuffleWithRandom(dirs.map(([dr,dc])=>[r+dr,c+dc,dr,dc])
        .filter(([nr,nc])=>nr>=0&&nc>=0&&nr<rooms&&nc<rooms&&!visited.has(`${nr},${nc}`)),rng);
      if(!opts.length){stack.pop();continue;}
      const [nr,nc,dr,dc]=opts[0];visited.add(`${nr},${nc}`);stack.push([nr,nc]);
      grid[r*2+dr][c*2+dc]=true;grid[nr*2][nc*2]=true;
    }
    const path=[];for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(grid[r][c])path.push([r,c]);
    const queue=[[0,0]],prev=new Map([['0,0',null]]),key=([r,c])=>`${r},${c}`;
    for(let i=0;i<queue.length;i++){
      const [r,c]=queue[i];if(r===size-1&&c===size-1)break;
      for(const [dr,dc] of dirs){const nxt=[r+dr,c+dc],k=key(nxt);if(nxt[0]<0||nxt[1]<0||nxt[0]>=size||nxt[1]>=size||!grid[nxt[0]][nxt[1]]||prev.has(k))continue;prev.set(k,key([r,c]));queue.push(nxt);}
    }
    const solution=[];let cursor=key([size-1,size-1]);
    while(cursor){const [r,c]=cursor.split(',').map(Number);solution.push([r,c]);cursor=prev.get(cursor);}
    solution.reverse();
    return {path,solutionPath:solution,mazeSize:size};
  }
  const mazeVariantCache=Object.create(null);
  function pickMazeVariant(level){
    if(!mazeVariantCache[level]){
      const levelSeed=({easy:17011,medium:27011,hard:37011})[level]||47011;
      mazeVariantCache[level]=Array.from({length:5},(_,index)=>({
        ...generateMazeLayout(level,seededRandom(levelSeed+(index+1)*7919)),
        variant:index+1,variantCount:5
      }));
    }
    return JSON.parse(JSON.stringify(pick(mazeVariantCache[level])));
  }

  function randomizeLevelData(levelData, type){
    const l=JSON.parse(JSON.stringify(levelData));
    if(Array.isArray(l.options)){
      const order=shuffledIndexes(l.options.length);
      l.options=order.map(i=>l.options[i]);
      if(Number.isInteger(l.correct))l.correct=order.indexOf(l.correct);
      if(type==='soundquiz'&&Array.isArray(l.samples))l.samples=order.map(i=>l.samples[i]);
    }
    if(Array.isArray(l.plates)){
      const correctValue=l.plates[l.correct];
      l.plates=shuffleArray(l.plates);
      l.correct=l.plates.indexOf(correctValue);
    }
    if(Array.isArray(l.cards))l.cards=shuffleArray(l.cards);
    if(Array.isArray(l.foods))l.foods=shuffleArray(l.foods);
    if(Array.isArray(l.items))l.items=shuffleArray(l.items);
    if(Array.isArray(l.targets))l.targets=shuffleArray(l.targets);
    if(Array.isArray(l.pieces))l.pieces=shuffleArray(l.pieces);
    if(Array.isArray(l.pairs))l.pairs=shuffleArray(l.pairs);
    if(Array.isArray(l.colors))l.colors=shuffleArray(l.colors);
    if(Array.isArray(l.regions))l.regions=shuffleArray(l.regions);
    return l;
  }
  function completionKey(activityId, level){ return `${activityId}-${level}`; }
  function showToast(message){ toast.textContent=message;toast.classList.add('visible');clearTimeout(toastId);toastId=setTimeout(()=>toast.classList.remove('visible'),2600); }
  function stopTimers(){ if(moleTimerId){clearTimeout(moleTimerId);moleTimerId=null;} if(memoryTimeout){clearTimeout(memoryTimeout);memoryTimeout=null;} }
  function clearPointerDrag(){const ghost=document.querySelector('.drag-ghost');if(ghost)ghost.remove();app.querySelectorAll('.drag-hover,.drag-source').forEach(el=>el.classList.remove('drag-hover','drag-source'));state.pointerDrag=null;}
  function renderHome() {
    stopTimers(); stopVoicePlayback(); state.screen = 'home';
    app.innerHTML = `
      <section class="full-scene home-screen" aria-label="Entrada do Parque das Descobertas">
        <div class="home-art-stage">
          <img class="home-full-art" src="assets/img/telas/tela1-inicio.png" alt="Parque das Descobertas, com o botão Jogar no portal e a bilheteria ao centro">
          <button type="button" class="home-hit home-ticket-hit" data-action="show-attractions" aria-label="Bilheteria: escolher a dificuldade"></button>
          <button type="button" class="home-hit home-sound-hit ${soundEnabled ? '' : 'sound-off'}" data-action="sound" aria-label="${soundEnabled ? 'Desligar' : 'Ligar'} som e música" title="${soundEnabled ? 'Som ligado' : 'Som desligado'}"></button>
          <div class="home-mobile-layout">
            <img class="home-mobile-backdrop" src="assets/img/ilustracoes/fundo-inicio.webp" alt="" aria-hidden="true">
            <img class="home-mobile-logo" src="assets/img/ilustracoes/titulo.webp" alt="Parque das Descobertas">
            <p class="home-mobile-welcome">Uma aventura para descobrir!</p>
            <img class="home-mobile-mascot" src="assets/img/ilustracoes/urso-inicio-canto.webp" alt="Tobi, o ursinho mascote">
            <button type="button" class="home-play-shared" data-action="start-adventure" aria-label="Jogar e começar a aventura">▶ Jogar</button>
            <button type="button" class="home-mobile-sound ${soundEnabled ? '' : 'sound-off'}" data-action="sound" aria-label="${soundEnabled ? 'Desligar' : 'Ligar'} som e música" title="${soundEnabled ? 'Som ligado' : 'Som desligado'}">${soundIconMarkup()}</button>
          </div>
        </div>
      </section>`;
  }
  function renderLevelSelect(playGuide=false){stopTimers();stopVoicePlayback();state.screen='levels';app.innerHTML=`
    <section class="full-scene attraction-screen" aria-label="Escolha de atração e dificuldade">
      <img class="attraction-backdrop" src="assets/img/ilustracoes/fundo-inicio.webp" alt="" aria-hidden="true">
      <img class="attraction-mascot" src="assets/img/ilustracoes/urso-inicio-canto.webp" alt="" aria-hidden="true">
      <header class="attraction-toolbar">
        <button type="button" class="scene-icon" data-action="home" aria-label="Voltar ao início"><img src="assets/img/ilustracoes/botao-home.webp" alt=""></button>
        <div class="attraction-wordmark">PARQUE <span>das</span> DESCOBERTAS</div>
        <button type="button" class="scene-icon sound-toggle ${soundEnabled?'':'sound-off'}" data-action="sound" aria-label="${soundEnabled?'Desligar':'Ligar'} som e música" title="${soundEnabled?'Som ligado':'Som desligado'}">${soundIconMarkup()}</button>
      </header>
      <div class="attraction-heading">
        <span class="attraction-eyebrow">ESCOLHA SUA AVENTURA</span>
        <h1>QUAL ATRAÇÃO<br><span>VAMOS VISITAR?</span></h1>
        <p>Comece devagar ou escolha um desafio!</p>
      </div>
      <div class="attraction-grid" role="group" aria-label="Escolha o nível de dificuldade">
        <button type="button" class="attraction-card ${state.level==='easy'?'selected':''}" data-level="easy" aria-pressed="${state.level==='easy'}"><img src="assets/img/ilustracoes/facil.webp" alt="Fácil — Carrossel, descobertas tranquilas"><span class="attraction-check">✓ Selecionado</span></button>
        <button type="button" class="attraction-card ${state.level==='medium'?'selected':''}" data-level="medium" aria-pressed="${state.level==='medium'}"><img src="assets/img/ilustracoes/medio.webp" alt="Médio — Roda-gigante, novos desafios"><span class="attraction-check">✓ Selecionado</span></button>
        <button type="button" class="attraction-card ${state.level==='hard'?'selected':''}" data-level="hard" aria-pressed="${state.level==='hard'}"><img src="assets/img/ilustracoes/dificil.webp" alt="Difícil — Tiro ao alvo, para pequenos grupos"><span class="attraction-check">✓ Selecionado</span></button>
      </div>
      <div class="attraction-footer"><span>${LEVELS[state.level].emoji} ${LEVELS[state.level].label} · 20 brincadeiras</span><button type="button" class="wood-button primary" data-action="start-adventure">Começar aventura →</button></div>
    </section>`;
    if (window.matchMedia && window.matchMedia('(max-width:700px)').matches) {
      const selectedCard = app.querySelector('.attraction-card.selected');
      if (selectedCard) requestAnimationFrame(() => selectedCard.scrollIntoView({block:'nearest', inline:'center', behavior:'auto'}));
    }
    if (playGuide) playNarrationFiles(['Escolha dificuldade.mp3'], 'Escolha a dificuldade: fácil, médio ou difícil.');
  }
  function renderMenu(){renderHome();}

  function initMechanic(){
    stopTimers();
    state.complete=false;
    const a=currentActivity();
    if(a.id===1)state.levelData=makeCountQuestion(state.level);
    else if(a.id===2)state.levelData=makeMoleQuestion(state.level);
    else if(a.type==='bubble')state.levelData=makeBubbleQuestion(a.id,state.level);
    else if(a.id===6)state.levelData=makeSyllableQuestion(state.level);
    else {
      const generated=randomizeLevelData(a.levels[state.level],a.type);
      state.levelData=a.type==='maze'?{...generated,...pickMazeVariant(state.level),instruction:state.level==='easy'?'Siga o caminho simples até a saída. Use as setas para mover o personagem.':state.level==='medium'?'Este labirinto tem mais curvas. Planeje cada movimento e observe os becos sem saída.':'Este é o maior labirinto, com mais cruzamentos e becos sem saída. Explore com calma e encontre a saída.'}:generated;
    }
    const l=currentLevel();
    state.mechanic={};
    if(a.id===1){state.mechanic.quizProgress=0;state.mechanic.usedCountQuestions=[currentLevel().questionKey];}
    if(a.type==='drag'||a.type==='habitat')state.mechanic.placements={};
    if(a.type==='scratch'){state.mechanic.strokeLength=0;state.mechanic.scratchPercent=0;state.mechanic.revealed=false;}
    if(a.type==='maze'){
      state.mechanic.pos=[...l.solutionPath[0]];
      state.mechanic.visited=[l.solutionPath[0].slice()];
    }
    if(a.type==='feed')state.mechanic.fed=[];
    if(a.type==='puzzle'){state.mechanic.placed={};state.mechanic.selectedPiece=null;state.mechanic.puzzleImage=({easy:'sol',medium:'borboleta',hard:'arvore'})[state.level];state.mechanic.puzzleCols=state.level==='easy'?2:state.level==='medium'?3:4;state.mechanic.puzzleRows=state.level==='easy'?2:state.level==='medium'?2:3;state.mechanic.puzzleOrder=shuffleArray(Array.from({length:state.mechanic.puzzleCols*state.mechanic.puzzleRows},(_,i)=>i));}
    if(a.type==='paint'){state.mechanic.selectedColor=null;state.mechanic.pickedColors=[];state.mechanic.painted={};}
    if(a.type==='match'){state.mechanic.selectedLeft=null;state.mechanic.matched=[];state.mechanic.rightPairOrder=shuffleArray(l.pairs.map((_,i)=>i));}
    if(a.type==='lantern')state.mechanic.found=[];
    if(a.type==='memory'){state.mechanic.flipped=[];state.mechanic.matched=[];}
    if(a.type==='detective')state.mechanic.found=[];
    if(a.type==='dots')state.mechanic.nextDot=0;
    if(a.type==='bubble'){state.mechanic.bubbleProgress=0;state.mechanic.bubbleRound=0;}
    if(a.type==='mole'){state.mechanic.visibleMoles=[];state.mechanic.moleProgress=0;state.mechanic.moleWaveCount=0;state.mechanic.moleStarted=false;state.mechanic.moleCycleOrder=[];}
    if(a.type==='emotion')state.mechanic.selectedEmotion=null;
  }
  function startRandomRound(requestedLevel=state.level){
    // Cada nível tem exatamente 20 desafios distintos (um de cada atividade).
    // A ordem é sorteada de novo, mas a dificuldade não se mistura dentro da aventura.
    state.level=LEVELS[requestedLevel]?requestedLevel:'easy';
    const levelPool=challengeCatalog.filter(challenge=>challenge.level===state.level);
    state.roundOrder=shuffleArray(levelPool.map(challenge=>activities.findIndex(a=>a.id===challenge.activityId)));
    state.roundPosition=0;state.roundActive=true;state.roundMode='adventure';state.roundCompleted=new Set();
    state.complete=false;state.levelData=null;state.mechanic={};state.pointerDrag=null;
    saveProgress();
    openRoundActivity(state.roundOrder[0]);
  }
  function openRoundActivity(index){
    stopVoicePlayback();window.dispatchEvent(new CustomEvent('pd:open',{detail:{}}));stopTimers();state.pointerDrag=null;state.activityIndex=Math.max(0,Math.min(activities.length-1,index));
    initMechanic();renderGame();
  }
  function openActivity(index){
    state.activityIndex=Math.max(0,Math.min(activities.length-1,index));
    const rest=shuffleArray(activities.map((_,i)=>i).filter(i=>i!==state.activityIndex));
    state.roundOrder=[state.activityIndex,...rest];state.roundPosition=0;state.roundActive=true;state.roundMode='selected';
    openRoundActivity(state.activityIndex);
  }
  function goNextActivity(){
    if(state.roundPosition>=state.roundOrder.length-1){renderFinish();return;}
    state.roundPosition++;
    openRoundActivity(state.roundOrder[state.roundPosition]);
  }
  function chooseLevel(level){
    if(!LEVELS[level])return;
    if(state.screen==='game'){
      if(level===state.level)return;
      startRandomRound(level);
      showToast(`Novo percurso ${LEVELS[level].label}: 20 atividades em ordem surpresa.`);
      return;
    }
    state.level=level;saveProgress();if(state.screen==='levels')renderLevelSelect();else renderHome();
  }
  function feedback(message,kind=''){if(kind==='bad')window.dispatchEvent(new CustomEvent('pd:mistake',{detail:{}}));const node=app.querySelector('#feedback-line');if(node){node.className='feedback-line'+(kind?' '+kind:'');node.textContent=message;}else showToast(message);}
  function playSuccessJingle(){if(!soundEnabled)return;try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const now=audioContext.currentTime;[523.25,659.25,783.99].forEach((frequency,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=frequency;o.connect(g);g.connect(audioContext.destination);const t=now+i*.11;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.095,t+.017);g.gain.exponentialRampToValueAtTime(.0001,t+.26);o.start(t);o.stop(t+.28);});}catch(e){}}
  function completeActivity(message){
    if(state.complete)return;
    stopVoicePlayback();playSuccessJingle();state.complete=true;window.dispatchEvent(new CustomEvent('pd:complete',{detail:{key:completionKey(currentActivity().id,state.level),level:state.level,done:state.completed.size+1,round:state.roundCompleted.size+1}}));
    const key=completionKey(currentActivity().id,state.level);
    state.score+=10;state.completed.add(key);
    state.roundCompleted.add(key);
    saveProgress();stopTimers();
    state.mechanic.successMessage=message||'Muito bem! Desafio concluído!';
    if(state.roundActive&&state.roundPosition>=state.roundOrder.length-1){renderFinish();return;}
    renderGame();
  }
  function progressActions(){if(state.complete){const isLast=state.roundPosition>=state.roundOrder.length-1;return `<div class="game-actions ${currentActivity().type==='puzzle'?'puzzle-complete-actions':''}"><button type="button" class="wood-button primary" data-action="${isLast?'finish':'next'}">${isLast?'Concluir aventura 🏆':'Próxima brincadeira →'}</button><button type="button" class="soft-button" data-action="home">Início</button></div>`;}return `<div class="game-actions"><button type="button" class="soft-button" data-action="hint">💡 Dica</button><button type="button" class="soft-button" data-action="restart">↻ Tentar novamente</button></div>`;}
  function gameHeader(){
    const a=currentActivity(),l=LEVELS[state.level];
    const pct=Math.round(((state.roundPosition+(state.complete?1:0))/Math.max(1,state.roundOrder.length))*100);
    return `<header class="scene-toolbar">
      <button type="button" class="scene-icon home-icon" data-action="home" aria-label="Voltar ao início"><img src="assets/img/ilustracoes/botao-home.webp" alt=""></button>
      <div class="scene-wordmark">${brandMarkup()}</div>
      <div class="scene-toolbar-actions"><span class="score-pill">⭐ ${state.score}</span>${musicButton()}</div>
    </header>
    <div class="stage-progress" aria-label="Progresso da aventura"><div class="stage-progress-fill" style="width:${pct}%"></div><img class="stage-progress-marker" src="assets/img/ilustracoes/progressbar-play-icon.webp" alt="" style="left:${pct}%"></div>
    <div class="stage-label-row"><span class="mechanic-tag">${esc(mechanics[a.type])}</span><div class="inline-level-picker" role="group" aria-label="Escolher dificuldade. Cada nível tem 20 atividades e o total é 60 desafios." title="Trocar o nível começa uma nova aventura com 20 atividades."><span class="level-picker-label">NÍVEL</span>${levelsOrder.map(key=>`<button type="button" class="level-tab ${state.level===key?'selected':''}" data-level="${key}" aria-pressed="${state.level===key}" aria-label="Nível ${LEVELS[key].label}, 20 atividades">${LEVELS[key].emoji} ${LEVELS[key].label}</button>`).join('')}</div><span class="round-count" aria-live="polite"><strong>${state.roundPosition+1} / ${CHALLENGES_PER_LEVEL}</strong><small>atividades</small></span></div>`;
  }
  const illustratedTokens = Object.freeze({
    '📱':'celular','⛪':'igreja','🥒':'pepino','🏥':'hospital','🧳':'mala','☕':'caneca','🐱':'gato','🐭':'rato','🐦':'pintinho','✈️':'aviao','✈':'aviao','🐸':'sapo','🦓':'zebra','🐶':'cachorro','🐕':'cachorro',
    '🐰':'coelhinho','🐇':'coelho','🦋':'borboleta','🐟':'peixe-azul','🐠':'peixe-amarelo',
    '🐡':'peixe-espada','🐥':'pintinho','🐤':'pintinho','🐔':'galinha',
    '🍎':'maca','🍏':'maca','🍌':'banana','🍓':'morango','🍉':'melancia','🍈':'mel-o','🍇':'uva',
    '🥕':'cenoura','🍋':'limao-amarelo','☀️':'sol','☀':'sol','🌞':'sol',
    '🌳':'arvore','🌲':'arvore','⚽':'bola','🚂':'frente-trem','🚃':'trem',
    '🧴':'cola','🪢':'cola','🍽️':'prato','🍽':'prato','🐻':'urso-inicio-canto','🧸':'tobi',
    '🥦':'brocolis','🍍':'abacaxi','🍒':'cereja','🥥':'coco','🍬':'bala','🍭':'bala',
    '🏠':'casa','📦':'caixa','🌀':'mola','🌼':'margarida','🌹':'rosa-flor','🌸':'rosa-flor',
    '🍀':'trevo-4-folha','☘':'trevo-4-folha','🌊':'onda','🥪':'sanduiche','🍯':'pote-de-mel','🐊':'jacare','🚗':'carrinho','🐻‍❄️':'urso-inicio-canto'
  });
  const artworkByLabel = Object.freeze({
    'celular':'celular','igreja':'igreja','pepino':'pepino','hospital':'hospital','mala':'mala','caneca':'caneca','abacaxi':'abacaxi','acerola':'acerola','árvore':'arvore','banana':'banana','banana madura':'banana-v2','maçã verde':'maca','peixe azul':'peixe-azul','bola':'bola','borboleta':'borboleta',
    'brócolis':'brocolis','cachorro':'cachorro','cenoura':'cenoura','cereja':'cereja','coelho':'coelho','pássaro':'pintinho','passaro':'pintinho','avião':'aviao','aviao':'aviao',
    'coelhinho':'coelhinho','cola':'cola','galinha':'galinha','gato':'gato','maçã':'maca','maçã vermelha':'maca',
    'melancia':'melancia','melão':'mel-o','mola':'mola','morango':'morango','margarida':'margarida',
    'peixe':'peixe','peixinho':'peixe','pintinho':'pintinho','prato':'prato','rosa':'rosa-flor',
    'sanduíche':'sanduiche','sapo':'sapo','sol':'sol','tobi':'tobi','trem':'trem','trevo':'trevo-4-folha','osso':'osso','deserto':'deserto','gelo':'gelo',
    'uva':'uva','uvas':'uva','zebra':'zebra','casa':'casa','caixa':'caixa','flor':'rosa-flor','mel':'pote-de-mel','melão':'mel-o','melao':'mel-o',
    'gatinho':'gato','rato':'rato','brinquedo':'urso-inicio-canto','quadrado':'quadrado-claro','jacaré':'jacare','jacare':'jacare','carrinho':'carrinho',
    'mar':'onda','água':'onda','passarinho':'pintinho','urso':'urso-inicio-canto','ursinho':'tobi'
  });
  function normalizeArtLabel(value){
    return String(value||'').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  }
  function illustrationForLabel(label){
    const normalized=normalizeArtLabel(label);
    if(!normalized)return null;
    if(artworkByLabel[normalized])return artworkByLabel[normalized];
    for(const [key,value] of Object.entries(artworkByLabel)){
      const k=normalizeArtLabel(key);
      const wholeWordMatch=k.length>=4 && (normalized===k || normalized.startsWith(k+' ') || normalized.endsWith(' '+k) || normalized.includes(' '+k+' '));
      if(wholeWordMatch)return value;
    }
    return null;
  }
  function tokenMarkup(token, alt='', extraClass='saved-game-art'){
    let name=illustrationForLabel(alt)||illustratedTokens[token];
    if(!name){const first=String(token||'').match(/^\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u)?.[0];if(first)name=illustratedTokens[first];}
    if(!name)return esc(token||'');
    return `<img src="assets/img/ilustracoes/${name}.webp" alt="${esc(alt||token)}" class="${extraClass}" draggable="false" loading="eager">`;
  }
  function applySavedIllustrations(){
    const selectors='.option-art,.mole-creature,.food-item > span,.drag-token > span,.train-engine,.zone-art,.plate-fruit,.paint-region > span,.menu-emoji,.mascot-mouth,.inst-icon';
    app.querySelectorAll(selectors).forEach(el=>{
      if(el.querySelector('img'))return;
      const raw=el.textContent.trim();
      const tokens=Array.from(raw.matchAll(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu),m=>m[0]);
      if(!tokens.length||tokens.join('')!==raw.replace(/\s/g,''))return;
      // Plates need one illustration per fruit. Other options use the written label
      // first, so a word such as “Cola” receives the glue illustration, not a rope emoji.
      if(el.classList.contains('plate-fruit')){
        const fragment=document.createDocumentFragment();let found=false;
        for(const token of tokens){const name=illustratedTokens[token];if(!name)continue;const img=document.createElement('img');img.src=`assets/img/ilustracoes/${name}.webp`;img.alt='';img.className='saved-game-art';img.loading='eager';img.draggable=false;fragment.appendChild(img);found=true;}
        if(found)el.replaceChildren(fragment);
        return;
      }
      const card=el.closest('.option-card,.drag-token,.food-item,.drop-zone,.paint-region,.spot-target,.detective-item,.mole');
      const label=card?.querySelector('.option-label,small,.mole-word,strong')?.textContent?.trim()||card?.getAttribute('aria-label')||'';
      const name=illustrationForLabel(label)||illustratedTokens[tokens[0]];
      if(!name)return;
      const img=document.createElement('img');img.src=`assets/img/ilustracoes/${name}.webp`;img.alt=label||tokens[0];img.className='saved-game-art';img.loading='eager';img.draggable=false;el.replaceChildren(img);
    });
  }
  function renderGame(){
    state.screen='game';const a=currentActivity(),l=currentLevel();
    app.innerHTML=`<section class="garden-screen game-scene mechanic-${a.type}" data-activity="${a.id}" data-complete="${state.complete?'true':'false'}">
      ${gameHeader()}
      <section class="game-panel reference-game-panel">
        <div class="activity-heading"><div class="activity-art" aria-hidden="true"><img src="assets/img/ilustracoes/${activityArtwork[a.id]||'tobi'}.webp" alt="" draggable="false"></div><div class="activity-copy"><div class="activity-title-row"><h1>${esc(a.type==='bubble'?'Estoure as bolhas!':(l.title||a.title))}</h1><button type="button" class="activity-speak" data-action="speak-activity" aria-label="Ouvir o nome e o enunciado desta fase" title="Repetir nome e enunciado"><img src="assets/img/ilustracoes/botao-musica.webp" alt=""><span class="sr-only">Repetir nome e enunciado</span></button></div><p>${esc(l.instruction||l.prompt)}</p></div></div>
        <div class="play-area reference-play-area"><div class="task-prompt"><button type="button" class="prompt-audio" data-action="speak-question" aria-label="Ouvir novamente o enunciado" title="Repetir o enunciado"><img src="assets/img/ilustracoes/botao-musica.webp" alt=""></button><span class="task-prompt-text">${esc(l.prompt)}</span></div>${renderMiniProgress(a)}${renderMechanic(a,l)}
          ${state.complete?`<div class="success-celebration" aria-live="polite"><img class="success-mascot" src="assets/img/ilustracoes/tobi.webp" alt="Tobi comemorando"><strong>VOCÊ CONSEGUIU!</strong></div><div class="feedback-line good" id="feedback-line">${esc(state.mechanic.successMessage||'Muito bem! Desafio concluído!')} +10 pontos.</div>${a.type==='puzzle'?progressActions():''}`:`<div class="feedback-line" id="feedback-line">🧡 ${esc(defaultPlayHint(a))}</div>`}
        </div>${a.type==='puzzle'&&state.complete?'':progressActions()}
      </section>
    </section>`;
    applySavedIllustrations();
    if(a.type==='puzzle'&&state.complete){requestAnimationFrame(()=>{const panel=app.querySelector('.game-panel');const actions=app.querySelector('.puzzle-complete-actions');if(panel&&actions){const bottom=actions.getBoundingClientRect().bottom-panel.getBoundingClientRect().top+panel.scrollTop;panel.scrollTo({top:Math.max(0,bottom-panel.clientHeight+18),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}});}
    if(a.type==='scratch')setupScratch();
    if(a.type==='mole'&&!state.complete&&state.mechanic.moleStarted)startMoleCycle();
    if(a.type==='lantern')positionSpotlight(app.querySelector('.spotlight-board'));
  }
  function defaultPlayHint(a){
    return ({quiz:'Observe as quantidades e escolha um prato.',mole:'Espere a marmota aparecer e toque nela!',drag:'Pegue um objeto e leve-o até o lugar certo.',train:'Observe o padrão e escolha o próximo vagão.',scratch:'Esfregue a camada para revelar a figura.',clap:'Escute a palavra e conte os pedaços.',maze:'Encontre o caminho até o destino.',feed:'Escolha só os alimentos que obedecem à regra.',bubble:'Observe a pergunta e toque na bolha certa enquanto elas sobem.',puzzle:'Escolha uma peça e depois o espaço correspondente.',paint:'Escolha uma tinta e pinte cada parte.',match:'Selecione um cartão de cada coluna que combine.',lantern:'Mova a lanterna e procure o objeto pedido.',memory:'Vire duas cartas e procure a correspondência.',detective:'Investigue a cena e toque nos detalhes corretos.',dots:'Siga a ordem mostrada nos pontos.',soundquiz:'Ouça os sons e identifique o instrumento.',habitat:'Leve cada animal ao habitat correto.',emotion:'Escolha a expressão que combina com a situação.'})[a.type]||'Explore e descubra!';
  }
  function renderMiniProgress(a){
    const m=state.mechanic;let done=null;
    if(a.id===1)done=m.quizProgress||0;
    else if(a.type==='mole')done=m.moleProgress||0;
    else if(a.type==='bubble')done=m.bubbleProgress||0;
    if(done===null)return '';
    return `<div class="mini-challenge-progress" aria-label="Progresso da atividade"><span>${state.complete?'3 DESAFIOS COMPLETOS':`DESAFIO ${done+1} DE 3`}</span><div class="mini-progress-dots">${[0,1,2].map(i=>`<i class="${i<done?'done':i===done&&!state.complete?'current':''}"></i>`).join('')}</div><small>${done} de 3 acertos</small></div>`;
  }
  function renderMechanic(a,l){switch(a.type){
    case 'quiz':return renderQuiz(l);
    case 'mole':return renderMoles(l);
    case 'drag':case 'habitat':return renderDrag(l,a.type);
    case 'train':return renderTrain(l);
    case 'scratch':return renderScratch(l);
    case 'clap':return renderClap(l);
    case 'maze':return renderMaze(l);
    case 'feed':return renderFeed(l);
    case 'bubble':return renderBubbles(l);
    case 'puzzle':return renderPuzzle(l);
    case 'paint':return renderPaint(l);
    case 'match':return renderMatch(l);
    case 'lantern':return renderLantern(l);
    case 'memory':return renderMemory(l);
    case 'detective':return renderDetective(l);
    case 'dots':return renderDots(l);
    case 'soundquiz':return renderSoundQuiz(l);
    case 'emotion':return renderEmotion(l);
    default:return '<p>Atividade não encontrada.</p>';
  }}
  function renderQuiz(l){if(l.plates){return `<div class="plate-row">${l.plates.map((n,i)=>`<button class="plate-option" type="button" data-plate-index="${i}" ${state.complete?'disabled':''} aria-label="Prato com ${n} maçãs"><span class="plate-stack"><img class="plate-base" src="assets/img/ilustracoes/prato-vazio-com-garfo-e-faca-do-lado.webp" alt="">${n>6?`<span class="plate-fruit many-fruit">${Array.from({length:n},()=>tokenMarkup('🍎','Maçã')).join('')}</span>`:`<span class="plate-fruit">${Array.from({length:n},()=>tokenMarkup('🍎','Maçã')).join('')}</span>`}</span><strong>${n} ${n===1?'maçã':'maçãs'}</strong></button>`).join('')}</div>`;}return genericOptions(l);}
  function genericOptions(l){return `<div class="answers-grid">${l.options.map((op,i)=>{const arr=Array.isArray(op)?op:[op,''];return `<button class="option-card" type="button" data-option-index="${i}" ${state.complete?'disabled':''}><span class="option-art">${esc(arr[0])}</span><span class="option-label">${esc(arr[1]||arr[0])}</span></button>`;}).join('')}</div>`;}
  function moleAnswerMarkup(option){
    return `<img class="mole-character" src="assets/img/ilustracoes/marmota.svg" alt="Marmota" draggable="false"><span class="mole-answer-badge" aria-label="Figura ${esc(option[1])}">${tokenMarkup(option[0],option[1])}</span>`;
  }
  function renderMoles(l){
    const visible=new Set(state.mechanic.visibleMoles||[]);
    if(!state.mechanic.moleStarted){
      return `<div class="mole-stage mole-waiting"><p class="match-line mole-help">${esc(l.instruction||'Quando você iniciar, uma marmota vai aparecer de cada vez.')}</p><div class="mole-grid mole-grid-waiting" aria-hidden="true">${l.options.map(()=>'<div class="mole-hole"><div class="mole-pit"></div></div>').join('')}</div><div class="mole-start-box"><p>As marmotas estão escondidas nos buracos.</p><button type="button" class="wood-button primary mole-start-button" data-action="start-mole">▶ Iniciar jogo</button></div></div>`;
    }
    return `<div class="mole-stage"><p class="match-line mole-help">Uma marmota aparece por vez. Observe a figura que ela carrega e toque nela se a palavra rimar.</p><div class="mole-grid">${l.options.map((o,i)=>`<div class="mole-hole"><div class="mole-pit"></div><button type="button" class="mole ${visible.has(i)?'is-up':''}" data-mole-index="${i}" ${state.complete||!visible.has(i)?'disabled':''} aria-label="Marmota ${i+1}${visible.has(i)?': '+esc(o[1]):', escondida'}"><span class="mole-creature">${visible.has(i)?moleAnswerMarkup(o):''}</span><span class="mole-word">${visible.has(i)?esc(o[1]):''}</span></button></div>`).join('')}</div><p class="match-line">Rodada ${Math.min(3,(state.mechanic.moleProgress||0)+1)} de 3 · uma marmota de cada vez.</p></div>`;
  }

  function renderDrag(l,type){
    const placed=state.mechanic.placements||{};
    const isMatrix=l.zones.length===4&&l.zones.some(z=>z.id==='topLeft');
    return `<div class="drag-layout ${isMatrix?'matrix-layout':''}">
      <div class="drag-source-panel"><p class="drag-panel-label">${type==='habitat'?'ANIMAIS PARA LEVAR':'OBJETOS PARA MOVER'}</p><div class="drag-items" aria-label="Objetos para arrastar">${l.items.filter(it=>!placed[it.id]).map(it=>`<button type="button" draggable="false" class="drag-token ${state.mechanic.selectedItem===it.id?'chosen':''}" data-item-id="${it.id}" aria-label="Selecionar ou arrastar ${esc(it.label)}"><span>${it.emoji}</span><small>${esc(it.label)}</small></button>`).join('')||'<strong>Todos os objetos foram colocados!</strong>'}</div><p class="drag-touch-hint"><span aria-hidden="true">☝</span> Toque num objeto e depois no lugar certo, ou arraste-o com o dedo ou mouse.</p></div>
      <div class="drop-zones ${isMatrix?'spatial-matrix':''}">${l.zones.map(z=>{const assigned=Object.keys(placed).filter(id=>placed[id]===z.id);const rowClass=z.id.startsWith('top')?'matrix-top':z.id.startsWith('bottom')?'matrix-bottom':'';return `<button type="button" class="drop-zone ${rowClass} ${assigned.length?'filled':''} ${state.mechanic.selectedItem?'drop-ready':''}" data-zone-id="${z.id}" ${state.complete?'disabled':''}><span class="zone-art">${z.emoji}</span><strong>${esc(z.label)}</strong><small>${assigned.map(id=>`${l.items.find(it=>it.id===id)?.emoji||''} ${esc(l.items.find(it=>it.id===id)?.label||id)}`).join(' + ')||'Solte aqui'}</small></button>`;}).join('')}</div>
    </div>`;
  }
  function renderTrain(l){
    const shapes=l.prompt.toLocaleLowerCase('pt-BR').includes('formas');
    const labelFor=(symbol)=>{
      const colors={'🔴':'Vermelho','🟡':'Amarelo','🟢':'Verde','🔵':'Azul','🟦':'Azul'};
      const forms={'⭐':'Estrela','🔴':'Círculo vermelho','🔵':'Círculo azul','🟦':'Quadrado azul','🟡':'Círculo amarelo','🟢':'Círculo verde'};
      return (shapes?forms:colors)[symbol]||'Peça';
    };
    const colorClass={'🔴':'red','🟡':'yellow','🟢':'green','🔵':'blue','🟦':'blue','⭐':'star'};
    return `<div class="train-track" role="list" aria-label="Sequência de vagões"><span class="train-engine" aria-label="Locomotiva">${tokenMarkup('🚂','Locomotiva')}</span>${l.sequence.map((s,i)=>{const chosen=s==='❔'?state.mechanic.trainAnswer:null;const value=s==='❔'?(chosen||'❔'):s;const missing=s==='❔'&&!chosen;return `<div class="train-car ${missing?'gap':chosen?'answer-filled':''}" role="listitem" aria-label="${missing?'Vagão vazio':`Vagão ${labelFor(value)}${chosen?' — opção selecionada':''}`}" data-color="${colorClass[value]||'shape'}"><span class="train-symbol ${colorClass[value]||'shape'}">${esc(value)}</span>${missing?'<small class="train-gap-label">Falta uma peça</small>':''}</div>`;}).join('')}</div><p class="match-line train-instruction">Escolha uma peça: ela aparecerá no vagão vazio.</p><div class="answers-grid train-options">${l.options.map((o,i)=>`<button type="button" class="option-card train-answer-card ${state.mechanic.trainAnswerIndex===i?'selected':''}" data-option-index="${i}" ${state.complete?'disabled':''} aria-pressed="${state.mechanic.trainAnswerIndex===i}"><span class="option-art train-choice-symbol ${colorClass[o]||'shape'}">${esc(o)}</span><span class="option-label">${labelFor(o)}</span></button>`).join('')}</div>`;
  }
  function renderScratch(l){const pct=state.complete?100:Math.max(0,Math.min(99,Math.round(state.mechanic.scratchPercent||0)));return `<div class="scratch-wrap"><div class="scratch-reveal"><div class="scratch-animal">${tokenMarkup(l.target,l.targetName)}<span>${esc(l.targetName)}</span></div></div><canvas class="scratch-canvas" id="scratch-canvas" style="${state.complete?'display:none':''}" aria-label="Raspe a camada colorida para revelar o animal escondido"></canvas></div><div class="scratch-instruction">✋ Esfregue várias vezes com o dedo ou mouse para tirar a camada de papel!</div><div class="scratch-progress"><span>Camada removida</span><div class="scratch-progress-track"><i id="scratch-progress-fill" style="width:${pct}%"></i></div><strong id="scratch-progress-label">${pct}%</strong></div>`;}
  function renderClap(l){if(Array.isArray(l.options)){return `<div class="word-syllable-grid">${l.options.map((o,i)=>`<div class="word-syllable-card"><button type="button" class="option-card" data-word-option="${i}" ${state.complete?'disabled':''}><span class="option-art">${esc(o.word)}</span><span class="option-label">${o.syllables} sílabas</span><small>${esc(o.split)}</small></button><button type="button" class="word-audio" data-speak-choice="${i}" aria-label="Ouvir ${esc(o.word)}">🔊 Ouvir</button></div>`).join('')}</div><p class="match-line">Ouça cada palavra e escolha a que tem quatro sílabas.</p>`;}return `<div class="task-visual">👏 ${esc(l.word)} 👏</div><div style="text-align:center"><button type="button" class="soft-button" data-action="speak-word">🔊 Ouvir palavra</button><p style="font-size:clamp(18px,2vw,24px);font-weight:1000;color:#9b5e2c">${esc(l.split)}</p></div><div class="clap-row">${[1,2,3,4].map(n=>`<button type="button" class="tap-choice" data-syllable-count="${n}" ${state.complete?'disabled':''}><span class="claps">${'👏'.repeat(n)}</span><strong>${n} ${n===1?'palma':'palmas'}</strong></button>`).join('')}</div>`;}
  function renderMaze(l){const n=l.mazeSize||7,walkable=new Set(l.path.map(p=>p.join(','))),pos=state.mechanic.pos,solution=l.solutionPath||l.path,goal=solution[solution.length-1],visited=new Set((state.mechanic.visited||[]).map(p=>p.join(',')));
    return `<div class="maze-layout maze-level-${state.level}"><div class="maze-grid modern-maze" style="--maze-size:${n}" role="img" aria-label="Labirinto ${n} por ${n}; encontre o caminho até a saída">${Array.from({length:n*n},(_,i)=>{const r=Math.floor(i/n),c=i%n,key=r+','+c,open=walkable.has(key),at=r===pos[0]&&c===pos[1],end=r===goal[0]&&c===goal[1];return `<div class="maze-cell ${open?'path':'wall'} ${visited.has(key)?'visited':''} ${at?'maze-player':''}" aria-label="${at?'Personagem':end?'Destino':open?'Caminho':'Parede'}">${at?`<img src="assets/img/ilustracoes/${state.level==='hard'?'peixe':state.level==='medium'?'cachorro':'coelho'}.webp" alt=""/>`:end?`<img src="assets/img/ilustracoes/${state.level==='hard'?'onda':state.level==='medium'?'arvore':'cenoura'}.webp" alt=""/>`:''}</div>`}).join('')}</div><div class="maze-guide"><div class="maze-guide-title">Encontre o caminho até o destino! 🏁</div><small class="maze-variant-tag">Mapa ${l.variant||1} de ${l.variantCount||5}</small><div class="maze-controls"><button type="button" class="direction-button" data-dir="up" aria-label="Cima">⬆️</button><button type="button" class="direction-button" data-dir="left" aria-label="Esquerda">⬅️</button><button type="button" class="direction-button" data-dir="down" aria-label="Baixo">⬇️</button><button type="button" class="direction-button" data-dir="right" aria-label="Direita">➡️</button></div><p class="match-line">Use as setas ou as teclas do teclado. 🟩 Parede · 🟨 Caminho livre</p><p class="maze-steps">👣 Passos: ${Math.max(0,(state.mechanic.visited||[]).length-1)}</p></div></div>`;}
  function renderFeed(l){const fed=state.mechanic.fed||[];return `<div class="drag-layout"><div><div class="feed-target" data-feed-target="true"><div class="feed-mascot-row"><img class="feed-tobi" src="assets/img/ilustracoes/tobi.webp" alt="Tobi"><img class="feed-dish" src="assets/img/ilustracoes/prato.webp" alt="Pratinho de comida"></div><div class="mascot-mouth">🧸</div><strong>BOCA DO TOBI</strong><p>Arraste o alimento até a boca do Tobi ou toque nele e em “Dar ao Tobi”.</p></div><button class="wood-button primary" style="display:block;margin:12px auto" data-action="feed">🍽️ Dar ao Tobi</button></div><div class="food-grid">${l.foods.filter(f=>!fed.includes(f[1])).map(f=>`<button type="button" class="food-item ${state.mechanic.selectedFood===f[1]?'chosen':''}" data-food-name="${esc(f[1])}" draggable="false" ${state.complete?'disabled':''}><span>${f[0]}</span><small>${esc(f[1])}</small></button>`).join('')}</div></div><p class="match-line">Alimentos entregues: ${fed.length} de ${l.foods.filter(f=>f[2]).length}</p>`;}
  function renderBubbles(l){const m=state.mechanic,duration=state.level==='easy'?12:state.level==='medium'?9:7;const lanes=shuffleArray([13,37,63,87]);
    return `<div class="bubble-status"><span class="pill">🫧 Bolhas subindo — ${state.level==='easy'?'ritmo tranquilo':state.level==='medium'?'ritmo moderado':'ritmo rápido'}</span><span class="pill bubble-progress-count">${m.bubbleProgress||0} de 3 acertos</span></div><div class="bubble-field" role="group" aria-label="Bolhas subindo continuamente; toque na bolha que responde à pergunta">${l.options.map((o,i)=>`<button class="bubble moving-bubble" type="button" data-option-index="${i}" style="--bx:${lanes[i]}%;--drift:${i%2?16:-16}px;--duration:${Math.max(2.6,duration+(i%3)*.35)}s;--delay:${-(i*duration/4).toFixed(2)}s" ${state.complete?'disabled':''} aria-label="Bolha ${esc(o)}"><span class="bubble-label">${esc(o)}</span></button>`).join('')}</div>`;}
  function renderPuzzle(l){
    const m=state.mechanic,cols=m.puzzleCols,rows=m.puzzleRows,total=cols*rows,img=`assets/img/puzzles/${m.puzzleImage}.webp`,selected=m.selectedPiece;
    const placedCount=Object.keys(m.placed||{}).length;
    const piece=(index,slot=false)=>{
      const done=Boolean(m.placed[index]);
      const tile=`assets/img/puzzle-pieces/${m.puzzleImage}-${index}.webp`;
      const tileMarkup=(!slot||done)?`<img class="puzzle-tile-img" src="${tile}" alt="Parte ${index+1} da figura" draggable="false" loading="eager">`:'';
      return `<button type="button" class="image-piece ${slot?'image-slot':''} ${done?'image-filled':''} ${selected===index&&!slot?'selected':''}" ${slot?`data-image-slot="${index}"`:`data-image-piece="${index}"`} ${done||state.complete?'disabled':''} aria-label="${slot?'Espaço':'Peça'} ${index+1}" ${!slot?'draggable="false"':''}>${tileMarkup}${slot&&!done?'<span class="slot-number">'+(index+1)+'</span>':''}</button>`;
    };
    return `<div class="image-puzzle" style="--cols:${cols};--rows:${rows}">
      <div class="puzzle-reference"><div class="puzzle-reference-copy"><div class="puzzle-caption">Observe a figura</div><span>Use a imagem como guia para montar as peças.</span></div><img src="${img}" alt="Imagem completa de referência para o quebra-cabeça" draggable="false" loading="eager"></div>
      <section class="puzzle-work" aria-label="Tabuleiro do quebra-cabeça"><div class="puzzle-section-heading"><div class="puzzle-caption">Monte a imagem · ${cols} × ${rows}</div><span class="puzzle-progress-count">${placedCount} de ${total}</span></div><div class="image-puzzle-grid" style="--cols:${cols};--rows:${rows}">${Array.from({length:total},(_,i)=>piece(i,true)).join('')}</div></section>
      <section class="puzzle-pieces" aria-label="Bandeja de peças"><div class="puzzle-section-heading"><div class="puzzle-caption">Peças disponíveis</div><span class="puzzle-progress-count">${total-placedCount} restantes</span></div><div class="image-puzzle-grid puzzle-tray-grid" style="--cols:${cols};--rows:${rows}">${m.puzzleOrder.filter(i=>!m.placed[i]).map(i=>piece(i)).join('')}</div><p class="puzzle-helper">Toque numa peça e depois no espaço correspondente. As figuras mantêm o formato original.</p></section>
    </div>`;
  }
  function paintRegionMarkup(region, paintedColor){
    const fill=paintedColor?colorHex(paintedColor):'#fff4d5';
    const outline='#68442f';
    const stitch='stroke="#f9e6b0" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="2.5 5" fill="none"';
    let body='';
    if(region.id==='balloon'){
      body=`<path d="M80 13 C49 13 25 39 29 70 C32 95 52 117 73 130 L80 139 L87 130 C108 117 128 95 131 70 C135 39 111 13 80 13Z" fill="${fill}" stroke="${outline}" stroke-width="6" stroke-linejoin="round"/><path d="M80 24 C54 24 38 45 40 68 C42 87 55 103 70 114" ${stitch}/><path d="M71 128 L80 143 L89 128Z" fill="${fill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/><path d="M80 143 C68 154 92 157 77 170" stroke="${outline}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="57" cy="42" rx="7" ry="14" transform="rotate(-28 57 42)" fill="#fff" opacity=".45"/>`;
    } else if(region.id==='sun'){
      body=`<g stroke="${outline}" stroke-width="6" stroke-linecap="round"><path d="M80 12 V27 M80 113 V128 M12 70 H27 M133 70 H148 M32 22 L43 34 M117 106 L128 118 M32 118 L43 106 M117 34 L128 22" fill="none"/><circle cx="80" cy="70" r="42" fill="${fill}"/></g><circle cx="80" cy="70" r="34" ${stitch}/><ellipse cx="63" cy="49" rx="7" ry="4" fill="#fff" opacity=".55"/>`;
    } else if(region.id==='flower'){
      body=`<g fill="${fill}" stroke="${outline}" stroke-width="5">${Array.from({length:8},(_,i)=>`<ellipse cx="80" cy="34" rx="17" ry="26" transform="rotate(${i*45} 80 80)"/>`).join('')}</g><circle cx="80" cy="80" r="23" fill="#ffd75e" stroke="${outline}" stroke-width="5"/><circle cx="80" cy="80" r="16" ${stitch}/><ellipse cx="72" cy="72" rx="5" ry="3" fill="#fff" opacity=".7"/>`;
    } else {
      const paths={wing1:'M80 71 C59 24 25 10 17 36 C8 62 40 83 80 88 Z',wing2:'M80 71 C101 24 135 10 143 36 C152 62 120 83 80 88 Z',wing3:'M80 83 C48 62 19 79 31 106 C42 129 66 113 80 94 Z',wing4:'M80 83 C112 62 141 79 129 106 C118 129 94 113 80 94 Z'};
      body=`<path d="${paths[region.id]||paths.wing1}" fill="${fill}" stroke="${outline}" stroke-width="5" stroke-linejoin="round"/><path d="${region.id==='wing1'?'M73 70 Q50 48 31 42':region.id==='wing2'?'M87 70 Q110 48 129 42':region.id==='wing3'?'M72 90 Q51 86 42 105': 'M88 90 Q109 86 118 105'}" ${stitch}/><circle cx="${region.id==='wing1'||region.id==='wing3'?50:110}" cy="${region.id==='wing1'||region.id==='wing2'?53:99}" r="4" fill="#fff4d5" stroke="${outline}" stroke-width="2"/>`;
    }
    return `<svg class="paint-art-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" role="img" aria-label="${esc(region.label)}${paintedColor?`, pintado de ${paintedColor}`:', para colorir'}">${body}</svg>`;
  }
  function renderPaint(l){const m=state.mechanic;return `<div class="paint-tools">${l.colors.map(c=>`<button type="button" class="palette-button ${m.selectedColor===c[0]?'selected':''}" data-color="${c[0]}" style="--swatch:${c[2]}" aria-label="Tinta ${c[1]}" title="${c[1]}"><span></span></button>`).join('')}<span class="pill paint-color-status">${m.selectedColor?`Tinta: ${m.selectedColor==='orange'?'Laranja':l.colors.find(c=>c[0]===m.selectedColor)?.[1]||m.selectedColor}`:'Escolha uma tinta'}</span>${l.mix?`<button class="wood-button mix-colors-button" type="button" data-action="mix-colors">Misturar amarelo + vermelho</button>`:''}</div>${l.mix?`<p class="match-line paint-mix-status">Tintas escolhidas: ${(m.pickedColors||[]).map(c=>c==='yellow'?'amarelo':'vermelho').join(' + ')||'nenhuma ainda'}</p>`:''}<div class="paint-board paint-board-count-${l.regions.length}">${l.regions.map(r=>`<button type="button" class="paint-region ${m.painted[r.id]?'painted':''}" data-region-id="${r.id}" aria-label="${esc(r.label)}${m.painted[r.id]?`, ${m.painted[r.id]}`:''}" ${state.complete?'disabled':''}><span class="paint-illustration-wrap">${paintRegionMarkup(r,m.painted[r.id])}</span><small>${r.code?`Código ${r.code}`:esc(r.label)}</small></button>`).join('')}</div>`;}
  function colorHex(color){return ({blue:'#3299e8',red:'#e64a3d',yellow:'#f4d13f',green:'#52a94e',purple:'#9861c7',orange:'#f28a3a'})[color]||'#fff9e6';}
  function renderMatch(l){
    const m=state.mechanic,order=m.rightPairOrder||l.pairs.map((_,i)=>i),n=l.pairs.length;
    const lines=(m.matched||[]).map(i=>{const rightRow=order.indexOf(i),y1=17+76*((i+.5)/n),y2=17+76*((rightRow+.5)/n);return `<path d="M 43 ${y1} C 48 ${y1},52 ${y2},57 ${y2}" fill="none" stroke="#dc7f3f" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 1"/><circle cx="43" cy="${y1}" r="1.6" fill="#fff1c9" stroke="#ad6939" stroke-width=".7"/><circle cx="57" cy="${y2}" r="1.6" fill="#fff1c9" stroke="#ad6939" stroke-width=".7"/>`;}).join('');
    const rightImage=(pair)=>{
      const src=illustrationForLabel(pair.right)||illustratedTokens[pair.ri];
      if(src)return `<img class="pair-image-only" src="assets/img/ilustracoes/${src}.webp" alt="" draggable="false" loading="eager">`;
      // Preserve an image-only column even when the art pack has no exact match.
      return `<span class="pair-fallback-art" aria-hidden="true">${esc(pair.ri||'✦')}</span>`;
    };
    return `<div class="pair-layout"><svg class="pair-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg><div class="pair-column pair-word-column"><h3>PALAVRAS</h3>${l.pairs.map((p,i)=>m.matched.includes(i)?`<div class="pair-item matched-pair pair-word-only">${esc(p.left)}</div>`:`<button type="button" class="pair-item pair-word-only ${m.selectedLeft===i?'selected':''}" data-pair-left="${i}" ${state.complete?'disabled':''}>${esc(p.left)}</button>`).join('')}</div><div class="pair-column pair-image-column"><h3>IMAGENS</h3>${order.map(i=>{const p=l.pairs[i];return m.matched.includes(i)?`<div class="pair-item matched-pair pair-image-only-item">${rightImage(p)}</div>`:`<button type="button" class="pair-item pair-image-only-item" data-pair-right="${i}" aria-label="Selecionar imagem correspondente à palavra" ${state.complete?'disabled':''}>${rightImage(p)}</button>`;}).join('')}</div></div><p class="match-line">Ligações feitas: ${m.matched.length} de ${l.pairs.length}. Escolha uma palavra e depois sua imagem.</p>`;
  }
  function renderLantern(l){const found=state.mechanic.found||[];return `<div class="spotlight-board" id="spotlight-board" aria-label="Cenário noturno escuro. Mova a lanterna para revelar os objetos.">${l.targets.map(t=>`<button type="button" class="spot-target" data-target-id="${t.id}" style="--x:${t.x}%;--y:${t.y}%" aria-label="${esc(t.label)}" ${state.complete||found.includes(t.id)?'disabled':''}><span class="spotlight-art">${tokenMarkup(t.emoji,t.label)}</span><small>${esc(t.label)}</small></button>`).join('')}<div class="spotlight-shade"></div></div><p class="match-line lantern-status">Encontrados: ${found.length} de ${l.targets.filter(t=>t.correct).length}. Mova o ponteiro ou o dedo para iluminar.</p>`;}
  function renderMemory(l){const m=state.mechanic;const targetFound=m.matched.some(i=>l.cards[i].key===l.targetKey);return `<div class="memory-grid">${l.cards.map((c,i)=>{const flipped=m.flipped.includes(i)||m.matched.includes(i);return `<button type="button" class="memory-card ${flipped?'flipped':''} ${m.matched.includes(i)?'matched':''}" data-memory-index="${i}" aria-label="Carta ${i+1}${flipped?': '+esc(c.label):', virada para baixo'}" ${state.complete||m.matched.includes(i)||m.flipped.length>=2?'disabled':''}>${flipped?`<span class="memory-face-art">${tokenMarkup(c.front,c.label)}</span><small>${esc(c.label)}</small>`:'<img class="memory-card-back" src="assets/img/ilustracoes/memory-card-back.svg" alt="Carta virada para baixo" draggable="false">'}</button>`;}).join('')}</div><p class="match-line">${targetFound?'Par solicitado encontrado!':'Vire duas cartas e encontre o par pedido.'}</p>`;}

  function renderDetective(l){const found=state.mechanic.found||[];const treeHunt=l.targets.some(t=>t.id==='fruit'&&t.emoji==='🍌');return `<div class="detective-scene ${treeHunt?'tree-hunt':''}" id="detective-scene" aria-label="${treeHunt?'Árvore ilustrada com folhas e uma fruta amarela escondida':'Cenário para investigar com a lupa'}">${l.targets.map(t=>{const first=String(t.emoji||'').match(/^\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u)?.[0];const direction=String(t.emoji||'').includes('←')?'←':String(t.emoji||'').includes('→')?'→':'';return `<button type="button" class="detective-item ${found.includes(t.id)?'found':''} ${String(t.emoji||'').includes('→')?'facing-right':''}" data-target-id="${t.id}" style="--x:${t.x}%;--y:${t.y}%" aria-label="${esc(t.id)}" ${state.complete||found.includes(t.id)?'disabled':''}><span class="detective-art">${tokenMarkup(first||t.emoji,t.label||'')}</span>${direction?`<small class="direction-mark">${direction}</small>`:''}</button>`;}).join('')}</div><p class="match-line">Itens encontrados: ${found.length} de ${l.targets.filter(t=>t.correct).length}. A lupa acompanha o cursor ou o toque.</p>`;}
  function renderDots(l){const next=state.mechanic.nextDot;const points=l.points;const lines=points.slice(0,next).map((p,i)=>i<next-1?`<line x1="${points[i].x}" y1="${points[i].y}" x2="${points[i+1].x}" y2="${points[i+1].y}" stroke="#d65f2d" stroke-width="7" stroke-linecap="round"/>`: '').join('');return `<div class="dots-board" role="group" aria-label="Pontos para conectar na sequência"><svg class="dots-svg" viewBox="0 0 500 260" preserveAspectRatio="none" aria-hidden="true"><path d="M20 225 Q250 0 480 225" fill="none" stroke="#a5c67e" stroke-width="2" stroke-dasharray="4 9"/>${lines}</svg>${points.map((p,i)=>`<button type="button" class="dot-button ${i===next?'current':''} ${i<next?'done':''}" style="left:${p.x/5}%;top:${p.y/2.6}%" data-dot-index="${i}" aria-label="Ponto ${esc(p.label)}" ${state.complete?'disabled':''}>${esc(p.label)}</button>`).join('')}</div><p class="match-line">Pontos conectados: ${next} de ${points.length}</p>`;}
  function renderSoundQuiz(l){return `<div class="instrument-controls">${l.samples.map((s,i)=>`<button type="button" class="instrument-card" data-play-sample="${s}"><span class="inst-icon">${({kick:'🥁',guitar:'🎸',triangle:'🔔',drum:'🥁',violin:'🎻'})[s]||'🎵'}</span><span>▶ Ouvir som ${i+1}</span></button>`).join('')}</div><p class="match-line">Ouça quantas vezes precisar. Depois, escolha o instrumento:</p><div class="answers-grid">${l.options.map((o,i)=>`<button type="button" class="option-card" data-option-index="${i}" ${state.complete?'disabled':''}><span class="option-art">${['🥁','🎸','🔔','🥁','🎻'][['Bumbo','Violão','Triângulo','Tambor','Violino'].indexOf(o)]||'🎵'}</span><span class="option-label">${esc(o)}</span></button>`).join('')}</div>`;}
  function emotionFeaturesSvg(label, includeHead=false){
    const mood=normalizeArtLabel(label||'');
    let brows='';let mouth='';
    if(mood==='feliz'||mood==='happy') mouth='<path d="M55 99 Q90 143 125 99 Q91 160 55 99Z" fill="#6d3e2c" stroke="#6d3e2c" stroke-width="4" stroke-linejoin="round"/><path d="M72 126 Q90 136 108 126 Q105 146 90 146 Q75 143 72 126Z" fill="#e87973"/>';
    else if(mood==='triste'||mood==='sad') mouth='<path d="M55 128 Q90 91 125 128" fill="none" stroke="#6d3e2c" stroke-width="9" stroke-linecap="round"/><path d="M131 65 C147 80 143 94 132 96 C119 91 120 79 131 65Z" fill="#7acfe5" stroke="#68442f" stroke-width="3"/>';
    else if(mood==='bravo'||mood==='angry') { brows='<path d="M40 44 L69 55 M111 55 L140 44" stroke="#68442f" stroke-width="8" stroke-linecap="round"/>'; mouth='<path d="M59 128 L69 112 L111 112 L121 128Z" fill="#6d3e2c" stroke="#6d3e2c" stroke-width="4" stroke-linejoin="round"/><path d="M70 119 H110" stroke="#f6e6b5" stroke-width="4" stroke-linecap="round"/>'; }
    else mouth='<path d="M58 117 Q90 117 122 117" fill="none" stroke="#9e7959" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 7"/>';
    const head=includeHead?'<circle cx="90" cy="90" r="78" fill="#f7c64e" stroke="#68442f" stroke-width="7"/><circle cx="90" cy="90" r="69" fill="none" stroke="#fbe5a0" stroke-width="2.5" stroke-dasharray="3 6"/>':'';
    return `<svg class="${includeHead?'emotion-option-svg':'emotion-face-features'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="${esc(label||'Rosto sem expressão')}">${head}<ellipse cx="43" cy="94" rx="12" ry="7" fill="#e77f72" opacity=".75"/><ellipse cx="137" cy="94" rx="12" ry="7" fill="#e77f72" opacity=".75"/><circle cx="58" cy="67" r="7.5" fill="#593c2d"/><circle cx="122" cy="67" r="7.5" fill="#593c2d"/><circle cx="60" cy="64" r="2.5" fill="#fff8dd"/><circle cx="124" cy="64" r="2.5" fill="#fff8dd"/>${brows}${mouth}</svg>`;
  }
  function emotionMouthSvg(label){
    const mood=normalizeArtLabel(label||'');let path='';
    if(mood==='feliz'||mood==='happy')path='<path d="M12 12 Q60 54 108 12 Q60 68 12 12Z" fill="#6d3e2c" stroke="#6d3e2c" stroke-width="3" stroke-linejoin="round"/><path d="M35 41 Q60 50 85 41 Q82 59 60 59 Q38 56 35 41Z" fill="#e87973"/>';
    else if(mood==='triste'||mood==='sad')path='<path d="M12 48 Q60 3 108 48" fill="none" stroke="#6d3e2c" stroke-width="8" stroke-linecap="round"/>';
    else if(mood==='bravo'||mood==='angry')path='<path d="M18 48 L30 26 H90 L102 48Z" fill="#6d3e2c" stroke="#6d3e2c" stroke-width="3" stroke-linejoin="round"/><path d="M31 36 H89" stroke="#f6e6b5" stroke-width="4" stroke-linecap="round"/>';
    else path='<path d="M12 32 Q60 32 108 32" fill="none" stroke="#9e7959" stroke-width="5" stroke-dasharray="3 6" stroke-linecap="round"/>';
    return `<svg class="emotion-mouth-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 72" aria-hidden="true">${path}</svg>`;
  }
  function renderEmotion(l){const m=state.mechanic,chosen=state.complete?l.options[l.correct]:null,selected=m.selectedEmotion!==null&&m.selectedEmotion!==undefined?l.options[m.selectedEmotion]:null;return `<div class="emotion-scene-row">${l.scene?`<div class="emotion-context"><span>${l.scene}</span><small>O que aconteceu?</small></div>`:''}<div class="emotion-board"><div class="emotion-face ${state.complete?'solved':''}">${emotionFeaturesSvg(state.complete?chosen[1]:null,false)}${state.complete?'':`<button type="button" class="missing-emotion-piece ${selected?'piece-selected':''}" data-emotion-slot="true" aria-label="Encaixar a boca da expressão">${emotionMouthSvg(selected?selected[1]:null)}</button>`}</div><strong>${state.complete?esc(chosen[1]):'Complete a expressão!'}</strong></div></div>${l.speech?'<div style="text-align:center;margin:8px auto 14px"><button type="button" class="soft-button" data-action="speak-word">🔊 Ouvir comando</button></div>':''}<p class="match-line">${selected?'A boca escolhida aparece no espaço. Toque nela para encaixar.':'Escolha a expressão que combina e encaixe a boca no rosto.'}</p><div class="piece-tray">${l.options.map((o,i)=>`<button type="button" class="piece emotion-piece ${m.selectedEmotion===i?'selected':''}" data-emotion-piece="${i}" ${state.complete?'disabled':''}><span class="emotion-option-art">${emotionFeaturesSvg(o[1],true)}</span><small>${esc(o[1])}</small></button>`).join('')}</div>`;}


  function checkAnswer(index, correct, explanation){if(state.complete)return;if(index===correct)completeActivity(explanation||'Resposta correta!');else feedback('Quase! Observe mais uma vez e tente de novo.','bad');}
  function selectEmotionPiece(index){if(state.complete)return;state.mechanic.selectedEmotion=index;renderGame();feedback('Peça escolhida! Agora encaixe-a no espaço do rosto.','good');}
  function insertEmotionPiece(){if(state.complete)return;const l=currentLevel(),chosen=state.mechanic.selectedEmotion;if(chosen===null||chosen===undefined){feedback('Escolha uma peça antes de tentar encaixar.','bad');return;}if(chosen!==l.correct){feedback('Essa peça não combina com a expressão pedida. Escolha outra e tente encaixar!','bad');return;}completeActivity(`Muito bem! Você encaixou a expressão ${l.options[chosen][1].toUpperCase()} no rosto.`);}
  function selectPuzzlePiece(pieceId){if(state.complete)return;const pieces=currentLevel().pieces;if(!pieces.some(p=>p.id===pieceId))return;state.mechanic.selectedPiece=pieceId;renderGame();feedback('Peça escolhida! Procure o espaço que combina com ela.','good');}
  function placePuzzlePiece(slotId){if(state.complete)return;const l=currentLevel(),slot=l.slots.find(s=>s.id===slotId),piece=state.mechanic.selectedPiece;if(!slot)return;if(!piece){feedback('Escolha uma peça primeiro.','bad');return;}if(slot.need!==piece){feedback('Essa peça não encaixa aqui. Tente outro espaço.','bad');return;}state.mechanic.placed[slot.id]=piece;state.mechanic.selectedPiece=null;if(l.slots.every(s=>state.mechanic.placed[s.id]===s.need))completeActivity('Quebra-cabeça completo!');else{renderGame();feedback('Peça encaixada! Continue montando.','good');}}
  function answerSyllableCount(number){if(state.complete)return;const l=currentLevel();if(number===l.syllables)completeActivity(`Isso! ${l.word} tem ${l.syllables} ${l.syllables===1?'sílaba':'sílabas'}.`);else feedback('Conte os pedaços da palavra outra vez.','bad');}
  function findHiddenTarget(targetId){if(state.complete)return;const a=currentActivity(),l=currentLevel(),target=l.targets.find(t=>t.id===targetId);if(!target)return;if(a.type!=='lantern'&&a.type!=='detective')return;if(!target.correct){feedback(a.type==='lantern'?'Continue explorando com a lanterna. Esse não é o alvo.':'Esse detalhe não é o que estamos procurando. Continue investigando.','bad');return;}if(!state.mechanic.found.includes(target.id))state.mechanic.found.push(target.id);if(state.mechanic.found.length===l.targets.filter(t=>t.correct).length){completeActivity(a.type==='lantern'?'Você encontrou todos os itens escondidos!':'Olho de detetive! Você encontrou todos os detalhes.');}else{renderGame();feedback(a.type==='lantern'?'Muito bem! Tem mais um item escondido.':'Achou! Continue procurando os próximos detalhes.','good');}}
  function answerCountPlate(index){
    if(state.complete)return;const l=currentLevel();
    if(index!==l.correct){feedback('Conte de novo e compare os pratos. Você consegue!','bad');return;}
    state.mechanic.quizProgress=(state.mechanic.quizProgress||0)+1;
    if(state.mechanic.quizProgress>=3){completeActivity('Você acertou as três rodadas de contagem!');return;}
    state.levelData=makeCountQuestion(state.level,state.mechanic.usedCountQuestions||[]);
    state.mechanic.usedCountQuestions.push(state.levelData.questionKey);
    renderGame();feedback(`Muito bem! ${state.mechanic.quizProgress} de 3 acertos. A próxima pergunta mudou!`,'good');
  }
  function answerMole(index){
    if(state.complete)return;const l=currentLevel();
    if(!(state.mechanic.visibleMoles||[]).includes(index))return;
    if(index!==l.correct){feedback('Quase! Observe a figura e escute o som final. A marmota vai aparecer de novo!','bad');return;}
    state.mechanic.moleProgress=(state.mechanic.moleProgress||0)+1;
    if(state.mechanic.moleProgress>=3){completeActivity('Você acertou três rodadas de rimas! Que ouvido esperto!');return;}
    const previousTarget=l.options[l.correct]?.[1];state.levelData=makeMoleQuestion(state.level,previousTarget);state.mechanic.visibleMoles=[];
    renderGame();feedback(`Rima certa! ${state.mechanic.moleProgress} de 3. As marmotas mudaram de lugar!`,'good');
  }
  function answerBubble(index,button){
    if(state.complete)return;const l=currentLevel();
    if(index!==l.correct){button?.classList.add('bubble-wrong');setTimeout(()=>button?.classList.remove('bubble-wrong'),320);feedback('Essa bolha não responde à pergunta. Continue procurando!','bad');return;}
    state.mechanic.bubbleProgress=(state.mechanic.bubbleProgress||0)+1;
    if(state.mechanic.bubbleProgress>=3){completeActivity('Plim, plim, plim! Você estourou três bolhas certas!');return;}
    const oldVariant=l.variantKey;
    state.levelData=makeBubbleQuestion(currentActivity().id,state.level,oldVariant);
    const next=currentLevel();
    const task=app.querySelector('.task-prompt-text');if(task)task.textContent=next.prompt;
    const instruction=app.querySelector('.activity-heading p');if(instruction)instruction.textContent=next.instruction;
    const progress=app.querySelector('.mini-challenge-progress');if(progress)progress.outerHTML=renderMiniProgress(currentActivity());
    const count=app.querySelector('.bubble-progress-count');if(count)count.textContent=`${state.mechanic.bubbleProgress} de 3 acertos`;
    app.querySelectorAll('.moving-bubble').forEach((bubble,i)=>{
      const value=next.options[i];bubble.dataset.optionIndex=String(i);bubble.disabled=false;
      bubble.setAttribute('aria-label',`Bolha ${value}`);
      const label=bubble.querySelector('.bubble-label');if(label)label.textContent=value;
    });
    if(button){button.classList.remove('popping');button.style.setProperty('animation','none','important');void button.offsetWidth;button.style.removeProperty('animation');}
    feedback(`Plim! ${state.mechanic.bubbleProgress} de 3 acertos. As bolhas continuam subindo!`,'good');
  }
  function setupScratch(){
    const canvas=app.querySelector('#scratch-canvas');
    if(!canvas||state.complete||canvas.dataset.scratchInitialized==='true')return;
    const rect=canvas.getBoundingClientRect();
    if(rect.width<2||rect.height<2)return;
    // Keep a CSS-pixel backing buffer. Pointer coordinates are scaled to this
    // buffer, so resizing the browser does not reset the scratching progress or
    // attach duplicate event handlers to the same canvas.
    canvas.width=Math.max(1,Math.floor(rect.width));
    canvas.height=Math.max(1,Math.floor(rect.height));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)return;
    const grad=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0,'#f89a58');grad.addColorStop(.5,'#d96338');grad.addColorStop(1,'#ef8a4b');
    ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<240;i++){
      ctx.fillStyle=i%2?'rgba(255,210,145,.16)':'rgba(130,55,24,.10)';
      ctx.beginPath();ctx.arc((i*97)%canvas.width,(i*47)%canvas.height,(i%4)+1,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='rgba(255,240,205,.95)';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=`bold ${Math.max(14,Math.min(22,canvas.width*.035))}px Trebuchet MS`;
    ctx.fillText('RASPE PARA DESCOBRIR ✦',canvas.width/2,canvas.height/2);
    let drawing=false,last=null,lastMeasure=0;
    // Little learners do not need to uncover half the card: once roughly one
    // third of the cover is removed, the picture is revealed and the meter ends
    // at 100% rather than getting stuck around the halfway mark.
    const targetErasedPercent=28;
    const coverage=()=>{
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let transparent=0,samples=0;
      // Uniform 4x4 sampling avoids the row-skew of walking through RGBA bytes
      // with a fixed stride, which could underestimate coverage on some sizes.
      for(let y=2;y<canvas.height;y+=4){
        for(let x=2;x<canvas.width;x+=4){
          samples++;
          if(data[(y*canvas.width+x)*4+3]<32)transparent++;
        }
      }
      const erasedPct=samples?transparent/samples*100:0;
      const pct=Math.min(99,Math.round(erasedPct/targetErasedPercent*100));
      state.mechanic.scratchPercent=pct;
      const fill=app.querySelector('#scratch-progress-fill'),label=app.querySelector('#scratch-progress-label');
      if(fill)fill.style.width=pct+'%';if(label)label.textContent=pct+'%';
      if(erasedPct>=targetErasedPercent&&!state.complete){
        state.mechanic.revealed=true;state.mechanic.scratchPercent=100;
        if(fill)fill.style.width='100%';if(label)label.textContent='100%';
        canvas.style.display='none';completeActivity('Descoberta feita! Você revelou o animal escondido.');return true;
      }
      return false;
    };
    const point=e=>{
      const r=canvas.getBoundingClientRect();
      return {x:(e.clientX-r.left)*(canvas.width/Math.max(1,r.width)),y:(e.clientY-r.top)*(canvas.height/Math.max(1,r.height))};
    };
    const setBrush=()=>{ctx.globalCompositeOperation='destination-out';ctx.lineWidth=Math.max(28,Math.min(48,canvas.width*.07));ctx.lineCap='round';ctx.lineJoin='round';};
    const eraseDot=p=>{setBrush();ctx.beginPath();ctx.arc(p.x,p.y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();};
    canvas.addEventListener('pointerdown',e=>{
      if(state.complete)return;
      drawing=true;last=point(e);eraseDot(last);
      try{canvas.setPointerCapture(e.pointerId);}catch{}
      coverage();e.preventDefault();
    });
    canvas.addEventListener('pointermove',e=>{
      if(!drawing||state.complete)return;
      const p=point(e);setBrush();ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();
      state.mechanic.strokeLength+=Math.hypot(p.x-last.x,p.y-last.y);last=p;
      if(performance.now()-lastMeasure>90){lastMeasure=performance.now();if(coverage())return;}
      e.preventDefault();
    });
    const endStroke=()=>{drawing=false;last=null;if(!state.complete)coverage();};
    canvas.addEventListener('pointerup',endStroke);canvas.addEventListener('pointercancel',endStroke);
    canvas.dataset.scratchInitialized='true';
  }

  function placeImagePiece(slotIndex,pieceIndex=state.mechanic.selectedPiece){
    if(state.complete)return false;
    if(pieceIndex===undefined||pieceIndex===null){feedback('Escolha uma peça e leve até o espaço que combina.','bad');return false;}
    const piece=Number(pieceIndex),slot=Number(slotIndex);
    if(!Number.isInteger(piece)||!Number.isInteger(slot)||piece<0||slot<0)return false;
    if(piece!==slot){state.mechanic.selectedPiece=piece;renderGame();feedback('Essa peça fica em outro lugar. Observe as cores e tente outro espaço.','bad');return false;}
    state.mechanic.placed[slot]=true;state.mechanic.selectedPiece=null;
    if(Object.keys(state.mechanic.placed).length===state.mechanic.puzzleCols*state.mechanic.puzzleRows){completeActivity('Você montou a imagem inteira!');return true;}
    renderGame();feedback('Peça encaixada! Continue montando.','good');return true;
  }

  function placeItem(itemId,zoneId){
    if(state.complete)return;const l=currentLevel();if(!Object.prototype.hasOwnProperty.call(l.correctMap,itemId))return;
    const needed=l.correctMap[itemId];const accepted=Array.isArray(needed)?needed:[needed];
    if(!accepted.includes(zoneId)){state.mechanic.selectedItem=itemId;renderGame();feedback('Quase! Leia as pistas das caixas e tente outra vez. O objeto continua selecionado.','bad');return;}
    state.mechanic.placements[itemId]=zoneId;state.mechanic.selectedItem=null;
    const done=Object.keys(l.correctMap).every(id=>{const req=l.correctMap[id],allowed=Array.isArray(req)?req:[req];return allowed.includes(state.mechanic.placements[id]);});
    if(done)completeActivity('Tudo no lugar certo! Excelente observação.');else{renderGame();feedback('Muito bem! Agora coloque o próximo objeto.','good');}
  }
  function feedSelected(){if(state.complete)return;const l=currentLevel(),name=state.mechanic.selectedFood;if(!name){feedback('Escolha primeiro um alimento para o Tobi.','bad');return;}const item=l.foods.find(f=>f[1]===name);if(!item)return;if(!item[2]){feedback('Opa! Esse item não segue a regra da brincadeira. Escolha outro alimento.','bad');return;}if(state.mechanic.fed.includes(name)){state.mechanic.selectedFood=null;feedback('Esse alimento já foi escolhido. Procure outro!');return;}state.mechanic.fed.push(name);state.mechanic.selectedFood=null;const targetCount=l.foods.filter(f=>f[2]).length;if(state.mechanic.fed.length===targetCount){completeActivity('O Tobi recebeu todos os alimentos que seguiam a regra!');}else{renderGame();feedback('Delicioso! Escolha o próximo alimento que segue a regra.','good');}}
  function startMoleCycle(){
    if(moleTimerId){clearTimeout(moleTimerId);moleTimerId=null;}
    if(!state.mechanic.moleStarted||state.complete)return;
    const pop=()=>{
      if(state.screen!=='game'||currentActivity().type!=='mole'||state.complete||!state.mechanic.moleStarted)return;
      const level=currentLevel();
      let order=state.mechanic.moleCycleOrder||[];
      if(!order.length)order=shuffleArray(level.options.map((_,i)=>i));
      const index=order.shift();state.mechanic.moleCycleOrder=order;
      state.mechanic.moleWaveCount=(state.mechanic.moleWaveCount||0)+1;
      state.mechanic.visibleMoles=[index];
      app.querySelectorAll('[data-mole-index]').forEach(node=>{
        const i=Number(node.dataset.moleIndex),up=i===index,option=level.options[i];
        node.classList.toggle('is-up',up);node.disabled=!up||state.complete;
        node.setAttribute('aria-label',up?`Marmota ${i+1}: ${option[1]}`:`Marmota ${i+1}, escondida`);
        const art=node.querySelector('.mole-creature'),word=node.querySelector('.mole-word');
        if(art)art.innerHTML=up?moleAnswerMarkup(option):'';
        if(word)word.textContent=up?option[1]:'';
      });
      const visibleMs=state.level==='easy'?4000:state.level==='medium'?3300:2700;
      const pauseMs=state.level==='easy'?900:state.level==='medium'?800:700;
      moleTimerId=setTimeout(pop,visibleMs+pauseMs);
    };
    pop();
  }
  function moveMaze(dir){if(state.complete)return;const l=currentLevel(),path=l.path,pos=state.mechanic.pos,solution=l.solutionPath||l.path;const delta={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]}[dir];if(!delta)return;const next=[pos[0]+delta[0],pos[1]+delta[1]];if(!path.some(p=>p[0]===next[0]&&p[1]===next[1])){feedback('Bateu na parede! Procure outra passagem.','bad');return;}state.mechanic.pos=next;state.mechanic.visited=state.mechanic.visited||[];state.mechanic.visited.push(next.slice());if(next[0]===solution[solution.length-1][0]&&next[1]===solution[solution.length-1][1]){completeActivity('Você encontrou a saída do labirinto!');}else renderGame();}
  function setMixColor(){const picked=state.mechanic.pickedColors;if(picked.includes('yellow')&&picked.includes('red')){state.mechanic.selectedColor='orange';renderGame();feedback('Mistura pronta: amarelo + vermelho = laranja! Agora pinte o desenho.','good');}else feedback('Escolha a tinta amarela e a vermelha antes de misturar.','bad');}
  function handlePaintRegion(id){if(state.complete)return;const l=currentLevel(),r=l.regions.find(x=>x.id===id),color=state.mechanic.selectedColor;if(!color){feedback('Escolha uma cor na paleta primeiro.','bad');return;}if(color!==r.correct){feedback('Essa cor não corresponde à instrução. Tente outra!','bad');return;}state.mechanic.painted[id]=color;const all=l.regions.every(region=>state.mechanic.painted[region.id]===region.correct);if(all)completeActivity('Pintura correta! Você seguiu as pistas de cores.');else{renderGame();feedback('Cor certa! Continue pintando as outras partes.','good');}}
  function handleMatch(side,index){
    if(state.complete)return;const m=state.mechanic,l=currentLevel();
    if(side==='left'){
      if(m.matched.includes(index))return;
      m.selectedLeft=index;renderGame();feedback('Agora toque no cartão correspondente da outra coluna.');return;
    }
    if(m.selectedLeft===null||m.selectedLeft===undefined){feedback('Escolha primeiro um cartão da coluna A.','bad');return;}
    const left=m.selectedLeft;
    if(left===index){m.matched.push(index);m.selectedLeft=null;if(m.matched.length===l.pairs.length)completeActivity('Você conectou todos os pares corretamente!');else{renderGame();feedback('Ligação certa! Continue com o próximo par.','good');}return;}
    m.selectedLeft=null;renderGame();feedback('Esses cartões não combinam. Tente outra ligação.','bad');
  }

  function handleClick(event){const btn=event.target.closest('button');if(!btn||!app.contains(btn))return;if(Date.now()<state.suppressClickUntil&&btn.matches('[data-item-id],[data-food-name],[data-zone-id],[data-feed-target],[data-image-piece],[data-image-slot]')){event.preventDefault();return;}
    if(btn.dataset.action){const action=btn.dataset.action;switch(action){
      case'choose-level':renderLevelSelect(true);return;
      case'show-attractions':closeInitialIntro();renderLevelSelect(true);return;
      case'home':case'menu':closeInitialIntro();renderHome();playNarrationFiles(['Volte ao menu inicial.mp3'],'Você voltou ao menu inicial.');return;
      case'sound':toggleSound();return;
      case'music':toggleSound();return;
      case'speak-coming-soon':playNarrationFiles(['Mais níveis estão por vir.mp3'],'Mais níveis estão por vir. Continue explorando!');return;
      case'random-round':case'start-adventure':closeInitialIntro();startRandomRound();return;
      case'start-mole':if(currentActivity().type==='mole'&&!state.complete){state.mechanic.moleStarted=true;state.mechanic.moleCycleOrder=shuffleArray(currentLevel().options.map((_,i)=>i));renderGame();return;}
      case'next':goNextActivity();return;
      case'finish':renderFinish();return;
      case'restart':initMechanic();renderGame();return;
      case'hint':{const hint=currentLevel().instruction||currentLevel().prompt;playActivityNarration(hint);feedback('Dica: '+hint);return;}
      case'speak-word':say(currentLevel().word||currentLevel().speech||currentLevel().prompt);return;
      case'speak-question':{const level=currentLevel();playRecordedText(level.prompt||'',{showMissing:true});return;}
      case'speak-activity':{const activity=currentActivity(),level=currentLevel();playRecordedSequence([level.title||activity.title,level.prompt||''],{showMissing:true});return;}
      case'feed':feedSelected();return;
      case'mix-colors':setMixColor();return;
    }}
    if(btn.dataset.level){chooseLevel(btn.dataset.level);return;}
    if(btn.dataset.activity!==undefined){openActivity(Number(btn.dataset.activity));return;}
    if(state.screen!=='game')return;
    const a=currentActivity(),l=currentLevel();
    if(btn.dataset.speakChoice!==undefined){const idx=Number(btn.dataset.speakChoice);say(l.options[idx]?.word||'');return;}
    if(btn.dataset.wordOption!==undefined){const idx=Number(btn.dataset.wordOption);checkAnswer(idx,l.correct,`Isso! ${l.options[idx].word} tem quatro sílabas.`);return;}
    if(btn.dataset.emotionPiece!==undefined){selectEmotionPiece(Number(btn.dataset.emotionPiece));return;}
    if(btn.dataset.emotionSlot!==undefined){insertEmotionPiece();return;}
    if(btn.dataset.optionIndex!==undefined){const idx=Number(btn.dataset.optionIndex);if(a.type==='train'){state.mechanic.trainAnswer=l.options[idx];state.mechanic.trainAnswerIndex=idx;if(idx===l.correct){checkAnswer(idx,l.correct,l.explanation);}else{renderGame();feedback('Essa peça já foi colocada no trem. Observe o padrão e escolha outra opção.','bad');}return;}if(a.type==='soundquiz'){checkAnswer(idx,l.correct,`Isso! O instrumento correto é ${l.options[idx]}.`);return;}if(a.type==='emotion'){return;}if(a.type==='quiz'){if(a.id===1)answerCountPlate(idx);else checkAnswer(idx,l.correct,l.explanation);return;}if(a.type==='bubble'){if(idx===l.correct){btn.classList.add('popping');btn.disabled=true;const activityId=a.id,levelAtClick=state.level;setTimeout(()=>{if(state.screen==='game'&&!state.complete&&currentActivity().id===activityId&&state.level===levelAtClick)answerBubble(idx,btn);},180);}else answerBubble(idx,btn);return;}return;}
    if(btn.dataset.plateIndex!==undefined){const idx=Number(btn.dataset.plateIndex);if(a.id===1)answerCountPlate(idx);else checkAnswer(idx,l.correct,l.explanation);return;}
    if(btn.dataset.moleIndex!==undefined){const idx=Number(btn.dataset.moleIndex);answerMole(idx);return;}
    if(btn.dataset.itemId){state.mechanic.selectedItem=btn.dataset.itemId;app.querySelectorAll('.drag-token').forEach(node=>{node.classList.toggle('chosen',node.dataset.itemId===btn.dataset.itemId);node.setAttribute('aria-pressed',String(node.dataset.itemId===btn.dataset.itemId));});app.querySelectorAll('.drop-zone').forEach(node=>node.classList.add('drop-ready'));feedback(`Selecionado: ${btn.querySelector('small')?.textContent||'objeto'}. Agora toque no destino correto.`);return;}
    if(btn.dataset.zoneId){const item=state.mechanic.selectedItem;if(!item){feedback('Toque num objeto primeiro e depois no destino.','bad');return;}placeItem(item,btn.dataset.zoneId);return;}
    if(btn.dataset.foodName){state.mechanic.selectedFood=btn.dataset.foodName;renderGame();return;}
    if(btn.dataset.syllableCount!==undefined){answerSyllableCount(Number(btn.dataset.syllableCount));return;}
    if(btn.dataset.dir){moveMaze(btn.dataset.dir);return;}
    if(btn.dataset.imagePiece!==undefined){state.mechanic.selectedPiece=Number(btn.dataset.imagePiece);renderGame();return;}
    if(btn.dataset.imageSlot!==undefined){placeImagePiece(Number(btn.dataset.imageSlot));return;}
    if(btn.dataset.pieceId){selectPuzzlePiece(btn.dataset.pieceId);return;}
    if(btn.dataset.slotId){placePuzzlePiece(btn.dataset.slotId);return;}
    if(btn.dataset.color){const color=btn.dataset.color;state.mechanic.selectedColor=color;const l2=currentLevel();if(l2.mix&&['yellow','red'].includes(color)){if(!state.mechanic.pickedColors.includes(color))state.mechanic.pickedColors.push(color);}renderGame();return;}
    if(btn.dataset.regionId){handlePaintRegion(btn.dataset.regionId);return;}
    if(btn.dataset.pairLeft!==undefined){handleMatch('left',Number(btn.dataset.pairLeft));return;}
    if(btn.dataset.pairRight!==undefined){handleMatch('right',Number(btn.dataset.pairRight));return;}
    if(btn.dataset.targetId&&(a.type==='lantern'||a.type==='detective')){findHiddenTarget(btn.dataset.targetId);return;}
    if(btn.dataset.memoryIndex!==undefined){handleMemory(Number(btn.dataset.memoryIndex));return;}
    if(btn.dataset.dotIndex!==undefined){handleDot(Number(btn.dataset.dotIndex));return;}
    if(btn.dataset.playSample){playInstrument(btn.dataset.playSample);return;}
  }

  function handleMemory(index){const l=currentLevel(),m=state.mechanic;if(m.flipped.includes(index)||m.matched.includes(index)||m.flipped.length>=2)return;m.flipped.push(index);if(m.flipped.length===2){const [i,j]=m.flipped;const first=l.cards[i],second=l.cards[j];renderGame();if(first.key===second.key&&first.key===l.targetKey){m.matched.push(i,j);m.flipped=[];completeActivity('Par correto! Você encontrou exatamente a correspondência pedida.');}else{memoryTimeout=setTimeout(()=>{m.flipped=[];memoryTimeout=null;renderGame();feedback(first.key===second.key?'Esse par combina, mas procure o par pedido no desafio.':'Essas cartas são diferentes. Vire outras duas!','bad');},850);}return;}renderGame();}
  function handleDot(index){const points=currentLevel().points,n=state.mechanic.nextDot;if(index!==n){feedback('Siga a ordem das letras ou dos números.','bad');return;}state.mechanic.nextDot++;if(state.mechanic.nextDot===points.length)completeActivity('Todos os pontos foram conectados na ordem certa!');else renderGame();}
  function renderFinish(){
    stopTimers();stopVoicePlayback();state.screen='finish';const count=state.roundCompleted.size,levelLabel=LEVELS[state.level].label;
    app.innerHTML=`<section class="garden-screen finish-screen"><header class="scene-toolbar finish-toolbar"><div class="scene-wordmark">${brandMarkup()}</div>${musicButton()}</header><section class="paper-panel finish-panel"><img class="finish-mascot" src="assets/img/ilustracoes/tobi.webp" alt="Tobi comemorando"><h1 class="page-title">Parabéns, explorador!</h1><p class="page-subtitle">Você concluiu os desafios do nível ${levelLabel.toLowerCase()}! Cada brincadeira ajudou você a descobrir algo novo.</p><div class="finish-stats"><div><strong>🎉 ${count}/${CHALLENGES_PER_LEVEL}</strong><span>atividades concluídas · ${levelLabel}</span></div><div><strong>🏅 ${state.completed.size}/60</strong><span>desafios no total</span></div></div><p class="finish-catalog-note">Você explorou, pensou e aprendeu. Continue sua aventura!</p><div class="game-actions"><button type="button" class="soft-button" data-action="speak-coming-soon">🔊 Ouvir recado</button><button type="button" class="wood-button primary" data-action="start-adventure">🎲 Jogar outra vez · ${levelLabel}</button><button type="button" class="soft-button" data-action="home">Voltar ao início</button></div></section></section>`;
  }

  function pointerDragStart(e){
    if(e.button!==undefined&&e.button!==0)return;
    const item=e.target.closest('[data-item-id],[data-food-name],[data-image-piece]');
    if(!item||state.screen!=='game'||state.complete)return;
    const kind=item.dataset.itemId?'item':item.dataset.foodName?'food':'puzzle-piece';
    state.pointerDrag={element:item,kind,id:item.dataset.itemId||item.dataset.foodName||item.dataset.imagePiece,startX:e.clientX,startY:e.clientY,pointerId:e.pointerId,pointerType:e.pointerType||'mouse',dragging:false};
    try{item.setPointerCapture(e.pointerId);}catch(error){}
  }
  function pointerDragMove(e){
    const drag=state.pointerDrag;
    if(!drag){trackPointer(e);return;}
    if(drag.pointerId!==undefined&&e.pointerId!==undefined&&e.pointerId!==drag.pointerId)return;
    const distance=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY);
    const threshold=drag.pointerType==='touch'?5:4;
    if(!drag.dragging&&distance>threshold){drag.dragging=true;drag.element.classList.add('drag-source');const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.setAttribute('aria-hidden','true');ghost.textContent=drag.element.innerText.trim();document.body.appendChild(ghost);}
    if(drag.dragging){e.preventDefault();const ghost=document.querySelector('.drag-ghost');if(ghost){ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;}
      app.querySelectorAll('.drop-zone,[data-feed-target],[data-image-slot]').forEach(el=>el.classList.remove('drag-hover'));
      const selector=drag.kind==='puzzle-piece'?'[data-image-slot]':'[data-zone-id],[data-feed-target]';
      const dest=document.elementFromPoint(e.clientX,e.clientY)?.closest(selector);if(dest)dest.classList.add('drag-hover');
    }else trackPointer(e);
  }
  function pointerDragEnd(e){
    const drag=state.pointerDrag;if(!drag)return;
    if(drag.pointerId!==undefined&&e.pointerId!==undefined&&e.pointerId!==drag.pointerId)return;
    if(drag.dragging&&e.type!=='pointercancel'){
      e.preventDefault();const selector=drag.kind==='puzzle-piece'?'[data-image-slot]':'[data-zone-id],[data-feed-target]';const dest=document.elementFromPoint(e.clientX,e.clientY)?.closest(selector);
      if(dest?.dataset.zoneId&&drag.kind==='item')placeItem(drag.id,dest.dataset.zoneId);
      else if(dest?.hasAttribute('data-feed-target')&&drag.kind==='food'){state.mechanic.selectedFood=drag.id;feedSelected();}
      else if(dest?.dataset.imageSlot!==undefined&&drag.kind==='puzzle-piece')placeImagePiece(Number(dest.dataset.imageSlot),Number(drag.id));
      else feedback('Solte a peça no espaço correspondente. Você também pode tocar na peça e depois no espaço.','bad');
      state.suppressClickUntil=Date.now()+320;
    }
    try{if(drag.pointerId!==undefined&&drag.element.hasPointerCapture?.(drag.pointerId))drag.element.releasePointerCapture(drag.pointerId);}catch(error){}
    clearPointerDrag();
  }

  function handleDragStart(e){const item=e.target.closest('[data-item-id],[data-food-name]');if(!item)return;const data=item.dataset.itemId?JSON.stringify({kind:'item',id:item.dataset.itemId}):JSON.stringify({kind:'food',id:item.dataset.foodName});if(e.dataTransfer){e.dataTransfer.setData('text/plain',data);e.dataTransfer.effectAllowed='move';}if(item.dataset.itemId)state.mechanic.selectedItem=item.dataset.itemId;if(item.dataset.foodName)state.mechanic.selectedFood=item.dataset.foodName;}
  function handleDragOver(e){if(e.target.closest('[data-zone-id],[data-feed-target]'))e.preventDefault();}
  function handleDrop(e){const zone=e.target.closest('[data-zone-id]'),feed=e.target.closest('[data-feed-target]');if(!zone&&!feed)return;e.preventDefault();let payload={};try{payload=JSON.parse(e.dataTransfer?.getData('text/plain')||'{}');}catch{}if(zone&&payload.kind==='item')placeItem(payload.id,zone.dataset.zoneId);if(feed&&payload.kind==='food'){state.mechanic.selectedFood=payload.id;feedSelected();}}
  function trackPointer(e){const spotlight=e.target.closest('#spotlight-board');if(spotlight){const r=spotlight.getBoundingClientRect();spotlight.style.setProperty('--spot-x',`${((e.clientX-r.left)/r.width)*100}%`);spotlight.style.setProperty('--spot-y',`${((e.clientY-r.top)/r.height)*100}%`);}const detective=e.target.closest('#detective-scene');if(detective){const r=detective.getBoundingClientRect();detective.style.setProperty('--lens-x',`${((e.clientX-r.left)/r.width)*100}%`);detective.style.setProperty('--lens-y',`${((e.clientY-r.top)/r.height)*100}%`);}}
  function positionSpotlight(el){if(el){el.style.setProperty('--spot-x','50%');el.style.setProperty('--spot-y','50%');}}
  function playInstrument(kind){if(!soundEnabled)return showToast('O som está desligado. Ative o som para ouvir os instrumentos.');try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const ctx=audioContext,now=ctx.currentTime;const gain=ctx.createGain();gain.connect(ctx.destination);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.45,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+(kind==='violin'?1.7:kind==='guitar'?0.65:0.45));
      if(kind==='kick'){const osc=ctx.createOscillator();osc.type='sine';osc.frequency.setValueAtTime(145,now);osc.frequency.exponentialRampToValueAtTime(42,now+.25);osc.connect(gain);osc.start(now);osc.stop(now+.48);}
      else if(kind==='guitar'){const osc=ctx.createOscillator();osc.type='triangle';osc.frequency.value=196;osc.connect(gain);osc.start(now);osc.stop(now+.7);}
      else if(kind==='triangle'){const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=1318;osc.connect(gain);osc.start(now);osc.stop(now+.6);}
      else if(kind==='drum'){const buffer=ctx.createBuffer(1,ctx.sampleRate*.38,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);const src=ctx.createBufferSource();src.buffer=buffer;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=420;src.connect(filter);filter.connect(gain);src.start(now);}
      else if(kind==='violin'){const osc=ctx.createOscillator();osc.type='sawtooth';osc.frequency.value=659;const vibrato=ctx.createOscillator();vibrato.frequency.value=5;const vg=ctx.createGain();vg.gain.value=4;vibrato.connect(vg);vg.connect(osc.frequency);const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1800;osc.connect(filter);filter.connect(gain);osc.start(now);vibrato.start(now);osc.stop(now+1.7);vibrato.stop(now+1.7);}
      showToast('Ouça com atenção e escolha o instrumento!');}catch(e){say('Ouça os sons 1 e 2 e escolha o instrumento correto.');}}

  app.addEventListener('click',handleClick);
  app.addEventListener('pointerdown',event=>{trackPointer(event);pointerDragStart(event);});
  window.addEventListener('pointermove',pointerDragMove,{passive:false});
  window.addEventListener('pointerup',pointerDragEnd,{passive:false});
  window.addEventListener('pointercancel',pointerDragEnd,{passive:false});
  window.addEventListener('keydown',e=>{if(state.screen!=='game'||currentActivity().type!=='maze')return;const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};if(map[e.key]){e.preventDefault();moveMaze(map[e.key]);}});
  renderHome();
  updateMusic();
  startOpeningNarration();
})();
