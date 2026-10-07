// TUNIO 2026
// Tiger in a tiger mask

let t = 0;

// =====================================================================
//  CONTROLS
// =====================================================================

// --- Shared by all three faces ---
const FACE_Y = 210;     // centre of the faces, down the canvas  (0 = top, 420 = bottom)
const FACE_SIZE = 192;  // height of each face in px. All three are the same size;
                        //   the more detailed ones just use smaller pixels
const FACE_ANGLE = 30;  // degrees the faces are turned.
                        //   0 = looking straight at you
                        //   positive = turned to the left, negative = turned to the right
                        //   (the pupils are drawn looking left, so positive suits it)
const VIEW_TILT = 0.78; // how much the rows slope as the face turns
                        //   0 = no slope, 1 = steep
const PAPER = [244, 241, 214]; // background

// --- Each face on its own ---
// One block per face, left to right. In each block:
//   x              centre of the face across the canvas (0 = left edge, 900 = right)
//   depthVariation how much the depth varies between pixels. 0 = flat face
//   noiseScale     how different neighbouring pixels are. Small = they move together
//                  in patches, big = each on its own (measured on an 8 x 8 grid,
//                  so the same number ripples alike on every face)
//   depthSpeed     how fast the depth changes over time (t goes up 0.05 every frame)
//   depthShift     px a pixel slides sideways as it comes toward you (at a 30 degree
//                  turn; it scales with FACE_ANGLE)
//   depthSize      how much bigger a pixel gets as it comes toward you
//   depthTint      how much brighter a pixel gets as it comes toward you
const FACES = [
  // left: 8 x 8
  {
    x: 150,
    depthVariation: 5.5,
    noiseScale: 1.2,
    depthSpeed: 0.3,
    depthShift: 6,
    depthSize: 0.12,
    depthTint: 0.15,
  },
  // middle: 12 x 12
  {
    x: 450,
    depthVariation: 5.5,
    noiseScale: 1.2,
    depthSpeed: 0.3,
    depthShift: 4,
    depthSize: 0.12,
    depthTint: 0.15,
  },
  // right: 24 x 24
  {
    x: 750,
    depthVariation: 5.5,
    noiseScale: 1.2,
    depthSpeed: 0.3,
    depthShift: 2,
    depthSize: 0.12,
    depthTint: 0.15,
  },
];

// --- Start screen ---
const START_TEXT = 'click to start';
const START_TEXT_SIZE = 14;
const CURSOR_BLINK = 0.5;  // seconds the underscore is on, then off

// --- Audio layers ---
// The track starts on the click, then every so often another copy of it
// starts on top, from the beginning, so the copies drift out of step.
const TRACK = 'bunny_looped.mp3';
const LAYER_EVERY = 17.5;  // seconds between new layers, on average
const LAYER_NUDGE = 2.5;   // each gap is randomly nudged up to this many seconds
                           //   sooner or later (so 15 - 20 s here)
const MAX_LAYERS = 6;      // stop adding layers after this many
const LAYER_FADE = 3;      // seconds for a new layer to fade in. Older layers
                           //   ease down at the same time so it never gets too loud

// --- Noise builds with the audio ---
// Every face's depthVariation is multiplied by a level that rises each
// time an audio layer comes in, so the faces come apart more as the
// sound gets thicker.
const BUILD_ON = true;        // false = depthVariation stays exactly as set in FACES
const BUILD_START = 0.7;      // the multiplier while only the first layer plays
const BUILD_PER_LAYER = 0.12; // added to the multiplier for each extra layer
                              //   (with 6 layers: 0.7 + 5 x 0.12 = 1.3)
const BUILD_EASE = 6;         // roughly how many seconds it takes to glide to a new level

// --- Drifting pixels ---
// Every now and then a single pixel comes loose. It stops moving with
// the noise and slides straight off the screen: up, down, left or right.
// After T_RESET_PIX seconds it snaps back into its place.
const DRIFT_ON = true;
const DRIFT_EVERY = 4;    // average seconds between pixels coming loose
const DRIFT_NUDGE = 2;    // each gap is randomly nudged up to this many seconds
                          //   sooner or later (so 2 - 6 s here)
const DRIFT_SPEED = 30;   // px per second it slides
const DRIFT_MAX = 10;     // most pixels loose at the same time
const T_RESET_PIX = 30;   // seconds before a loose pixel snaps back into its place
const DRIFT_FACES = [0, 1, 2]; // which faces can lose pixels (0 = left, 1 = middle, 2 = right)

// --- Tear ---
// Every TEAR_EVERY seconds a single tear wells up in the right eye of
// the 24 x 24 tiger, rolls down the cheek, then fades away.
const TEAR_EVERY = 30;   // seconds between tears (the first comes this long after the click)
const TEAR_SWELL = 2;    // seconds to well up in the eye
const TEAR_FALL = 10;    // seconds to roll down the cheek
const TEAR_FADE = 2;     // seconds to fade out at the bottom
const TEAR_COLOUR = [146, 196, 238];  // the drop
const TEAR_TAIL = [206, 230, 250];    // lighter pixel trailing just above it while it falls
const TEAR_LIFT = 0.3;   // how far the tear sits in front of the face (bigger, brighter)
const TEAR_COL = 16;     // the column it runs down (inner corner of the right eye)
const TEAR_FROM = 13;    // the row it starts on
const TEAR_TO = 21;      // the row it stops on

// =====================================================================

const RES = [8, 12, 24];  // pixels across each face, left to right
const DIRECTIONS = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // up, down, left, right

let started = false;  // false until the viewer clicks
let startTime = 0;    // millis() at the click

let layers = [];      // the audio copies currently playing
let nextLayerAt;      // seconds after the click when the next layer starts
let buildLevel = 1;   // current depthVariation multiplier

let drifters = [];    // the loose pixels
let nextDriftAt;

let ox, oy;
let cell;             // size of one pixel for the face being drawn
let pixels = [];

function setup() {
  frameRate(20);
  createCanvas(900, 420);
}

function draw() {
  if (!started) {
    drawStartScreen();
    return;
  }

  const now = seconds();
  updateAudio(now);
  updateBuild();
  updateDrift(now);

  background(PAPER);

  // the second number says which block in FACES each face uses
  drawTiger8(FACES[0].x, 0);
  drawTiger12(FACES[1].x, 1);
  drawTiger24(FACES[2].x, 2);

  noFill();
  stroke(249, 246, 240);
  strokeWeight(2);
  rect(1, 1, width - 2, height - 2, 20);

  t += 0.05;
}

// Seconds since the viewer clicked start
function seconds() {
  return (millis() - startTime) / 1000;
}

// =====================================================================
//  START SCREEN
// =====================================================================

function drawStartScreen() {
  background(0);
  noStroke();
  fill(255);
  textFont('monospace');
  textSize(START_TEXT_SIZE);
  textAlign(RIGHT, BOTTOM);
  const on = floor(millis() / 1000 / CURSOR_BLINK) % 2 === 0;
  // a space when the underscore is off, so the text doesn't jump
  text(START_TEXT + (on ? '_' : ' '), width - 24, height - 20);
}

// The click starts everything. Because the audio starts inside the
// click, the browser allows it, and the later layers too.
function mousePressed() {
  if (started) return;
  started = true;
  startTime = millis();
  t = 0;

  addLayer(1);
  nextLayerAt = LAYER_EVERY + random(-LAYER_NUDGE, LAYER_NUDGE);
  buildLevel = BUILD_ON ? BUILD_START : 1;
  nextDriftAt = DRIFT_EVERY + random(-DRIFT_NUDGE, DRIFT_NUDGE);
}

// =====================================================================
//  AUDIO
// =====================================================================

// Starts one more looping copy of the track.
// Uses the browser's own play() instead of p5's, because p5.min.js
// crashes when it tries to report a blocked autoplay.
function addLayer(startVolume) {
  const a = createAudio(TRACK);
  a.elt.loop = true;
  a.elt.volume = startVolume;
  a.elt.play().catch(() => console.log('The browser blocked the audio.'));
  layers.push(a);
}

