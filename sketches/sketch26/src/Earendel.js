// TUNIO 2023
// Earendel

// Let's all go to Earendel
// The beginning of the universe
// Where everything still makes sense

let t = 0;

// add shake
// add noise

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);
  frameRate(30);
}

function draw() {
  background(10);
  strokeWeight(2.5 * noise(t+1000));
  stroke(255 * noise(t*2));
  point(width/2, height/2);
  JeComprendsPas();
  t+=0.05;
}

function JeComprendsPas() {
  noStroke();
  strokeWeight(0.5);
  for (i = 0; i < width + 1; i += 15) {
    for (j = 0; j < height - 1; j += 15) {
      fill(random(140, 210), random(30, 50));
      rect(random(i - 15, i), random(j - 15, j), random(2), random(2));
    }
  }
}
