console.log('[Thfrod] Flappy Bird');


try {
  var recorde = localStorage.getItem("recorde-flappyBird");
}catch{
  var recorde = 0;
  localStorage.setItem('recorde-flappyBird',recorde)
}
 
let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';


const som_ponto = new Audio();
som_ponto.src = './efeitos/ponto.wav'

const som_pulo = new Audio();
som_pulo.src = './efeitos/pulo.wav'

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav'

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');



//[Chão]

function criaChao(){
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura : 112,
    x:0,
    y: canvas.height-112,
    atualiza(){
      const movimentoChao = 1;
      const repeteEm = chao.largura/2;
      const movimentacao = chao.x - movimentoChao;

      chao.x = movimentacao % repeteEm;
  
    },
    
    desenha(){
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY, //sprite x and y 
        chao.largura, chao.altura, //Tamanho do recorte na sprite
        chao.x,chao.y, // Posição X e Y no canvas
        chao.largura,chao.altura
      );
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY, //sprite x and y 
        chao.largura, chao.altura, //Tamanho do recorte na sprite
        (chao.x + chao.largura),chao.y, // Posição X e Y no canvas
        chao.largura,chao.altura
      );
    }
    
  }
  return chao;
}


//[plano de fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0, 
  largura: 275,
  altura : 204,
  x:0,
  y: canvas.height- 204,
  desenha(){
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0,canvas.width,canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY, //sprite x and y 
      planoDeFundo.largura, planoDeFundo.altura, //Tamanho do recorte na sprite
      planoDeFundo.x,planoDeFundo.y, // Posição X e Y no canvas
      planoDeFundo.largura,planoDeFundo.altura
    );
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY, //sprite x and y 
      planoDeFundo.largura, planoDeFundo.altura, //Tamanho do recorte na sprite
      (planoDeFundo.x + planoDeFundo.largura),planoDeFundo.y, // Posição X e Y no canvas
      planoDeFundo.largura,planoDeFundo.altura
    );
  }

}


function fazColisao(flappyBird,chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY){
    return true;
  }
    return false;
}

function criaFlappyBird(){
  // [Bird] 
  const flappyBird = {
    spriteX: 0,
    spriteY: 0, 
    largura: 33, 
    altura : 24,
    x:15,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo:4.6,

    
    pula(){
      flappyBird.velocidade =- flappyBird.pulo;
    },
    atualiza(){
      if(fazColisao(flappyBird,globais.chao)){
        //console.log("Faz colisão");
        som_HIT.play();
        mudaParaTela(telas.GAME_OVER);  
        return;

      }
      flappyBird.velocidade += flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;

    },

    movimentos: [
      {spriteX:0,spriteY:0}, //Asa para cima
      {spriteX:0,spriteY:26},//Asa no centro
      {spriteX:0,spriteY:52},//Asa para baixo
    ],
    frameAtual: 0,

    atualizaFrameAtual(){
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      if(passouOIntervalo){
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
        
      }

    },
    desenha(){
      flappyBird.atualizaFrameAtual();
      const {spriteX,spriteY} = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX,spriteY, //sprite x and y 
        flappyBird.largura, flappyBird.altura, //Tamanho do recorte na sprite
        flappyBird.x,flappyBird.y, // Posição X e Y no canvas
        flappyBird.largura, flappyBird.altura
      );

    }
  }
  return flappyBird;
}

//[Mensagem Get Ready]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  largura:174,
  altura: 152,
  x: (canvas.width / 2) - 174 /2 ,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites, 
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.largura, mensagemGetReady.altura,
      mensagemGetReady.x,mensagemGetReady.y,
      mensagemGetReady.largura,mensagemGetReady.altura

    );
  }
}

//[Mensagem Game Over]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  largura:226,
  altura: 200,
  x: (canvas.width / 2) - 226 /2 ,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites, 
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.largura, mensagemGameOver.altura,
      mensagemGameOver.x,mensagemGameOver.y,
      mensagemGameOver.largura,mensagemGameOver.altura

    );
  }
}