// Adds layers on schedule and eases the volumes.
function updateAudio(now) {
  if (layers.length < MAX_LAYERS && now >= nextLayerAt) {
    addLayer(0); // new layers start silent and fade in
    nextLayerAt = now + LAYER_EVERY + random(-LAYER_NUDGE, LAYER_NUDGE);
  }

  // Each layer aims for 1 / sqrt(number of layers), which keeps the
  // overall loudness about the same however many are playing.
  const target = 1 / sqrt(layers.length);
  const step = deltaTime / 1000 / LAYER_FADE;
  for (const a of layers) {
    const v = a.elt.volume;
    a.elt.volume = constrain(v + constrain(target - v, -step, step), 0, 1);
  }
}

// =====================================================================
//  EFFECTS
// =====================================================================

// Noise builds with the audio: glides buildLevel toward the level
// for however many layers are playing.
function updateBuild() {
  if (!BUILD_ON) return;
  const target = BUILD_START + BUILD_PER_LAYER * (layers.length - 1);
  buildLevel += (target - buildLevel) * min(1, deltaTime / 1000 / BUILD_EASE);
}

// Lets go of pixels on schedule, and puts them back after T_RESET_PIX.
function updateDrift(now) {
  drifters = drifters.filter((d) => now - d.start < T_RESET_PIX);

  if (!DRIFT_ON || now < nextDriftAt) return;
  nextDriftAt = now + DRIFT_EVERY + random(-DRIFT_NUDGE, DRIFT_NUDGE);
  if (drifters.length >= DRIFT_MAX || DRIFT_FACES.length === 0) return;

  // pick a face, a pixel and a direction
  const id = random(DRIFT_FACES);
  const col = floor(random(RES[id]));
  const row = floor(random(RES[id]));
  if (drifters.some((d) => d.id === id && d.col === col && d.row === row)) return;
  drifters.push({ id, col, row, dir: random(DIRECTIONS), start: now, depth: null });
}

// The tear, added on top of the 24 x 24 face's pixels. Each tear pixel
// copies the depth of the face pixel underneath it, so it moves with the face.
function addTear() {
  const s = seconds();
  if (s < TEAR_EVERY) return;
  const time = (s - TEAR_EVERY) % TEAR_EVERY; // time since this tear began
  if (time > TEAR_SWELL + TEAR_FALL + TEAR_FADE) return; // gone until the next one

  const under = (row) => pixels.find((p) => p.col === TEAR_COL && p.row === row);
  // marks the pixel just added as part of the tear, so it never drifts
  const markTear = () => (pixels[pixels.length - 1].tear = true);

  // wells up, rolls down (slow to start and stop, one pixel at a time), fades out
  const swell = constrain(time / TEAR_SWELL, 0, 1);
  const fall = constrain((time - TEAR_SWELL) / TEAR_FALL, 0, 1);
  const fade = 1 - constrain((time - TEAR_SWELL - TEAR_FALL) / TEAR_FADE, 0, 1);
  const eased = fall * fall * (3 - 2 * fall);
  const row = TEAR_FROM + floor(eased * (TEAR_TO - TEAR_FROM));
  const alpha = 255 * swell * fade;

  // lighter tail just above the drop while it is moving
  if (fall > 0 && fall < 1 && row > TEAR_FROM) {
    px(TEAR_COL, row - 1, ...TEAR_TAIL, under(row - 1).z + TEAR_LIFT, alpha * 0.6);
    markTear();
  }

  // the drop
  px(TEAR_COL, row, ...TEAR_COLOUR, under(row).z + TEAR_LIFT, alpha);
  markTear();
}

// =====================================================================
//  DRAWING
// =====================================================================

// Width of one pixel column after the turn
function colWidth() {
  return cell * cos(radians(FACE_ANGLE));
}

// How far each column drops below the one before it
function colDrop() {
  return cell * sin(radians(FACE_ANGLE)) * VIEW_TILT;
}

// Turns a grid position (u across, v down) into a point on screen.
// Every column sits a little lower than the one before,
// so the whole face, and every pixel in it, is slanted.
function gridToScreen(u, v) {
  return {
    x: ox + u * colWidth(),
    y: oy + v * cell + u * colDrop(),
  };
}

// Draws one slanted pixel, scaled by s around its own centre
// and moved by dx, dy
function drawCell(col, row, s, dx, dy) {
  const a = gridToScreen(col, row);
  const b = gridToScreen(col + 1, row);
  const c = gridToScreen(col + 1, row + 1);
  const d = gridToScreen(col, row + 1);
  const cx = (a.x + b.x + c.x + d.x) / 4;
  const cy = (a.y + b.y + c.y + d.y) / 4;
  const sx = (p) => cx + (p.x - cx) * s + dx;
  const sy = (p) => cy + (p.y - cy) * s + dy;
  quad(sx(a), sy(a), sx(b), sy(b), sx(c), sy(c), sx(d), sy(d));
}

// Adds one pixel.
// col, row : position in the face's grid
// r, g, b  : colour
// z        : the pixel's resting depth. Positive = sits forward, negative = sits back.
//            The noise is added on top of this.
// a        : optional opacity, 0-255 (default 255, solid)
function px(col, row, r, g, b, z, a = 255) {
  pixels.push({ col, row, r, g, b, z, a });
}

// Draws all the pixels added since the last call.
// faceX : centre of the face across the canvas
// id    : which face (0, 1, 2): picks its settings from FACES and gives
//         it its own patch of noise, so the faces move independently
// res   : how many pixels across the face is (8, 12 or 24)
function renderPixels(faceX, id, res) {
  const f = FACES[id];
  const now = seconds();
  cell = FACE_SIZE / res;

  // place the face so its centre lands on faceX, FACE_Y
  ox = faceX - (res / 2) * colWidth();
  oy = FACE_Y - (res / 2) * cell - (res / 2) * colDrop();

  // sideways slide scales with the turn: none when facing you,
  // depthShift at 30 degrees, the other way when turned right
  const shift = f.depthShift * sin(radians(FACE_ANGLE)) / sin(radians(30));

  // this face's loose pixels, looked up by position
  const loose = new Map();
  for (const d of drifters) {
    if (d.id === id) loose.set(d.col + ',' + d.row, d);
  }

  // each pixel's depth for this frame. col and row are converted to an
  // 8 x 8 grid so noiseScale means the same thing on every face.
  // A loose pixel keeps the depth it had when it came loose.
  const g = 8 / res;
  const variation = f.depthVariation * buildLevel;
  for (const p of pixels) {
    const n = noise(p.col * g * f.noiseScale + id * 100, p.row * g * f.noiseScale, t * f.depthSpeed);
    p.depth = p.z + (n - 0.5) * 2 * variation;
    p.loose = p.tear ? null : loose.get(p.col + ',' + p.row);
    if (p.loose) {
      if (p.loose.depth === null) p.loose.depth = p.depth;
      p.depth = p.loose.depth;
    }
  }

  noStroke();

  // deepest first, so the pixels closest to you sit on top.
  // Loose pixels are drawn last, on top of everything.
  const sorted = [...pixels].sort((a, b) => !!a.loose - !!b.loose || a.depth - b.depth);
  for (const p of sorted) {
    const k = 1 + f.depthTint * p.depth;
    fill(p.r * k, p.g * k, p.b * k, p.a);

    // a loose pixel slides straight off in its direction
    let dx = 0;
    let dy = 0;
    if (p.loose) {
      const dist = DRIFT_SPEED * (now - p.loose.start);
      dx = p.loose.dir[0] * dist;
      dy = p.loose.dir[1] * dist;
    }

    // the face is turned, so a pixel coming toward you
    // slides the way the face is facing
    drawCell(p.col, p.row, 1 + f.depthSize * p.depth, -shift * p.depth + dx, dy);
  }

  pixels = [];
}

