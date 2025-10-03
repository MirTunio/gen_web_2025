// TUNIO 2023

// I'm not you
// I'm not me
// I'm a
// Fearless
// Careless
// Independant
// Emerald

var t=0;

function preload() {
  vhs_font = loadFont('assets/VCR_OSD_MONO_1.001.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  colorMode(HSB, 360, 100, 100);
  background(255);
  textFont(vhs_font);
}

function draw() {
  background(0);
  ambientLight(255);

  directionalLight(255, 0, 100, -1, 0, 0);

  for (let i = 0; i < 3; i++) {
    strokeWeight(0.5);
    noStroke();
    specularMaterial(80 + noise(t) * 60, 30 + noise(t + 99999 * i) * 70, 90 + noise(t + 9999999 * i) * 10);
    shininess(2);
    push();
    rotateY(2 * PI * noise(t/5 + 999999 * i));
    rotateX(0.2 * i - 0.2);
    rotateZ(0.2 * i - 0.2);
    box(14, 20, 14);
    pop();
  }
  t += 0.1;
  
  fill(255);
  textSize(height/11);
  textAlign(CENTER, CENTER);
  text('FEARLESS', 12, -1 * height * (3 / 8), 0);
  text('CARELESS', 12, -1 * height * (1 / 8), 0);
  text('INDEPENDENT', 12, height * (1 / 8), 0);
  text('EMERALD', 12, height * (3 / 8), 0);
}