//Moedas 
const moeda = {
  trocaMoeda(){
    if(globais.placar.pontuacao <= 10){
      return { 
        sX : 49,
        sY : 122
      }
    }
    if(globais.placar.pontuacao <= 30){
      return { 
        sX : 49,
        sY : 77
      }
    }
    if(globais.placar.pontuacao <= 50){
      return { 
        sX : 0,
        sY : 122
      }
    }
    
    return { 
      sX : 0,
      sY : 77
    }
    
  },
  
  
  largura:45,
  altura: 47,
  x: (canvas.width / 2)-85,
  y: 135,

  desenha(){
    let posicao = moeda.trocaMoeda();

    contexto.drawImage(
      sprites, 
      posicao.sX, posicao.sY,
      moeda.largura, moeda.altura,
      moeda.x,moeda.y,
      moeda.largura,moeda.altura

    );
  }
};




function criaCanos(){
  const canos = {
    largura:52,
    altura:400,
    chao: {
      spriteX: 0,
      spriteY:169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco:80,
    desenha(){
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;


        const canoCeuX = par.x;
        const canoCeuY = yRandom;
        // [Canos do Céu] 
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura,canos.altura,
          canoCeuX,canoCeuY,
          canos.largura,canos.altura,
        )

        // [Canos do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        //Cano da terra  
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura,canos.altura,
          canoChaoX,canoChaoY,
          canos.largura,canos.altura,
        )

        par.canoCeu = {
          x:canoCeuX,
          y: canos.altura + canoCeuY,
        }

        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        }

      });
      
    },


    temColisaoComOFlappyBird(par){
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if ((globais.flappyBird.x + globais.flappyBird.largura -2) >= par.x){
        //console.log("Flappy bird bateu no cano")

        if(cabecaDoFlappy <= par.canoCeu.y){
          return true;
        };

        if(peDoFlappy >= par.canoChao.y){
          return true;
        };
      }
      return false;
    },
    pares:[],

    atualiza(){
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames){
        //console.log("Passou 100 frames")
        canos.pares.push({
          x:canvas.width,
          y:-150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par){
        par.x = par.x -2;

        if(canos.temColisaoComOFlappyBird(par)){
          //console.log("Você perdeu!")
          som_HIT.play();
          
          mudaParaTela(telas.GAME_OVER);
          
        }

        if(par.x + canos.largura <= 0){
          canos.pares.shift();

        }
      });

    }


  }

  return canos;
}


function criaPlacar(){
  const placar = {
    pontuacao:0,
    desenha(placarX = 10,placarY = 35){
      
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = "white";
      contexto.fillText(`${placar.pontuacao}`,canvas.width - placarX,placarY);

      
    },
    limpar(){
      contexto.fillText('');
    },
    atualiza(){
      if (frames > 110){
        const largura = globais.canos.largura;
        const prx_cano = Math.min(...globais.canos.pares.map((par) => par.x + largura));
        const pos_fb = globais.flappyBird.x;
        
        if (prx_cano == pos_fb-1){
          placar.pontuacao +=1;
          som_ponto.play();
        }
      }
    }
  }
  return placar;
}

//
//[Telas]
//
const globais={}
let telaAtiva = {};
function mudaParaTela(novaTela){
  telaAtiva = novaTela;
  if(telaAtiva.inicializa()){
    inicializa();
  }
};


const telas = {
  INICIO:{
    inicializa(){
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click(){
      mudaParaTela(telas.jogo)
    },
    atualiza(){
      globais.chao.atualiza();
      
    }
  },

  jogo:{
    inicializa(){
      globais.placar = criaPlacar();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      globais.placar.desenha();
  
    },
    click(){
      globais.flappyBird.pula();
      som_pulo.play();
    },
    
    atualiza(){
      globais.canos.atualiza();
      globais.chao.atualiza();
      globais.flappyBird.atualiza();
      globais.placar.atualiza();
    }
  },
  GAME_OVER:{
    inicializa(){},
    desenha(){
      mensagemGameOver.desenha();
      moeda.desenha();
      globais.placar.desenha(70,149);
      recorde = globais.placar.pontuacao >recorde ?  globais.placar.pontuacao :recorde;
      localStorage.setItem('recorde-flappyBird',recorde);
      contexto.fillText(`${recorde}`,canvas.width - 70,189);
    },
    atualiza(){},
    click(){
      mudaParaTela(telas.INICIO);
    }


  }
}

 
//executas
function loop(){
  
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames+=1;
  requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
  
});

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    if(telaAtiva.click){
      telaAtiva.click();
    }
  }
})


mudaParaTela(telas.INICIO);
loop();