// =====================================================================
//  TIGER 1: 8 x 8 (64 pixels)
//  Rows 0-1 stripes and the brown mark, 2 white brows, 3 lids,
//  4 eyes (pupil left, green right), 5 tan and brown under the eyes,
//  6 rose nose, 7 chin with grey corners.
// =====================================================================
function drawTiger8(faceX, id) {
  // row 0
  px( 0,  0, 220, 143,  31,  0.00);
  px( 1,  0,  35,  25,  16,  0.00);
  px( 2,  0,  34,  24,  16,  0.00);
  px( 3,  0, 225, 147,  32,  0.00);
  px( 4,  0, 223, 145,  32,  0.00);
  px( 5,  0,  34,  24,  16,  0.00);
  px( 6,  0,  33,  23,  16,  0.00);
  px( 7,  0, 206, 134,  29,  0.00);

  // row 1
  px( 0,  1,  33,  23,  16,  0.00);
  px( 1,  1, 227, 148,  32,  0.00);
  px( 2,  1,  34,  24,  16,  0.00);
  px( 3,  1, 132,  88,  24,  0.00);
  px( 4,  1, 130,  87,  24,  0.00);
  px( 5,  1,  33,  23,  16,  0.00);
  px( 6,  1, 217, 142,  31,  0.00);
  px( 7,  1,  31,  22,  15,  0.00);

  // row 2
  px( 0,  2, 216, 141,  31,  0.00);
  px( 1,  2, 247, 245, 241,  0.30);
  px( 2,  2, 245, 243, 239,  0.30);
  px( 3,  2, 228, 149,  33,  0.25);
  px( 4,  2, 226, 147,  32,  0.25);
  px( 5,  2, 239, 237, 233,  0.30);
  px( 6,  2, 236, 235, 231,  0.30);
  px( 7,  2, 202, 132,  29,  0.00);

  // row 3
  px( 0,  3, 214, 139,  31,  0.00);
  px( 1,  3,  34,  24,  16, -0.20);
  px( 2,  3,  34,  24,  16, -0.20);
  px( 3,  3, 226, 147,  32,  0.25);
  px( 4,  3, 224, 146,  32,  0.25);
  px( 5,  3,  33,  23,  15, -0.20);
  px( 6,  3,  32,  23,  15, -0.20);
  px( 7,  3, 200, 130,  29,  0.00);

  // row 4
  px( 0,  4,  32,  23,  15,  0.00);
  px( 1,  4,   8,   8,   8, -0.50);
  px( 2,  4, 162, 200, 147, -0.50);
  px( 3,  4, 224, 146,  32,  0.25);
  px( 4,  4, 222, 145,  32,  0.25);
  px( 5,  4,   8,   8,   8, -0.50);
  px( 6,  4, 157, 193, 142, -0.50);
  px( 7,  4,  30,  21,  14,  0.00);

  // row 5
  px( 0,  5, 231, 229, 225,  0.00);
  px( 1,  5, 186, 108,  31,  0.00);
  px( 2,  5, 128,  85,  23,  0.00);
  px( 3,  5, 222, 145,  32,  0.25);
  px( 4,  5, 220, 143,  31,  0.25);
  px( 5,  5, 179, 104,  30,  0.00);
  px( 6,  5, 123,  82,  22,  0.00);
  px( 7,  5, 216, 214, 210,  0.00);

  // row 6
  px( 0,  6, 212, 210, 207,  0.00);
  px( 1,  6, 239, 237, 233,  0.00);
  px( 2,  6, 236, 235, 231,  0.25);
  px( 3,  6, 179, 102, 104,  0.25);
  px( 4,  6, 177, 101, 103,  0.25);
  px( 5,  6, 230, 228, 224,  0.25);
  px( 6,  6, 228, 226, 222,  0.00);
  px( 7,  6, 198, 196, 193,  0.00);

  // row 7
  px( 0,  7, 184, 181, 178,  0.00);
  px( 1,  7, 219, 217, 214,  0.00);
  px( 2,  7, 234, 232, 229,  0.25);
  px( 3,  7, 240, 238, 234,  0.25);
  px( 4,  7, 237, 235, 232,  0.25);
  px( 5,  7, 228, 226, 222,  0.25);
  px( 6,  7, 209, 207, 205,  0.00);
  px( 7,  7, 172, 169, 167,  0.00);

  renderPixels(faceX, id, 8);
}

