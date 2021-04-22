console.log('[Thfrod] Flappy Bird');


let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';

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

        setTimeout(() =>{

          mudaParaTela(telas.INICIO);
        },500);
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
    },
    desenha(){
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      //mensagemGetReady.desenha();
    },
    click(){
      mudaParaTela(telas.jogo)
    },
    atualiza(){
      globais.chao.atualiza();
    }
  },

  jogo:{
    desenha(){
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
  
    },
    click(){
      globais.flappyBird.pula();
    },
    
    atualiza(){
      globais.flappyBird.atualiza();
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

mudaParaTela(telas.INICIO);
loop();