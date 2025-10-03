// Jaday peir uttay khair
// I cry infront of Jiji Ama
// Because she doesn't remember the next day

/*
feet sillhoute
with ripples going out
*/

let edges;
let ripples = [];
let lastSpawn = 0;

function preload() {
  img = loadImage('footprint.png'); 
}

function setup() {
  frameRate(24);
  createCanvas(600, 600);
  imageMode(CENTER);
  img.loadPixels();  
  edges = getEdges(img, width/2, height/2, 0.01);
  ripples.push({ r: 0 }); 
}

function draw() {
  //background(203,104,67);
  fill(0);
  noStroke();
  rect(0,0,width,height);
  
  fill(28,172,201);
  //fill(255);
  noStroke();
  rect(width/16, height/16, width-width/8, height-height/8, width/30, height/30);
  
  fill(203,104,67);
  //fill(255);
  noStroke();
  rect(width/8, height/8, width-width/4, height-height/4, width/30, height/30);
  
  
  fill(255);
  noStroke();
  rect(width/4, height/4, width-width/2, height-height/2, width/30, height/30);
  
  // new ripple evert 100 frames
  if (frameCount - lastSpawn > 400) {
    ripples.push({ r: 0 }); 
    lastSpawn = frameCount;
  }

  // draw all ripples
  //push();
  //noFill();
  //stroke(255);
  //strokeWeight(1);
  //for (let ripple of ripples) {
  //  for (let i = 0; i < edges.xs.length; i++) {
  //    ellipse(edges.xs[i], edges.ys[i], ripple.r, ripple.r);
  //  }
  //  ripple.r += 0.5; // expand
  //}
  //pop();
  
  push();
  noFill();
  stroke(255);
  strokeWeight(10);
  blendMode(EXCLUSION);
  //blendMode(DIFFERENCE);
  for (let ripple of ripples) {
    for (let i = 0; i < edges.xs.length; i++) {
      ellipse(edges.xs[i], edges.ys[i], ripple.r, ripple.r);
    }
    ripple.r += 0.5; // expand
  }
  blendMode(BLEND); // reset
  pop();


  // overlay footprint
  tint(255, 255);
  image(img, width/2, height/2, width/2, height/2);
  
  noFill();
  stroke(0);
  rect(0, 0, width, height);
}

// ----------------------------------

function getEdges(img, targetW, targetH, sampleProb = 1.0) {
  let points = [];
  let w = img.width;
  let h = img.height;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let idx = (y * w + x) * 4;
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];

      if (r < 50 && g < 50 && b < 50) {
        let isEdge = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            let nIdx = ((y + dy) * w + (x + dx)) * 4;
            let nr = img.pixels[nIdx];
            let ng = img.pixels[nIdx + 1];
            let nb = img.pixels[nIdx + 2];
            if (nr > 200 && ng > 200 && nb > 200) {
              isEdge = true;
            }
          }
        }
        if (isEdge && random(1) < sampleProb) {
          let sx = map(x, 0, w, width/2 - targetW/2, width/2 + targetW/2);
          let sy = map(y, 0, h, height/2 - targetH/2, height/2 + targetH/2);
          points.push({x: sx, y: sy});
        }
      }
    }
  }

  // 🔀 shuffle array
  shuffle(points, true);

  return { 
    xs: points.map(p => p.x),
    ys: points.map(p => p.y)
  };
}
