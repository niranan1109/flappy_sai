const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const birdImg = new Image();
birdImg.src = "face.png";

const pipeImg = new Image();
pipeImg.src = "mypipe.png";

const bgImg = new Image();
bgImg.src = "background.png";

const groundImg = new Image();
groundImg.src = "ground.png";

const certificateImg = new Image();
certificateImg.src = "certificate.png";

const startSound = new Audio("start.mp3");
const deadSound = new Audio("dead.mp3");

startSound.loop = true;

const groundHeight = 80;

let birdX = 100;
let birdY = 250;

let velocity = 0;
let gravity = 0.5;

let pipeWidth = 70;
let pipeSpacing = 260;
let gap = 170;

let pipes = [];

let score = 0;
let bestScore = localStorage.getItem("flappySaiBest") || 0;

let speed = 2;

let gameStarted = false;
let gameOver = false;
let deathTimer = 0;

let popupScale = 0;
let showCertificate = false;

function createPipes(){

pipes=[];

for(let i=0;i<3;i++){

let gapY=Math.random()*(canvas.height-groundHeight-gap-100)+50;

pipes.push({
x:canvas.width+i*pipeSpacing,
gapY:gapY
});

}

}

createPipes();

function jump(){

if(!gameStarted){

gameStarted=true;
velocity=-8;

startSound.currentTime=0;
startSound.play();

return;

}

if(gameOver){

if(Date.now()-deathTimer>3000){
resetGame();
}

return;

}

velocity=-8;

}

document.addEventListener("keydown",e=>{
if(e.code==="Space") jump();
});

canvas.addEventListener("mousedown",jump);

canvas.addEventListener("touchstart",e=>{
e.preventDefault();
jump();
});

function resetGame(){

deadSound.pause();
deadSound.currentTime=0;

startSound.pause();
startSound.currentTime=0;

popupScale=0;
showCertificate=false;

birdY=250;
velocity=0;
score=0;
speed=2;

gameOver=false;
gameStarted=false;

createPipes();

}

function drawBird(){

ctx.save();

ctx.translate(birdX+22,birdY+22);

let angle=velocity*0.08;

if(angle>0.6) angle=0.6;
if(angle<-0.6) angle=-0.6;

ctx.rotate(angle);

ctx.drawImage(birdImg,-22,-22,45,45);

ctx.restore();

}

function gameLoop(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

ctx.drawImage(
groundImg,
0,
canvas.height-groundHeight,
canvas.width,
groundHeight
);

if(!gameStarted){

ctx.fillStyle="rgba(0,0,0,0.4)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
ctx.textAlign="center";

ctx.font="50px Arial";
ctx.fillText("Flappy Sai",200,250);

ctx.font="25px Arial";
ctx.fillText("Tap to Start",200,310);

ctx.textAlign="left";

requestAnimationFrame(gameLoop);
return;

}

if(!gameOver){

velocity+=gravity;
birdY+=velocity;

pipes.forEach(pipe=>{

pipe.x-=speed;

if(pipe.x<-pipeWidth){

pipe.x+=pipeSpacing*pipes.length;

pipe.gapY=Math.random()*(canvas.height-groundHeight-gap-100)+50;

score++;

if(score>bestScore){
bestScore=score;
localStorage.setItem("flappySaiBest",bestScore);
}

if(score==20) speed=3;
if(score==40) speed=4;
if(score==60) speed=5;

}

if(
birdX+45>pipe.x &&
birdX<pipe.x+pipeWidth &&
(birdY<pipe.gapY || birdY+45>pipe.gapY+gap)
){

gameOver=true;

deathTimer=Date.now();

startSound.pause();
startSound.currentTime=0;

deadSound.currentTime=0;
deadSound.play();

showCertificate=true;

}

});

if(birdY<0 || birdY+45>canvas.height-groundHeight){

gameOver=true;

deathTimer=Date.now();

startSound.pause();
startSound.currentTime=0;

deadSound.currentTime=0;
deadSound.play();

showCertificate=true;

}

}

drawBird();

pipes.forEach(pipe=>{

ctx.drawImage(
pipeImg,
pipe.x,
0,
pipeWidth,
pipe.gapY
);

ctx.drawImage(
pipeImg,
pipe.x,
pipe.gapY+gap,
pipeWidth,
canvas.height-groundHeight-(pipe.gapY+gap)
);

});

ctx.fillStyle="white";
ctx.font="22px Arial";
ctx.fillText("Score: "+score,20,40);
ctx.fillText("Best: "+bestScore,20,70);

if(gameOver){

ctx.textAlign="center";

ctx.fillStyle="red";
ctx.font="40px Arial";
ctx.fillText("Sai Died",200,180);

if(showCertificate){

ctx.fillStyle="rgba(0,0,0,0.7)";
ctx.fillRect(0,0,canvas.width,canvas.height);

if(popupScale<1){
popupScale+=0.03;
}

let width=canvas.width*0.7*popupScale;
let height=canvas.height*0.7*popupScale;

ctx.drawImage(
certificateImg,
canvas.width/2-width/2,
canvas.height/2-height/2,
width,
height
);

}

if(Date.now()-deathTimer>3000){

ctx.fillStyle="white";
ctx.font="20px Arial";
ctx.fillText("Tap to Restart",200,560);

}

ctx.textAlign="left";

}

requestAnimationFrame(gameLoop);

}

gameLoop();