// TUNIO 2026
// rizq.

let t = 0;
const xspace = 20;
const yspace = xspace * Math.sqrt(3) / 2;
const WATER = [72, 122, 123];
const SAND_LIGHT = [169, 140, 111];
const SAND_DARK = [143, 119, 94];
const GRASS = [94, 118, 60];
const THRT = [182, 48, 48];
const nScale = 0.01;

function setup() {
  frameRate(20);
  const c = createCanvas(500, 433 + yspace);
  // Scale the displayed canvas to fill its container while preserving
  // aspect ratio (letterboxed, never cropped). The internal resolution
  // stays 500 x (433 + yspace) so the drawing is never cut off.
  // Works both locally and cross-origin on GitHub Pages, since it does
  // not depend on the parent page reaching into the iframe.
  c.style('max-width', '100%');
  c.style('max-height', '100vh');
  c.style('width', 'auto');
  c.style('height', 'auto');
  c.style('display', 'block');
  background(72, 122, 123);
}

function draw() {
  background(72, 122, 123);
  for (let y = 0; y < height + 5; y += yspace) {
    for (let x = 0; x < width + 5; x += xspace) {
      const nx = x * nScale;
      const ny = y * nScale;
      if(x==0 || x > width-1){
        continue;
      }
      
      dx = 5 * noise(x/10+y/10+t+10000);
      dy = 5 * noise(x/10+y/10+t+15000);
      drawUpTriangle(x+dx, y+dy, nx, ny);
      dx = 5 * noise(x/10+y/10+t+20000);
      dy = 5 * noise(x/10+y/10+t+25000);
      drawDownTriangle(x+dx, y+dy, nx, ny);
    }
  }
  
  t += 0.02;
}

function drawUpTriangle(x, y, nx, ny) {
  const isLand = noise(nx, ny + 100, t) > 0.25;

  noStroke();
  fill(noise(nx, ny, t) < 0.5 ? SAND_LIGHT : SAND_DARK);
  if (isLand && noise(nx, ny + 200, t) < 0.25) fill(GRASS);
  if (noise(nx, ny + 45, t) < 0.15) stroke(0);

  if (isLand) {
    if (noise(nx, ny + 500, t) < 0.15) fill(THRT);
    triangle(x, y, x - xspace, y, x - xspace / 2, y - yspace);
  } else {
    fill(WATER);
    noStroke();
    triangle(x, y, x - xspace, y, x - xspace / 2, y - yspace);
  }
}

function drawDownTriangle(x, y, nx, ny) {
  const isLand = noise(nx, ny + 110, t) > 0.2;

  noStroke();
  fill(noise(nx, ny + 90, t) < 0.5 ? SAND_LIGHT : SAND_DARK);
  if (isLand && noise(nx, ny + 210, t) < 0.2) fill(GRASS);
  if (noise(nx, ny + 135, t) < 0.15) {
    stroke(91, 70, 44);
    strokeWeight(0.5);
  }

  if (isLand) {
    triangle(x + xspace / 2, y, x - xspace / 2, y, x, y + yspace);
  } else {
    fill(WATER);
    noStroke();
    triangle(x + xspace / 2, y, x - xspace / 2, y, x, y + yspace);
  }
}