// =====================================================================
//  TIGER 2: 12 x 12 (144 pixels)
//  Rows 0-2 stripes and the brown mark, 3 white brows,
//  4 heavy lids, 5-6 big dark eyes (pupil left, green right,
//  darker green below) with white fur beside them,
//  7 tan and brown under the eyes, 8 and 10 cheek stripes coming in
//  from the sides, 9 rose nose at the end of the snout, 11 chin.
// =====================================================================
function drawTiger12(faceX, id) {
  // row 0
  px( 0,  0,  33,  24,  16,  0.00);
  px( 1,  0, 230, 150,  33,  0.00);
  px( 2,  0, 229, 149,  33,  0.00);
  px( 3,  0,  35,  24,  16,  0.00);
  px( 4,  0,  34,  24,  16,  0.00);
  px( 5,  0, 225, 147,  32,  0.00);
  px( 6,  0, 224, 146,  32,  0.00);
  px( 7,  0,  34,  24,  16,  0.00);
  px( 8,  0,  34,  24,  16,  0.00);
  px( 9,  0, 220, 143,  31,  0.00);
  px(10,  0, 232, 164,  55,  0.00);
  px(11,  0,  31,  22,  15,  0.00);

  // row 1
  px( 0,  1, 219, 143,  31,  0.00);
  px( 1,  1,  35,  25,  16,  0.00);
  px( 2,  1, 228, 148,  33,  0.00);
  px( 3,  1, 226, 148,  32,  0.00);
  px( 4,  1,  34,  24,  16,  0.00);
  px( 5,  1, 132,  88,  24,  0.00);
  px( 6,  1, 131,  87,  24,  0.00);
  px( 7,  1,  34,  24,  16,  0.00);
  px( 8,  1, 220, 143,  31,  0.00);
  px( 9,  1, 219, 142,  31,  0.00);
  px(10,  1,  33,  23,  16,  0.00);
  px(11,  1, 205, 133,  29,  0.00);

  // row 2
  px( 0,  2, 218, 142,  31,  0.00);
  px( 1,  2,  35,  24,  16,  0.00);
  px( 2,  2,  34,  24,  16,  0.00);
  px( 3,  2, 225, 147,  32,  0.00);
  px( 4,  2, 224, 146,  32,  0.00);
  px( 5,  2, 236, 167,  56,  0.00);
  px( 6,  2, 235, 166,  55,  0.00);
  px( 7,  2, 220, 143,  31,  0.00);
  px( 8,  2, 219, 142,  31,  0.00);
  px( 9,  2,  33,  23,  16,  0.00);
  px(10,  2,  33,  23,  15,  0.00);
  px(11,  2, 203, 133,  29,  0.00);

  // row 3
  px( 0,  3, 238, 236, 232,  0.00);
  px( 1,  3, 230, 228, 225,  0.00);
  px( 2,  3, 247, 245, 241,  0.30);
  px( 3,  3, 246, 244, 240,  0.30);
  px( 4,  3, 244, 172,  57,  0.30);
  px( 5,  3, 242, 171,  57,  0.25);
  px( 6,  3, 241, 170,  57,  0.25);
  px( 7,  3, 225, 147,  32,  0.25);
  px( 8,  3, 239, 237, 233,  0.30);
  px( 9,  3, 237, 235, 231,  0.30);
  px(10,  3, 236, 234, 230,  0.30);
  px(11,  3, 222, 220, 217,  0.00);

  // row 4
  px( 0,  4,  33,  23,  15,  0.00);
  px( 1,  4,  34,  24,  16,  0.00);
  px( 2,  4,  34,  24,  16,  0.30);
  px( 3,  4,  34,  24,  16,  0.30);
  px( 4,  4, 228, 149,  33,  0.30);
  px( 5,  4, 241, 170,  57,  0.25);
  px( 6,  4, 239, 169,  56,  0.25);
  px( 7,  4, 224, 146,  32,  0.25);
  px( 8,  4,  33,  23,  15,  0.30);
  px( 9,  4,  33,  23,  15,  0.30);
  px(10,  4,  32,  23,  15,  0.30);
  px(11,  4,  30,  22,  14,  0.00);

  // row 5
  px( 0,  5, 235, 233, 229,  0.00);
  px( 1,  5,   8,   8,   8,  0.00);
  px( 2,  5,   8,   8,   8, -0.20);
  px( 3,  5, 164, 201, 148, -0.20);
  px( 4,  5, 227, 148,  32, -0.20);
  px( 5,  5, 239, 169,  56,  0.25);
  px( 6,  5, 238, 168,  56,  0.25);
  px( 7,  5, 223, 145,  32,  0.25);
  px( 8,  5,   8,   8,   8, -0.20);
  px( 9,  5,   8,   8,   8, -0.20);
  px(10,  5, 157, 193, 142, -0.20);
  px(11,  5, 219, 217, 214,  0.00);

  // row 6
  px( 0,  6,  32,  23,  15,  0.00);
  px( 1,  6,   8,   8,   8,  0.00);
  px( 2,  6,   8,   8,   8, -0.50);
  px( 3,  6, 126, 167, 114, -0.50);
  px( 4,  6, 225, 147,  32, -0.50);
  px( 5,  6, 238, 168,  56,  0.25);
  px( 6,  6, 237, 167,  56,  0.25);
  px( 7,  6, 198, 117,  28,  0.25);
  px( 8,  6,   8,   8,   8, -0.50);
  px( 9,  6,   8,   8,   8, -0.50);
  px(10,  6, 120, 160, 109, -0.50);
  px(11,  6,  30,  21,  14,  0.00);

  // row 7
  px( 0,  7, 232, 230, 226,  0.00);
  px( 1,  7, 188, 109,  32,  0.00);
  px( 2,  7, 130,  86,  24, -0.50);
  px( 3,  7, 129,  86,  23, -0.50);
  px( 4,  7, 200, 118,  28, -0.50);
  px( 5,  7, 237, 167,  56,  0.25);
  px( 6,  7, 235, 166,  55,  0.25);
  px( 7,  7, 196, 116,  28,  0.25);
  px( 8,  7, 180, 104,  30, -0.50);
  px( 9,  7, 124,  83,  23, -0.50);
  px(10,  7, 123,  82,  22, -0.50);
  px(11,  7, 216, 215, 211,  0.00);

  // row 8
  px( 0,  8,  32,  22,  15,  0.00);
  px( 1,  8,  33,  24,  16,  0.00);
  px( 2,  8, 240, 238, 234,  0.00);
  px( 3,  8, 239, 237, 233,  0.00);
  px( 4,  8, 199, 117,  28,  0.00);
  px( 5,  8, 221, 144,  32,  0.25);
  px( 6,  8, 220, 143,  31,  0.25);
  px( 7,  8, 195, 115,  27,  0.25);
  px( 8,  8, 231, 230, 226,  0.00);
  px( 9,  8, 230, 228, 224,  0.00);
  px(10,  8,  32,  22,  15,  0.00);
  px(11,  8,  30,  21,  14,  0.00);

  // row 9
  px( 0,  9, 229, 227, 224,  0.00);
  px( 1,  9, 240, 238, 234,  0.00);
  px( 2,  9, 239, 237, 233,  0.00);
  px( 3,  9, 237, 235, 231,  0.25);
  px( 4,  9, 198, 117,  28,  0.25);
  px( 5,  9, 179, 102, 104,  0.25);
  px( 6,  9, 178, 102, 104,  0.25);
  px( 7,  9, 194, 115,  27,  0.25);
  px( 8,  9, 230, 228, 224,  0.25);
  px( 9,  9, 229, 227, 223,  0.00);
  px(10,  9, 227, 225, 222,  0.00);
  px(11,  9, 213, 212, 208,  0.00);

  // row 10
  px( 0, 10,  31,  22,  15,  0.00);
  px( 1, 10,  60,  43,  25,  0.00);
  px( 2, 10, 220, 218, 215,  0.00);
  px( 3, 10, 236, 234, 230,  0.25);
  px( 4, 10, 242, 240, 236,  0.25);
  px( 5, 10, 240, 238, 234,  0.25);
  px( 6, 10, 239, 237, 233,  0.25);
  px( 7, 10, 237, 235, 232,  0.25);
  px( 8, 10, 229, 227, 223,  0.25);
  px( 9, 10, 211, 209, 206,  0.00);
  px(10, 10,  57,  40,  24,  0.00);
  px(11, 10,  29,  21,  14,  0.00);

  // row 11
  px( 0, 11, 153, 149, 147,  0.00);
  px( 1, 11, 193, 190, 187,  0.00);
  px( 2, 11, 218, 217, 214,  0.00);
  px( 3, 11, 234, 232, 229,  0.25);
  px( 4, 11, 223, 221, 218,  0.25);
  px( 5, 11, 221, 219, 216,  0.25);
  px( 6, 11, 237, 235, 232,  0.25);
  px( 7, 11, 236, 234, 230,  0.25);
  px( 8, 11, 227, 225, 222,  0.25);
  px( 9, 11, 209, 207, 205,  0.00);
  px(10, 11, 182, 180, 177,  0.00);
  px(11, 11, 142, 139, 137,  0.00);

  renderPixels(faceX, id, 12);
}

