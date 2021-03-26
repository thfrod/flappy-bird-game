console.log('[Thfrod] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const flappyBird = {
  spriteX: 0,
  spriteY: 0, 
  largura: 33,
  altura : 24,
  x:10,
  y: 50,
  desenha(){
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, //sprite x and y 
      flappyBird.largura, flappyBird.altura, //Tamanho do recorte na sprite
      flappyBird.x,flappyBird.y, // Posição X e Y no canvas
      33,24
    );

  }
}

const chao = {
  spriteX: 0,
  spriteY: 610, 
  largura: 224,
  altura : 112,
  x:canvas.height - 112,
  y: 50,
  desenha(){
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, //sprite x and y 
      flappyBird.largura, flappyBird.altura, //Tamanho do recorte na sprite
      flappyBird.x,flappyBird.y, // Posição X e Y no canvas
      33,24
    );

  }
}



function loop(){
  flappyBird.desenha();
  requestAnimationFrame(loop);
};
  
loop();