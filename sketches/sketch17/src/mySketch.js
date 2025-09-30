// TUNIO 2021
// OLLA2

var t = 0;

function setup() {
  createCanvas(600, 600);
  background(42, 40, 50);
  strokeCap(SQUARE);
  frameRate(24);
}

function draw() {
  framew = 200; // frame
  frameh = 200;
  fill(255, 200);
  rect(width/2 - framew/2, height/2 - frameh/2, framew, frameh);

  strokeWeight(2); // olla
  stroke(0, 40);
  line(width/2 - framew/2 + 5 + framew * noise(t), 0,
       width/2 - framew/2 + 5  + framew * noise(t), height);
  stroke(240, 200, 200, 100);
  line(width/2 - framew/2 + 5  + framew * noise(t+21219), 0,
       width/2 - framew/2 + 5  + framew * noise(t+21219), height);
  noStroke();
  
  
  fill(99, 129, 198, 80); // sky
  rect(width/2 - framew/2, height/2 - frameh/2, framew, frameh * 3/4);
  
  fill(251,248,145); // sun
  rect(width/2 + framew/8, height/2 - frameh/4, framew - framew/2 - framew/8, frameh * 1/14);
  
  fill(244,244,244); // cloud 1 
  rect(width/2 - framew/8, height/2 - frameh/3, framew - framew/2 + framew/8, frameh * 1/28);

  fill(255,244,244); // cloud 2 
  rect(width/2 + framew/3, height/2 - frameh/20, framew - framew/2 - framew/3, frameh * 1/32);

  fill(194, 194, 196, 210); // gravel
  rect(width/2 - framew/2, height/2 + frameh/4, framew, frameh/4);

  fill(237, 220, 191); // cana
  rect(width/2 - framew/2 + 40, height/2 + frameh/4 - 20, framew - 40*2, frameh/5,
       5, 5, 5, 5);
  
  t += 0.01;
}