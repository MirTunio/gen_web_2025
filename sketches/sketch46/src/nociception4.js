// TUNIO 2026
// NOCICEPTION

function setup() {
  frameRate(20);
  createCanvas(500, 300);
  background(240, 234, 226);
}
let time_travel = 0;
let rewinding = false;

function mousePressed() {
  let currentMaxAmplitude = time_travel >= width ? max(0, 300 - (time_travel - width)) : 300;
  if(currentMaxAmplitude < 5) {
    rewinding = true;
  }
}

function draw() {
  if(rewinding) {
    time_travel = max(0, time_travel - 10); // Rewind at speed 5
    if(time_travel === 0) {
      rewinding = false;
    }
  } else {
    time_travel++;
  }
  
  background(240, 234, 226);
  
  for (let i = 0; i < 40; i++) {
    let ribbonNoise = noise(time_travel * 0.02 + i * 0.3);
    
    if(i%2==0 && ribbonNoise < 0.5){
      draw_noci(-100, height/2, 100 + i * 100);
    }
    
    draw_ception(width + 40, 2.5 + i * 10);
    
    if(i%2==0 && ribbonNoise >= 0.5){
      draw_noci(-100, height/2, 100 + i * 100);
    }
  }
  
  stroke(155, 145, 135);
  strokeWeight(2);
  noFill();
  rect(0,0,width,height);
  strokeWeight(1);
}

function draw_ception(startX, startY){
  let rectHeight = 5;
  noStroke();
  
  if(time_travel >= startX){
    fill(102, 0, 0);
  } else if(noise(time_travel * 0.02 + startY * 0.3) > 0.75){
    fill(102, 0, 0);
  } else {
    fill(68);
  }
  
  rect(startX, startY, -1 * time_travel + (10*noise(time_travel/100 + startY*2)-5), rectHeight, 5, 2);
}

function draw_noci(startX, startY, ndelta) {
  let rectWidth = width / 2 + 150 + (25*noise(time_travel/100 + ndelta*2)-12.5);
  let rectHeight = 30;
  let resolution = 60;
  let maxAmplitude = 300;
  let noiseScale = 0.8;
  let noiseSpeed = 0.02;
  let curve = 3;
  
  noStroke();
  stroke(0, 200);
  //fill(200, 200);
  fill(162, 93, 88, 100);
  
  if(time_travel >= width){
    maxAmplitude = max(0, maxAmplitude - (time_travel - width));
  }
  
  beginShape();
  
  for (let i = 0; i <= resolution; i++) {
    let t = i / resolution;
    let x = startX + t * rectWidth;
    
    let amplitude = pow(t, curve) * maxAmplitude;
    let noiseVal = noise(t * noiseScale, time_travel * noiseSpeed  + ndelta);
    let waveOffset = (noiseVal - 0.5) * 2 * amplitude;
    
    let y = startY - rectHeight / 2 + waveOffset;
    
    vertex(x, y);
  }
  
  for (let i = resolution; i >= 0; i--) {
    let t = i / resolution;
    let x = startX + t * rectWidth;
    
    let amplitude = pow(t, curve) * maxAmplitude;
    let noiseVal = noise(t * noiseScale, time_travel * noiseSpeed + ndelta);
    let waveOffset = (noiseVal - 0.5) * 2 * amplitude;
    
    let y = startY + rectHeight / 2 + waveOffset;
    
    vertex(x, y);
  }
  
  endShape(CLOSE);
}
