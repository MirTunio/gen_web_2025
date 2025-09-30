//uncrn

var t = 0;

function setup() {
  createCanvas(300, 300);
  background(0);
  frameRate(200);
  smooth();
}


function draw() {
  strokeWeight(6);
  stroke(255 - t*2, 255 - t*2, 255 - t*2);
  
  line(width/3 + width * noise(t)/3, 0,
       width/3 + width * noise(t)/3, height);
 
  fill(0, 5);
  noStroke();
  rect(0, height/2, width, height/2);

  t+=0.015;
}