// =====================================================================
//  TIGER 3: 24 x 24 (576 pixels)
//  Rows 0-5 stripes and the brown mark, 6-7 white brows with a grey
//  underside, 8-9 heavy lids, 10-13 almond eyes: green iris with a
//  smaller round pupil (left of centre), darker green at the bottom
//  and a thin lower lid. 14-15 tan and brown under the eyes. The nose
//  bridge has a lit middle and shaded edges and ends in a snout block
//  (16-19) with a rose nose. Soft grey shading on the whisker pads,
//  cheek stripes coming in from the sides at 16-17 and 20, and the
//  chin shades to grey at the corners.
// =====================================================================
function drawTiger24(faceX, id) {
  // row 0
  px( 0,  0,  34,  24,  16,  0.00);
  px( 1,  0,  33,  24,  16,  0.00);
  px( 2,  0, 220, 143,  31,  0.00);
  px( 3,  0, 230, 150,  33,  0.00);
  px( 4,  0, 230, 150,  33,  0.00);
  px( 5,  0, 229, 149,  33,  0.00);
  px( 6,  0,  35,  24,  16,  0.00);
  px( 7,  0,  35,  24,  16,  0.00);
  px( 8,  0,  34,  24,  16,  0.00);
  px( 9,  0,  34,  24,  16,  0.00);
  px(10,  0, 226, 147,  32,  0.00);
  px(11,  0,  34,  24,  16,  0.00);
  px(12,  0,  34,  24,  16,  0.00);
  px(13,  0, 224, 146,  32,  0.00);
  px(14,  0,  34,  24,  16,  0.00);
  px(15,  0,  34,  24,  16,  0.00);
  px(16,  0,  34,  24,  16,  0.00);
  px(17,  0,  34,  24,  16,  0.00);
  px(18,  0, 197, 116,  28,  0.00);
  px(19,  0, 220, 143,  31,  0.00);
  px(20,  0, 219, 143,  31,  0.00);
  px(21,  0, 220, 156,  52,  0.00);
  px(22,  0,  31,  22,  15,  0.00);
  px(23,  0,  31,  22,  15,  0.00);

  // row 1
  px( 0,  1,  33,  24,  16,  0.00);
  px( 1,  1,  33,  24,  16,  0.00);
  px( 2,  1, 219, 143,  31,  0.00);
  px( 3,  1, 230, 150,  33,  0.00);
  px( 4,  1, 229, 149,  33,  0.00);
  px( 5,  1, 228, 149,  33,  0.00);
  px( 6,  1,  35,  24,  16,  0.00);
  px( 7,  1,  34,  24,  16,  0.00);
  px( 8,  1,  34,  24,  16,  0.00);
  px( 9,  1,  34,  24,  16,  0.00);
  px(10,  1, 225, 147,  32,  0.00);
  px(11,  1,  34,  24,  16,  0.00);
  px(12,  1,  34,  24,  16,  0.00);
  px(13,  1, 237, 167,  56,  0.00);
  px(14,  1,  34,  24,  16,  0.00);
  px(15,  1,  34,  24,  16,  0.00);
  px(16,  1,  34,  24,  16,  0.00);
  px(17,  1,  33,  24,  16,  0.00);
  px(18,  1, 220, 143,  31,  0.00);
  px(19,  1, 219, 143,  31,  0.00);
  px(20,  1, 219, 142,  31,  0.00);
  px(21,  1, 207, 135,  30,  0.00);
  px(22,  1,  31,  22,  15,  0.00);
  px(23,  1,  31,  22,  15,  0.00);

  // row 2
  px( 0,  2, 220, 143,  31,  0.00);
  px( 1,  2, 196, 115,  27,  0.00);
  px( 2,  2,  33,  23,  16,  0.00);
  px( 3,  2,  35,  25,  16,  0.00);
  px( 4,  2,  35,  24,  16,  0.00);
  px( 5,  2, 228, 148,  33,  0.00);
  px( 6,  2, 241, 170,  57,  0.00);
  px( 7,  2, 226, 148,  32,  0.00);
  px( 8,  2,  34,  24,  16,  0.00);
  px( 9,  2,  34,  24,  16,  0.00);
  px(10,  2, 132,  88,  24,  0.00);
  px(11,  2, 132,  88,  24,  0.00);
  px(12,  2, 132,  88,  24,  0.00);
  px(13,  2, 131,  87,  24,  0.00);
  px(14,  2,  34,  24,  16,  0.00);
  px(15,  2,  34,  24,  16,  0.00);
  px(16,  2, 221, 144,  32,  0.00);
  px(17,  2, 220, 143,  31,  0.00);
  px(18,  2, 219, 143,  31,  0.00);
  px(19,  2,  33,  23,  16,  0.00);
  px(20,  2,  33,  23,  16,  0.00);
  px(21,  2,  31,  22,  15,  0.00);
  px(22,  2, 205, 134,  29,  0.00);
  px(23,  2, 205, 133,  29,  0.00);

  // row 3
  px( 0,  3, 219, 143,  31,  0.00);
  px( 1,  3, 218, 142,  31,  0.00);
  px( 2,  3,  33,  23,  16,  0.00);
  px( 3,  3,  35,  24,  16,  0.00);
  px( 4,  3, 228, 148,  33,  0.00);
  px( 5,  3, 227, 148,  32,  0.00);
  px( 6,  3, 226, 148,  32,  0.00);
  px( 7,  3, 226, 147,  32,  0.00);
  px( 8,  3,  34,  24,  16,  0.00);
  px( 9,  3,  34,  24,  16,  0.00);
  px(10,  3, 132,  88,  24,  0.00);
  px(11,  3, 132,  88,  24,  0.00);
  px(12,  3, 131,  87,  24,  0.00);
  px(13,  3, 131,  87,  24,  0.00);
  px(14,  3,  34,  24,  16,  0.00);
  px(15,  3,  33,  24,  16,  0.00);
  px(16,  3, 220, 143,  31,  0.00);
  px(17,  3, 219, 143,  31,  0.00);
  px(18,  3, 219, 142,  31,  0.00);
  px(19,  3, 218, 142,  31,  0.00);
  px(20,  3,  33,  23,  16,  0.00);
  px(21,  3,  31,  22,  15,  0.00);
  px(22,  3, 205, 133,  29,  0.00);
  px(23,  3, 182, 108,  26,  0.00);

  // row 4
  px( 0,  4, 218, 142,  31,  0.00);
  px( 1,  4, 218, 142,  31,  0.00);
  px( 2,  4,  33,  23,  16,  0.00);
  px( 3,  4,  35,  24,  16,  0.00);
  px( 4,  4,  34,  24,  16,  0.00);
  px( 5,  4,  34,  24,  16,  0.00);
  px( 6,  4, 226, 147,  32,  0.00);
  px( 7,  4, 225, 147,  32,  0.00);
  px( 8,  4, 200, 118,  28,  0.00);
  px( 9,  4, 200, 118,  28,  0.00);
  px(10,  4, 237, 167,  56,  0.00);
  px(11,  4, 236, 167,  56,  0.00);
  px(12,  4, 236, 166,  55,  0.00);
  px(13,  4, 235, 166,  55,  0.00);
  px(14,  4, 221, 144,  32,  0.00);
  px(15,  4, 196, 116,  27,  0.00);
  px(16,  4, 219, 143,  31,  0.00);
  px(17,  4, 219, 142,  31,  0.00);
  px(18,  4,  33,  23,  16,  0.00);
  px(19,  4,  33,  23,  16,  0.00);
  px(20,  4,  33,  23,  15,  0.00);
  px(21,  4,  31,  22,  15,  0.00);
  px(22,  4, 204, 133,  29,  0.00);
  px(23,  4, 203, 133,  29,  0.00);

  // row 5
  px( 0,  5, 231, 163,  54,  0.00);
  px( 1,  5, 217, 142,  31,  0.00);
  px( 2,  5,  33,  23,  15,  0.00);
  px( 3,  5,  34,  24,  16,  0.00);
  px( 4,  5,  34,  24,  16,  0.00);
  px( 5,  5,  34,  24,  16,  0.00);
  px( 6,  5,  34,  24,  16,  0.00);
  px( 7,  5, 224, 146,  32,  0.00);
  px( 8,  5, 200, 118,  28,  0.00);
  px( 9,  5, 223, 145,  32,  0.00);
  px(10,  5, 236, 167,  56,  0.00);
  px(11,  5, 236, 166,  55,  0.00);
  px(12,  5, 235, 166,  55,  0.00);
  px(13,  5, 234, 165,  55,  0.00);
  px(14,  5, 220, 143,  31,  0.00);
  px(15,  5, 196, 115,  27,  0.00);
  px(16,  5, 219, 142,  31,  0.00);
  px(17,  5,  33,  23,  16,  0.00);
  px(18,  5,  33,  23,  16,  0.00);
  px(19,  5,  33,  23,  15,  0.00);
  px(20,  5,  33,  23,  15,  0.00);
  px(21,  5,  31,  22,  15,  0.00);
  px(22,  5, 203, 133,  29,  0.00);
  px(23,  5, 203, 132,  29,  0.00);

  // row 6
  px( 0,  6, 239, 237, 233,  0.00);
  px( 1,  6, 238, 236, 232,  0.00);
  px( 2,  6, 237, 235, 231,  0.00);
  px( 3,  6, 249, 247, 243,  0.30);
  px( 4,  6, 248, 246, 242,  0.30);
  px( 5,  6, 247, 245, 241,  0.30);
  px( 6,  6, 247, 245, 241,  0.30);
  px( 7,  6, 246, 244, 240,  0.30);
  px( 8,  6, 199, 118,  28,  0.30);
  px( 9,  6, 229, 149,  33,  0.25);
  px(10,  6, 243, 171,  57,  0.25);
  px(11,  6, 242, 171,  57,  0.25);
  px(12,  6, 241, 170,  57,  0.25);
  px(13,  6, 241, 170,  57,  0.25);
  px(14,  6, 226, 147,  32,  0.25);
  px(15,  6, 195, 115,  27,  0.30);
  px(16,  6, 239, 237, 234,  0.30);
  px(17,  6, 239, 237, 233,  0.30);
  px(18,  6, 238, 236, 232,  0.30);
  px(19,  6, 237, 235, 231,  0.30);
  px(20,  6, 236, 235, 231,  0.30);
  px(21,  6, 223, 222, 218,  0.00);
  px(22,  6, 223, 221, 217,  0.00);
  px(23,  6, 222, 220, 217,  0.00);

  // row 7
  px( 0,  7, 220, 218, 216,  0.00);
  px( 1,  7, 220, 218, 215,  0.00);
  px( 2,  7, 219, 217, 214,  0.00);
  px( 3,  7, 230, 228, 225,  0.30);
  px( 4,  7, 229, 227, 224,  0.30);
  px( 5,  7, 228, 226, 223,  0.30);
  px( 6,  7, 228, 226, 223,  0.30);
  px( 7,  7, 227, 225, 222,  0.30);
  px( 8,  7, 199, 117,  28,  0.30);
  px( 9,  7, 229, 149,  33,  0.25);
  px(10,  7, 242, 171,  57,  0.25);
  px(11,  7, 241, 170,  57,  0.25);
  px(12,  7, 241, 170,  57,  0.25);
  px(13,  7, 240, 169,  56,  0.25);
  px(14,  7, 225, 147,  32,  0.25);
  px(15,  7, 195, 115,  27,  0.30);
  px(16,  7, 221, 219, 216,  0.30);
  px(17,  7, 220, 219, 216,  0.30);
  px(18,  7, 220, 218, 215,  0.30);
  px(19,  7, 219, 217, 214,  0.30);
  px(20,  7, 218, 217, 214,  0.30);
  px(21,  7, 206, 205, 202,  0.00);
  px(22,  7, 206, 204, 201,  0.00);
  px(23,  7, 205, 203, 201,  0.00);

  // row 8
  px( 0,  8,  33,  23,  15,  0.00);
  px( 1,  8,  33,  23,  15,  0.00);
  px( 2,  8,  33,  23,  15,  0.00);
  px( 3,  8,  34,  24,  16,  0.30);
  px( 4,  8,  34,  24,  16,  0.30);
  px( 5,  8,  34,  24,  16,  0.30);
  px( 6,  8,  34,  24,  16,  0.30);
  px( 7,  8,  34,  24,  16,  0.30);
  px( 8,  8, 198, 117,  28,  0.30);
  px( 9,  8, 204, 120,  28,  0.25);
  px(10,  8, 241, 170,  57,  0.25);
  px(11,  8, 241, 170,  57,  0.25);
  px(12,  8, 240, 169,  56,  0.25);
  px(13,  8, 239, 169,  56,  0.25);
  px(14,  8, 225, 146,  32,  0.25);
  px(15,  8, 194, 114,  27,  0.30);
  px(16,  8,  33,  23,  15,  0.30);
  px(17,  8,  33,  23,  15,  0.30);
  px(18,  8,  33,  23,  15,  0.30);
  px(19,  8,  33,  23,  15,  0.30);
  px(20,  8,  32,  23,  15,  0.30);
  px(21,  8,  31,  22,  14,  0.00);
  px(22,  8,  31,  22,  14,  0.00);
  px(23,  8,  30,  22,  14,  0.00);

  // row 9
  px( 0,  9,  33,  23,  15,  0.00);
  px( 1,  9,  33,  23,  15,  0.00);
  px( 2,  9,  32,  23,  15,  0.00);
  px( 3,  9,  34,  24,  16, -0.20);
  px( 4,  9,  34,  24,  16, -0.20);
  px( 5,  9,  34,  24,  16, -0.20);
  px( 6,  9,  34,  24,  16, -0.20);
  px( 7,  9,  34,  24,  16, -0.20);
  px( 8,  9, 198, 117,  28, -0.20);
  px( 9,  9, 227, 148,  32,  0.25);
  px(10,  9, 241, 170,  57,  0.25);
  px(11,  9, 240, 169,  56,  0.25);
  px(12,  9, 239, 169,  56,  0.25);
  px(13,  9, 239, 168,  56,  0.25);
  px(14,  9, 224, 146,  32,  0.25);
  px(15,  9, 193, 114,  27, -0.20);
  px(16,  9,  33,  23,  15, -0.20);
  px(17,  9,  33,  23,  15, -0.20);
  px(18,  9,  33,  23,  15, -0.20);
  px(19,  9,  32,  23,  15, -0.20);
  px(20,  9,  32,  23,  15, -0.20);
  px(21,  9,  31,  22,  14,  0.00);
  px(22,  9,  30,  22,  14,  0.00);
  px(23,  9,  30,  21,  14,  0.00);

  // row 10
  px( 0, 10,  33,  23,  15,  0.00);
  px( 1, 10, 218, 216, 213,  0.00);
  px( 2, 10, 158, 194, 143,  0.00);
  px( 3, 10,   8,   8,   8, -0.20);
  px( 4, 10,   8,   8,   8, -0.20);
  px( 5, 10, 165, 203, 149, -0.20);
  px( 6, 10, 164, 202, 149, -0.20);
  px( 7, 10, 164, 201, 148, -0.20);
  px( 8, 10, 197, 116,  28, -0.20);
  px( 9, 10, 227, 148,  32,  0.25);
  px(10, 10, 240, 169,  56,  0.25);
  px(11, 10, 239, 169,  56,  0.25);
  px(12, 10, 239, 168,  56,  0.25);
  px(13, 10, 238, 168,  56,  0.25);
  px(14, 10, 223, 146,  32,  0.25);
  px(15, 10, 193, 114,  27, -0.20);
  px(16, 10, 160, 196, 144, -0.20);
  px(17, 10,   8,   8,   8, -0.20);
  px(18, 10,   8,   8,   8, -0.20);
  px(19, 10, 158, 194, 143, -0.20);
  px(20, 10, 158, 194, 142, -0.20);
  px(21, 10, 149, 183, 134,  0.00);
  px(22, 10, 220, 218, 214,  0.00);
  px(23, 10,  30,  21,  14,  0.00);

  // row 11
  px( 0, 11, 235, 233, 229,  0.00);
  px( 1, 11, 234, 232, 228,  0.00);
  px( 2, 11, 158, 194, 142,  0.00);
  px( 3, 11,   8,   8,   8, -0.20);
  px( 4, 11,   8,   8,   8, -0.20);
  px( 5, 11, 164, 202, 149, -0.20);
  px( 6, 11, 164, 201, 148, -0.20);
  px( 7, 11, 163, 201, 148, -0.20);
  px( 8, 11, 196, 116,  27, -0.20);
  px( 9, 11, 226, 147,  32,  0.25);
  px(10, 11, 239, 169,  56,  0.25);
  px(11, 11, 239, 168,  56,  0.25);
  px(12, 11, 238, 168,  56,  0.25);
  px(13, 11, 237, 168,  56,  0.25);
  px(14, 11, 223, 145,  32,  0.25);
  px(15, 11, 192, 113,  27, -0.20);
  px(16, 11, 159, 196, 144, -0.20);
  px(17, 11,   8,   8,   8, -0.20);
  px(18, 11,   8,   8,   8, -0.20);
  px(19, 11, 158, 194, 142, -0.20);
  px(20, 11, 157, 193, 142, -0.20);
  px(21, 11, 148, 182, 134,  0.00);
  px(22, 11, 219, 217, 214,  0.00);
  px(23, 11, 218, 217, 213,  0.00);

  // row 12
  px( 0, 12, 234, 232, 228,  0.00);
  px( 1, 12, 216, 215, 212,  0.00);
  px( 2, 12, 233, 231, 227,  0.00);
  px( 3, 12, 127, 169, 115, -0.50);
  px( 4, 12, 127, 168, 115, -0.50);
  px( 5, 12, 126, 168, 115, -0.50);
  px( 6, 12, 126, 167, 114, -0.50);
  px( 7, 12, 126, 167, 114, -0.50);
  px( 8, 12, 196, 115,  27, -0.50);
  px( 9, 12, 225, 147,  32,  0.25);
  px(10, 12, 239, 168,  56,  0.25);
  px(11, 12, 238, 168,  56,  0.25);
  px(12, 12, 237, 168,  56,  0.25);
  px(13, 12, 237, 167,  56,  0.25);
  px(14, 12, 222, 145,  32,  0.25);
  px(15, 12, 192, 113,  27, -0.50);
  px(16, 12, 122, 162, 111, -0.50);
  px(17, 12, 122, 162, 110, -0.50);
  px(18, 12, 122, 161, 110, -0.50);
  px(19, 12, 121, 161, 110, -0.50);
  px(20, 12, 121, 160, 109, -0.50);
  px(21, 12, 219, 217, 214,  0.00);
  px(22, 12, 218, 217, 213,  0.00);
  px(23, 12, 218, 216, 212,  0.00);

  // row 13
  px( 0, 13, 233, 232, 228,  0.00);
  px( 1, 13, 233, 231, 227,  0.00);
  px( 2, 13, 232, 230, 226,  0.00);
  px( 3, 13,  34,  24,  16, -0.50);
  px( 4, 13,  34,  24,  16, -0.50);
  px( 5, 13,  33,  24,  16, -0.50);
  px( 6, 13,  33,  24,  16, -0.50);
  px( 7, 13,  61,  43,  25, -0.50);
  px( 8, 13, 195, 115,  27, -0.50);
  px( 9, 13, 225, 146,  32,  0.25);
  px(10, 13, 238, 168,  56,  0.25);
  px(11, 13, 237, 168,  56,  0.25);
  px(12, 13, 237, 167,  56,  0.25);
  px(13, 13, 236, 167,  56,  0.25);
  px(14, 13, 221, 144,  32,  0.25);
  px(15, 13, 191, 113,  27, -0.50);
  px(16, 13,  59,  42,  25, -0.50);
  px(17, 13,  32,  23,  15, -0.50);
  px(18, 13,  32,  23,  15, -0.50);
  px(19, 13,  32,  23,  15, -0.50);
  px(20, 13,  32,  23,  15, -0.50);
  px(21, 13, 218, 217, 213,  0.00);
  px(22, 13, 218, 216, 212,  0.00);
  px(23, 13, 217, 215, 212,  0.00);

  // row 14
  px( 0, 14, 233, 231, 227,  0.00);
  px( 1, 14, 232, 230, 226,  0.00);
  px( 2, 14, 179, 103,  30,  0.00);
  px( 3, 14, 188, 109,  32, -0.50);
  px( 4, 14, 187, 108,  32, -0.50);
  px( 5, 14, 187, 108,  31, -0.50);
  px( 6, 14, 129,  86,  23, -0.50);
  px( 7, 14, 129,  86,  23, -0.50);
  px( 8, 14, 195, 115,  27, -0.50);
  px( 9, 14, 200, 118,  28,  0.25);
  px(10, 14, 237, 168,  56,  0.25);
  px(11, 14, 237, 167,  56,  0.25);
  px(12, 14, 236, 167,  56,  0.25);
  px(13, 14, 235, 166,  55,  0.25);
  px(14, 14, 197, 116,  28,  0.25);
  px(15, 14, 190, 112,  27, -0.50);
  px(16, 14, 180, 104,  30, -0.50);
  px(17, 14, 180, 104,  30, -0.50);
  px(18, 14, 179, 104,  30, -0.50);
  px(19, 14, 179, 103,  30, -0.50);
  px(20, 14, 124,  83,  23, -0.50);
  px(21, 14, 117,  78,  21,  0.00);
  px(22, 14, 217, 215, 212,  0.00);
  px(23, 14, 216, 215, 211,  0.00);

  // row 15
  px( 0, 15, 232, 230, 226,  0.00);
  px( 1, 15, 231, 229, 226,  0.00);
  px( 2, 15, 178, 103,  30,  0.00);
  px( 3, 15, 187, 108,  32,  0.00);
  px( 4, 15, 187, 108,  31,  0.00);
  px( 5, 15, 186, 108,  31,  0.00);
  px( 6, 15, 129,  86,  23,  0.00);
  px( 7, 15, 128,  86,  23,  0.00);
  px( 8, 15, 194, 114,  27,  0.00);
  px( 9, 15, 199, 118,  28,  0.25);
  px(10, 15, 237, 167,  56,  0.25);
  px(11, 15, 236, 167,  56,  0.25);
  px(12, 15, 235, 166,  55,  0.25);
  px(13, 15, 235, 166,  55,  0.25);
  px(14, 15, 196, 116,  28,  0.25);
  px(15, 15, 190, 112,  27,  0.00);
  px(16, 15, 180, 104,  30,  0.00);
  px(17, 15, 179, 104,  30,  0.00);
  px(18, 15, 179, 103,  30,  0.00);
  px(19, 15, 178, 103,  30,  0.00);
  px(20, 15, 123,  82,  22,  0.00);
  px(21, 15, 116,  78,  21,  0.00);
  px(22, 15, 216, 215, 211,  0.00);
  px(23, 15, 216, 214, 210,  0.00);

  // row 16
  px( 0, 16,  32,  23,  15,  0.00);
  px( 1, 16,  32,  22,  15,  0.00);
  px( 2, 16,  32,  22,  15,  0.00);
  px( 3, 16,  33,  24,  16,  0.00);
  px( 4, 16,  61,  43,  25,  0.00);
  px( 5, 16, 240, 238, 234,  0.00);
  px( 6, 16, 239, 237, 234,  0.00);
  px( 7, 16, 239, 237, 233,  0.00);
  px( 8, 16, 193, 114,  27,  0.00);
  px( 9, 16, 237, 167,  56,  0.25);
  px(10, 16, 236, 167,  56,  0.25);
  px(11, 16, 235, 166,  55,  0.25);
  px(12, 16, 235, 166,  55,  0.25);
  px(13, 16, 234, 165,  55,  0.25);
  px(14, 16, 233, 165,  55,  0.25);
  px(15, 16, 189, 112,  27,  0.00);
  px(16, 16, 232, 230, 227,  0.00);
  px(17, 16, 231, 230, 226,  0.00);
  px(18, 16, 231, 229, 225,  0.00);
  px(19, 16,  58,  41,  24,  0.00);
  px(20, 16,  32,  22,  15,  0.00);
  px(21, 16,  30,  21,  14,  0.00);
  px(22, 16,  30,  21,  14,  0.00);
  px(23, 16,  30,  21,  14,  0.00);

  // row 17
  px( 0, 17,  32,  22,  15,  0.00);
  px( 1, 17,  32,  22,  15,  0.00);
  px( 2, 17,  32,  22,  15,  0.00);
  px( 3, 17,  33,  23,  16,  0.00);
  px( 4, 17,  61,  43,  25,  0.00);
  px( 5, 17, 239, 237, 234,  0.00);
  px( 6, 17, 239, 237, 233,  0.00);
  px( 7, 17, 238, 236, 232,  0.00);
  px( 8, 17, 193, 114,  27,  0.00);
  px( 9, 17, 222, 145,  32,  0.25);
  px(10, 17, 221, 144,  32,  0.25);
  px(11, 17, 221, 144,  32,  0.25);
  px(12, 17, 220, 143,  31,  0.25);
  px(13, 17, 219, 143,  31,  0.25);
  px(14, 17, 219, 143,  31,  0.25);
  px(15, 17, 189, 111,  26,  0.00);
  px(16, 17, 231, 230, 226,  0.00);
  px(17, 17, 214, 212, 209,  0.00);
  px(18, 17, 230, 228, 224,  0.00);
  px(19, 17,  58,  41,  24,  0.00);
  px(20, 17,  32,  22,  15,  0.00);
  px(21, 17,  30,  21,  14,  0.00);
  px(22, 17,  30,  21,  14,  0.00);
  px(23, 17,  30,  21,  14,  0.00);

  // row 18
  px( 0, 18, 230, 228, 224,  0.00);
  px( 1, 18, 229, 227, 224,  0.00);
  px( 2, 18, 228, 227, 223,  0.00);
  px( 3, 18, 240, 238, 234,  0.00);
  px( 4, 18, 239, 237, 234,  0.00);
  px( 5, 18, 221, 219, 216,  0.00);
  px( 6, 18, 220, 219, 216,  0.25);
  px( 7, 18, 220, 218, 215,  0.25);
  px( 8, 18, 192, 113,  27,  0.25);
  px( 9, 18, 221, 144,  32,  0.25);
  px(10, 18, 179, 102, 104,  0.25);
  px(11, 18, 179, 102, 104,  0.25);
  px(12, 18, 178, 102, 104,  0.25);
  px(13, 18, 178, 102, 104,  0.25);
  px(14, 18, 218, 142,  31,  0.25);
  px(15, 18, 188, 111,  26,  0.25);
  px(16, 18, 214, 212, 209,  0.25);
  px(17, 18, 213, 211, 209,  0.25);
  px(18, 18, 213, 211, 208,  0.00);
  px(19, 18, 229, 227, 223,  0.00);
  px(20, 18, 228, 226, 222,  0.00);
  px(21, 18, 215, 213, 210,  0.00);
  px(22, 18, 214, 212, 209,  0.00);
  px(23, 18, 213, 212, 208,  0.00);

  // row 19
  px( 0, 19, 229, 227, 224,  0.00);
  px( 1, 19, 228, 227, 223,  0.00);
  px( 2, 19, 228, 226, 222,  0.00);
  px( 3, 19, 222, 220, 217,  0.00);
  px( 4, 19, 239, 237, 233,  0.00);
  px( 5, 19, 220, 219, 216,  0.00);
  px( 6, 19, 220, 218, 215,  0.25);
  px( 7, 19, 219, 217, 214,  0.25);
  px( 8, 19, 192, 113,  27,  0.25);
  px( 9, 19, 221, 144,  32,  0.25);
  px(10, 19, 179, 102, 104,  0.25);
  px(11, 19, 141,  74,  80,  0.25);
  px(12, 19, 141,  74,  80,  0.25);
  px(13, 19, 177, 101, 103,  0.25);
  px(14, 19, 217, 142,  31,  0.25);
  px(15, 19, 188, 111,  26,  0.25);
  px(16, 19, 213, 211, 209,  0.25);
  px(17, 19, 213, 211, 208,  0.25);
  px(18, 19, 212, 210, 207,  0.00);
  px(19, 19, 211, 209, 207,  0.00);
  px(20, 19, 227, 225, 222,  0.00);
  px(21, 19, 214, 212, 209,  0.00);
  px(22, 19, 213, 212, 208,  0.00);
  px(23, 19, 213, 211, 207,  0.00);

  // row 20
  px( 0, 20,  32,  22,  15,  0.00);
  px( 1, 20,  31,  22,  15,  0.00);
  px( 2, 20,  31,  22,  15,  0.00);
  px( 3, 20,  60,  43,  25,  0.00);
  px( 4, 20, 238, 236, 232,  0.00);
  px( 5, 20, 237, 235, 231,  0.00);
  px( 6, 20, 219, 217, 214,  0.25);
  px( 7, 20, 218, 217, 214,  0.25);
  px( 8, 20, 235, 233, 229,  0.25);
  px( 9, 20, 242, 240, 236,  0.25);
  px(10, 20, 241, 239, 235,  0.25);
  px(11, 20, 240, 238, 234,  0.25);
  px(12, 20, 240, 238, 234,  0.25);
  px(13, 20, 239, 237, 233,  0.25);
  px(14, 20, 238, 236, 232,  0.25);
  px(15, 20, 230, 228, 224,  0.25);
  px(16, 20, 213, 211, 208,  0.25);
  px(17, 20, 186, 183, 180,  0.25);
  px(18, 20, 228, 226, 222,  0.00);
  px(19, 20, 227, 225, 222,  0.00);
  px(20, 20,  57,  40,  24,  0.00);
  px(21, 20,  29,  21,  14,  0.00);
  px(22, 20,  29,  21,  14,  0.00);
  px(23, 20,  29,  21,  14,  0.00);

  // row 21
  px( 0, 21, 185, 182, 180,  0.00);
  px( 1, 21, 185, 182, 179,  0.00);
  px( 2, 21, 210, 208, 205,  0.00);
  px( 3, 21, 238, 236, 232,  0.00);
  px( 4, 21, 237, 235, 231,  0.00);
  px( 5, 21, 236, 235, 231,  0.00);
  px( 6, 21, 236, 234, 230,  0.25);
  px( 7, 21, 235, 233, 229,  0.25);
  px( 8, 21, 234, 232, 229,  0.25);
  px( 9, 21, 241, 239, 235,  0.25);
  px(10, 21, 240, 238, 234,  0.25);
  px(11, 21, 240, 238, 234,  0.25);
  px(12, 21, 239, 237, 233,  0.25);
  px(13, 21, 238, 236, 232,  0.25);
  px(14, 21, 237, 235, 232,  0.25);
  px(15, 21, 229, 227, 224,  0.25);
  px(16, 21, 229, 227, 223,  0.25);
  px(17, 21, 228, 226, 222,  0.25);
  px(18, 21, 227, 225, 222,  0.00);
  px(19, 21, 226, 225, 221,  0.00);
  px(20, 21, 226, 224, 220,  0.00);
  px(21, 21, 213, 211, 207,  0.00);
  px(22, 21, 172, 170, 167,  0.00);
  px(23, 21, 172, 169, 167,  0.00);

  // row 22
  px( 0, 22, 153, 150, 148,  0.00);
  px( 1, 22, 184, 181, 178,  0.00);
  px( 2, 22, 226, 224, 220,  0.00);
  px( 3, 22, 237, 235, 231,  0.00);
  px( 4, 22, 236, 235, 231,  0.00);
  px( 5, 22, 236, 234, 230,  0.00);
  px( 6, 22, 235, 233, 229,  0.25);
  px( 7, 22, 234, 232, 229,  0.25);
  px( 8, 22, 234, 232, 228,  0.25);
  px( 9, 22, 223, 221, 218,  0.25);
  px(10, 22, 222, 220, 217,  0.25);
  px(11, 22, 221, 219, 216,  0.25);
  px(12, 22, 221, 219, 216,  0.25);
  px(13, 22, 220, 218, 215,  0.25);
  px(14, 22, 219, 217, 215,  0.25);
  px(15, 22, 229, 227, 223,  0.25);
  px(16, 22, 228, 226, 222,  0.25);
  px(17, 22, 227, 225, 222,  0.25);
  px(18, 22, 226, 225, 221,  0.00);
  px(19, 22, 226, 224, 220,  0.00);
  px(20, 22, 225, 223, 220,  0.00);
  px(21, 22, 212, 210, 207,  0.00);
  px(22, 22, 172, 169, 167,  0.00);
  px(23, 22, 142, 139, 137,  0.00);

  // row 23
  px( 0, 23, 153, 149, 147,  0.00);
  px( 1, 23, 183, 181, 178,  0.00);
  px( 2, 23, 208, 207, 204,  0.00);
  px( 3, 23, 219, 217, 214,  0.00);
  px( 4, 23, 236, 234, 230,  0.00);
  px( 5, 23, 235, 233, 229,  0.00);
  px( 6, 23, 234, 232, 229,  0.25);
  px( 7, 23, 234, 232, 228,  0.25);
  px( 8, 23, 216, 214, 211,  0.25);
  px( 9, 23, 222, 220, 217,  0.25);
  px(10, 23, 221, 219, 216,  0.25);
  px(11, 23, 221, 219, 216,  0.25);
  px(12, 23, 220, 218, 215,  0.25);
  px(13, 23, 219, 217, 215,  0.25);
  px(14, 23, 219, 217, 214,  0.25);
  px(15, 23, 228, 226, 222,  0.25);
  px(16, 23, 227, 225, 222,  0.25);
  px(17, 23, 226, 225, 221,  0.25);
  px(18, 23, 209, 207, 205,  0.00);
  px(19, 23, 225, 223, 220,  0.00);
  px(20, 23, 208, 206, 203,  0.00);
  px(21, 23, 172, 169, 167,  0.00);
  px(22, 23, 171, 169, 166,  0.00);
  px(23, 23, 142, 138, 136,  0.00);

  addTear();
  renderPixels(faceX, id, 24);
}
