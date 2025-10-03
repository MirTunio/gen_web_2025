let bands = [];
let t = 0;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100, 255);
  noFill();

  // Fewer waves → increase spacing
  const spacing = 80;
  for (let y = -200; y <= height + 200; y += spacing) {
    bands.push({
      baseY: y,
      w: random(100, 200),               // thickness: 100–200 px
      hue: random(360),
      alpha: random(90, 160),            // translucent colors
      xScale: random(0.001, 0.002),      // noise scale across x
      amp: random(90, 150),              // vertical wobble amplitude
      z: random(1000)                    // per-band noise offset
    });
  }
}

function draw() {
  background(255);

  // Faster movement → larger increment
  t += 0.01;

  for (const b of bands) {
    strokeWeight(b.w);
    stroke(b.hue, 80, 100, b.alpha);

    beginShape();
    for (let x = -200; x <= width + 200; x += 20) {
      const ny = noise(b.z + x * b.xScale, t);
      const y = b.baseY + map(ny, 0, 1, -b.amp, b.amp);
      vertex(x, y);
    }
    endShape();
  }

  // Foreground square
  push();
  rectMode(CENTER);
  stroke(0);
  strokeWeight(4);
  fill(255);
  const s = min(width, height) * 0.20;
  rect(width / 2, height / 2, s, s, 15, 15);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Rebuild bands with new spacing
  bands = [];
  const spacing = 160;
  for (let y = -200; y <= height + 200; y += spacing) {
    bands.push({
      baseY: y,
      w: random(100, 200),
      hue: random(360),
      alpha: random(90, 160),
      xScale: random(0.001, 0.002),
      amp: random(90, 150),
      z: random(1000)
    });
  }
}
