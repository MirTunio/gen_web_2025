var t = 0;
var xc;
var yc;

function setup(){
  createCanvas(600, 600);  
  background(253,240,214);
  frameRate(20000);
  strokeWeight(1.5);
}

function draw(){
  xc = width*noise(t);
  yc = height*noise(t+10000);
  point(xc,yc);
  point(xc+random(t),yc+random(t));
  point(xc+random(t),yc+random(t));
  point(xc+random(t),yc+random(t));
  point(xc+random(t),yc+random(t));

  
  point(xc+noise(t+10)*t,yc+noise(t+10)*t);
  point(xc+noise(t+50)*t,yc+noise(t+50)*t);
  t += 0.01;
  
  if(t>100){
    while(true);
  }
}
