// Tunio 2019
// Touch and Go 2

const LaJavanaise = "J'avoue j'en ai bavé pas vous Mon amour Avant d'avoir eu vent de vous Mon amour Ne vous déplaise En dansant la Javanaise Nous nous aimions Le temps d'une Chanson À votre avis qu'avons-nous vu De l'amour? De vous à moi vous m'avez eu Mon amour Ne vous déplaise En dansant la Javanaise Nous nous aimions Le temps d'une Chanson Hélas avril en vain me voue À l'amour J'avais envie de voir en vous Cet amour Ne vous déplaise En dansant la Javanaise Nous nous aimions Le temps d'une Chanson La vie ne vaut d'être vécue Sans amour Mais c'est vous qui l'avez voulu Mon amour Ne vous déplaise En dansant la Javanaise Nous nous aimions Le temps d'une Chanson";
let moments = 0;
const passby = 0.04;
const so = 36;
const perfect = 36;
let rb = 0;
let chanteur = [];
var i,j,k;
var TQ;

function preload(){
  TQ = loadSound('TQ_ThisShouldBeUs.mp3');
}

function setup(){
  createCanvas(900,900);
  background(0);
  noStroke();
  frameRate(100);
  chanteur = split(LaJavanaise, ' ');
  TQ.play();
}

function draw(){
  noStroke();
  fill(0,100);  
  rect(0,0,width,height);
  fill(180+75*noise(moments*10));
  ellipse(width/2,height/2,60,60);

  stroke(0,150);
  strokeWeight(2);
  noFill();
  ellipse(width/2,height/2,60*sin(moments),60);
  push();
  translate(width/2,height/2);
  rotate(moments);
  ellipse(0,0,60*sin(moments+PI/2),60);
  pop();
  noStroke();
  
  moments = moments + passby;
  
  restateAssumptions(0,255,0);
  restateAssumptions(PI/2,255,4.2);
  restateAssumptions(PI,255,5.21);
  restateAssumptions(3*PI/2,255,8.91);


  
  restateAssumptions(3*PI/2+2*PI*random(1),255,10);
  restateAssumptions(3*PI/2+2*PI*random(1),255,5.123);
  restateAssumptions(3*PI/2+2*PI*random(1),255,2.512);
  restateAssumptions(3*PI/2+2*PI*random(1),255,7.1233);
  restateAssumptions(3*PI/2+2*PI*random(1),255,12.512);
  
  push();
  translate(width/2,height/2);
  JeComprendsPas();
  pop();

  sowhen(0);
  sowhen(0);
  sowhen(100);
  
  if(rb == chanteur.length-1){
    rb = 0;
  } else {
    rb++;
  }
  
  //fill(0);
  stroke(255,100);
  textSize(15);
  strokeWeight(2);
  text(chanteur[rb],width-100,height - 40);
}

function sowhen(test){
  noFill();
  stroke(255);
  strokeWeight(2);
  //stroke(255, 215, 0,75+random(50));
  //stroke(212,175,55,75+random(50));
  stroke(197,179-test,88,75+random(50));
  push();
  translate(width/2,height/2);
  rotate(random(0.05)-0.025);
  arc(-3+random(6), -3+random(6), so + 85, 20, -0.3, PI+0.3);
  pop();
}

function restateAssumptions(move, on, now){
  push();
  translate(width/2,height/2);
  rotate(move);
  translate(-width/2,-height/2);
  stroke(on);
  tooQuickly(moments+now);
  pop();
}

function tooQuickly(t){
  let r = 100/sqrt(pow(1.15,2)*pow(cos(t),2)-1);
  let pr = 100/sqrt(pow(1.15,2)*pow(cos(t-passby),2)-1);
  let ppr = 100/sqrt(pow(1.15,2)*pow(cos(t-2*passby),2)-1);
  let pppr = 100/sqrt(pow(1.15,2)*pow(cos(t-3*passby),2)-1);
  
  //stroke(255);
  strokeWeight(4);
  let x = r*cos(t);
  let y = r*sin(t);
  
  let nx = pr*cos(t-passby);
  let ny = pr*sin(t-passby);
  
  let nnx = ppr*cos(t-2*passby);
  let nny = ppr*sin(t-2*passby);
  
  let nnnx = pppr*cos(t-3*passby);
  let nnny = pppr*sin(t-3*passby);
  
  
  push();
  translate(width/2-240,height/2);
  beginShape();
  noFill();
  curveVertex(nnnx,nnny);
  curveVertex(nnx,nny);
  curveVertex(nx,ny);
  curveVertex(x,y);
  endShape();
  pop();
}
  
  
function JeComprendsPas() {
  noStroke();
  strokeWeight(1);
  for (i = -width/2; i < width/2 - 1; i += 10) {
    fill(random(0, 255), 255);
    rect(random(-width, width/2), random(-height, height/2), 2, 2);
    
    for (j = -height/2; j < height/2 - 1; j += 10) {
      fill(random(180, 255), random(30, 50));
      rect(random(i - 10, i), random(j - 10, j), random(1, 2), random(1 ,2));
    }
  }
}