// TUNIO 2025
// Fire
// We are linked

let t = 0;
let ogc;
let ogw;
var bolts = [];

function setup() {
  createCanvas(400, 400);
  background(0);
  frameRate(15);
  noFill();
}

function draw() {
  blendMode(BLEND);
  background(0);
  stroke(255);
  strokeWeight(0.5);
  rect(0,0,width,height);
  blendMode(ADD);

  let w = 6 + 2 * noise(t * 10);
  ogw = w;
  let c = color(255, 180 + 55 * random());
  ogc = color(255, 180 + 55 * random());
  let oc = color(255, 180 + 55 * random());
  strokeCap(SQUARE);
  
  // GLOW
  for(let i=0; i<5; i+=0.05){
    w = w + i*2*2;
    strokeWeight(w);
    a = alpha(c);
    c.setAlpha(a * 0.80);
    stroke(c);
    line(width/2, 0, width/2, height);
  }
  
  // FIRE
  strokeWeight(ogw);
  stroke(ogc);
  line(width/2, 0, width/2, height);
  
  // BOLTS
  if (random() > 0.95) {
    bolts.push(new bolt());
  }
  for (let i = 0; i < bolts.length; i++){
    bolts[i].display(t);
  }
  
  // BASE
  for(let i=0; i<5; i+=0.05){
    strokeWeight(ogw);
    a = alpha(oc);
    oc.setAlpha(a * 0.80);
    stroke(oc);
    ellipse(width/2, height+5, i * 50, i*30);
  }
  
  JeComprendsPas();
  
  t += 0.1;
}   

class bolt {
  constructor() {
    this.ogw = ogw;
    this.ogc = ogc;
    this.st = t;
  }

  display(t) {
    strokeWeight(ogw);
    let h = (t - this.st) * 1000;
    let ta = alpha(ogc) / 3;
    for(let i=0; i<255; i+=5){
      this.ogc.setAlpha(ta);
      
      stroke(this.ogc);
      ta = ta * 0.90;
      ellipse(width/2, height - h, i/15 , i);
    }
  }
}

function JeComprendsPas() {
  blendMode(BLEND);
  for (i = 0; i < width + 1; i += 25) {
    for (j = 0; j < height - 1; j += 25) {
      fill(random(140, 210), random(0, 40));
      rect(random(i - 15, i), random(j - 15, j), random(2), random(2));
    }
  }
  noFill();
}