// Parameters
let stepIncrement = 1.5;
let xSpacing = 50;
let xOffset = 0;
let noiseOffset = 0;
let noiseShift = 0;
let yOffsetStep = 0;
let curveShift = 0;
let yScale = 70;

function setup() {
  createCanvas(650, 350);
  background(255);
  strokeWeight(2);
}

function draw() {
  yOffsetStep = 0;
  fill(255, 10);
  noStroke();
  rect(0, 0, width, height);
  stroke(0);
  strokeWeight(1);
  
  
  blendMode(MULTIPLY);
  for (let y = -20; y < height + 20; y += 20) {
    drawWavyLine(y);
  }
  blendMode(BLEND);

  noiseShift += 0.06;
}

function drawWavyLine(baseY) {
  let shiftedNoise = noiseShift + yOffsetStep;
  
  stroke(125*noise(baseY*10000+noiseShift));

  beginShape();
  for (let i = 0; i < 20; i++) {
    let x = -xSpacing + xOffset;
    

    // Amplitude fades as x approaches width/2
    let fadeFactor = max(-0.05, 1 - (x / (2* width / 3)));

    // Wavy part scaled by fadeFactor
    let wave = yScale * (noise(shiftedNoise + noiseOffset) - 0.5) * fadeFactor + (-10+20*noise(baseY*10000+noiseShift));

    // Base Y moves toward middle line as x increases
    let y = baseY * fadeFactor + (height / 2) * (1 - fadeFactor) + wave;
    
    
    //curveVertex(x, y);

    if(x > (2*width/3) && random()>0.9999){
      stroke(255,0,0);
      strokeWeight(1);
      blendMode(BLEND);
      curveVertex(x, y + (-50 + 100 * random()));
    } else {
      curveVertex(x, y);
    }
    

    xOffset += xSpacing;
    noiseOffset += stepIncrement;
  }
  endShape();

  xOffset = 0;
  noiseOffset = 0;
  yOffsetStep += 10;
}
