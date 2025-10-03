// TUNIO 2024
// AARZI

// Aarzi Temporary, transitory, transient, short-lived, interim, provisional

let ll;

function preload() {
  vhs_font = loadFont('assets/VCR_OSD_MONO_1.001.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(30);
  textFont(vhs_font);
  noSmooth();
}

function draw() {
  // Your life 
  ll = windowWidth/40;
  strokeCap(SQUARE);
  strokeWeight(0.6);
  stroke(255 * random(), 255 * random(), 255 * random());
  line(width/2, ll * random() + height/2 - ll/2, width/2, ll * random() + height/2 - ll/2);
  
  // Oblivion
  fill(0);
  noStroke();
  rect(0,0,120,20);
  rect(width-130,height-20,130,20);
  fill(255);
  textSize(max(8, height/60));
  textAlign(LEFT, TOP);
  text("OBLIVION BEFORE →", 5, 5);
  textAlign(RIGHT, BOTTOM);
  if(random()>0.99){
    text("→ OBLIVION AFTER ?", width - 5, height - 5);
  } else {
    text("→ OBLIVION AFTER", width - 5, height - 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
