// TUNIO 2024

let t = 0;

// load heel.jpg
// match skewed dims
// sample colorss


function preload() {
  bg = loadImage('heel.jpg');
}

function setup() {
  createCanvas(600, 600);
  background(0);
}


function draw() {
  //background(0);
  //image(bg,0,0,width,height);
  noStroke();
  fill(0,5);
  rect(0,0,width,height);
  
  for(let i=-50; i<width+50; i+=2){
    exloc = i;
    eyloc = (noise(t+i) - 0.5) * 25 + (height/2) - 10 + (20 + height/2) * sin(i*t/4);
    //stroke(255*noise(t+i/20+eyloc/20), 255*noise(t+i/20+500+eyloc/20), 255*noise(t+i/20+1000+eyloc/20));
    if(random()>0.999){
      stroke(0, random(255), 0);
    } else {
      stroke(bg.get(exloc+(20*noise(t+200)-10), eyloc+(20*noise(t+300)-10)));
    }
    crosshair(i, eyloc);
  }
  
  t+=0.001;
}


function crosshair(ex, ey){
  lenn = 12;
  gap = 4;
  //stroke(50,255,200);
  strokeWeight(1.2);
  line(ex, ey-lenn, ex, ey-gap);
  line(ex, ey+lenn, ex, ey+gap);
  line(ex-lenn, ey, ex-gap, ey);
  line(ex+lenn, ey, ex+gap, ey);
}