// TUNIO 2025
// STARS ARE PROJECTORS

/*
And the stars are projectors, yeah
Projectin' our lives down to this planet Earth
And the stars are projectors, yeah
Projectin' our minds down to this planet Earth
Everyone wants a double feature
They wanna be their own damn teacher, and how?
All the stars are projectors, yeah
Projectin' our lives down to this planet Earth
*/


let t = 0;
let sx = [], sy = [], starWeight = [];
let ns = 500;
let dims;

let frames = [];          // store p5.Image objects
let frameThresh = 140; // 20
let blackPixels = [];     // array of arrays: blackPixels[f][]
let blackPixelSets = [];  // array of Sets: blackPixelSets[f]
let numFrames = 49;        // NUM FRAMES - 1 (last index)
let currentFrame = 0;     // current frame index
let frameDir = 1;         // 1 = forward, -1 = backward
let frameDuration = 100; // ms to hold each frame
let lastFrameSwitch = 0;

let pc = 0;

let npf = 5;  // num projectors
let arclen = 5;
let aj = 10;
let ajd = 2;

function preload() {
  for (let i = 1; i <= numFrames; i++) {
    let filename = nf(i, 2) + ".jpg"; // 01.jpg, 02.jpg, etc.
    let path = "frames/" + filename;
    loadImage(path, img => {
      img.resize(min(windowWidth, windowHeight) * 2/3,
                 min(windowWidth, windowHeight) * 2/3);
      img.loadPixels();

      let bp = [];
      let bps = new Set();
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          let idx = 4 * (y * img.width + x);
          let r = img.pixels[idx];
          let g = img.pixels[idx+1];
          let b = img.pixels[idx+2];
          let a = img.pixels[idx+3];
          if (r < frameThresh && g < frameThresh && b < frameThresh && a > 200) {
            bp.push([x, y]);
            bps.add(x + "," + y);
          }
        }
      }
      frames[i-1] = img;
      blackPixels[i-1] = bp;
      blackPixelSets[i-1] = bps;
    });
  }
}

function setup() {
  dims = min(windowWidth, windowHeight) * 2/3;
  createCanvas(dims, dims);
  frameRate(25);
  noSmooth();
  for (let i = 0; i < ns; i++) {
    sx[i] = random(width);
    sy[i] = random(height);
    starWeight[i] = random(1) + 0.5;
  }
  lastFrameSwitch = millis();
}

function draw() {
  background(0, 50);

  // handle frame switching
  if (millis() - lastFrameSwitch > frameDuration) {
    currentFrame += frameDir;
    arclen += 10 * frameDir; /////////////////////////DEP ON FRAME LEN EXPERIMENT//////////////////////////////////////
    if (currentFrame >= numFrames) {
      currentFrame = numFrames - 2;
      frameDir = -1;
    } else if (currentFrame < 0) {
      currentFrame = 1;
      frameDir = 1;
    }
    lastFrameSwitch = millis();
  }

  // pick data for this frame
  let bp = blackPixels[currentFrame];
  let bps = blackPixelSets[currentFrame];
  if (!bp || bp.length === 0) return; // not yet loaded

  // stars
  for (let i = 0; i < sx.length; i++) {
    stroke(255);
    strokeWeight(2 * noise(t/10 + 100 * noise(i)));
    point(sx[i], sy[i]);
  }

  // projections
  for (let i = 0; i < npf; i++) {
    let start = bp[pc];
    let narc = floor(arclen/3) + 2 * floor(random(arclen/3));
    let path = walkBlackPixels(start, narc, bps);

    let pn = floor(random(sx.length));
    let xx = sx[pn];
    let yy = sy[pn];

    for (let j = 0; j < path.length-1; j++) {
      stroke(245, 231, 106);
      strokeWeight(1);
       + (noise(t)*3-1);
      line(path[j][0], // + 3*noise(t/10 + 100 * noise(j))-1,
           path[j][1], // + 3*noise(t/10 + 100 * noise(j))-1,
           path[j+1][0], // + 3*noise(t/10 + 100 * noise(j))-1,
           path[j+1][1], // + 3*noise(t/10 + 100 * noise(j))-1,
           );
    }

    for (let j = 0; j < path.length-1; j += 5) {
      fill(255, 15);
      noStroke();
      triangle(xx, yy, path[j][0], path[j][1], path[j+1][0], path[j+1][1]);
    }

    pc = floor(random(bp.length));
    pc = pc % bp.length;
  }

  t += 0.5;
  drawFPS();
}

function walkBlackPixels(start, steps, bpset) {
  let path = [];
  let current = start;
  let lastDir = null;

  for (let i = 0; i < steps; i++) {
    if (!current) break;
    path.push(current);

    let neighbors = [];
    let [cx, cy] = current;
    let ajn = floor(aj/2) + floor(random(aj/2));

    for (let dx = -1 * ajn; dx <= ajn; dx += ajd) {
      for (let dy = -1 * ajn; dy <= ajn; dy += ajd) {
        if (dx === 0 && dy === 0) continue;
        let nx = cx + dx;
        let ny = cy + dy;
        if (bpset.has(nx + "," + ny)) {
          neighbors.push({ pt: [nx, ny], dir: [dx, dy] });
        }
      }
    }

    if (neighbors.length === 0) break;

    let next;
    if (lastDir === null) {
      next = random(neighbors);
    } else {
      let scored = neighbors.map(n => {
        let dot = n.dir[0]*lastDir[0] + n.dir[1]*lastDir[1];
        return { ...n, score: dot };
      });
      scored.sort((a,b) => b.score - a.score);
      let pickIndex = random() < 0.8 ? 0 : floor(random(scored.length));
      next = scored[pickIndex];
    }

    current = next.pt;
    lastDir = [next.dir[0] + (noise(t)*3-1), next.dir[1] + (noise(t)*3-1)];

    //if  (random() > 0.10){
    //  lastDir = [next.dir[0] + (random()*7-3), next.dir[1] + (random()*7-3)];
    //} else {
    //  lastDir = next.dir;
    //}
  }

  return path;
}

let fpsDisplay = { lastUpdate: 0, fps: 0 };
function drawFPS() {
  if (millis() - fpsDisplay.lastUpdate > 500) {
    fpsDisplay.fps = floor(frameRate());
    fpsDisplay.lastUpdate = millis();
  }
  push();
  textSize(16);
  textAlign(RIGHT, BOTTOM);
  fill(255);
  stroke(0);
  strokeWeight(2);
  text(fpsDisplay.fps + " FPS", width - 10, height - 10);
  pop();
}
