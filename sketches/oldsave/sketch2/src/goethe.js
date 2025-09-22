// TUNIO 2025
// GOETHE
// IF...YOURS

var arcs = [];
var bolts = [];
var t = 0.0;
let RAD = 100;

function setup() {
  createCanvas(400, 400);
  background(0);
  frameRate(20);
}

function draw() {
  background(0);
  push();
  translate(width / 2, height / 2);
  strokeCap(SQUARE);

  if (random() > 0.95) {
    let ang = random(0, TWO_PI);
    let tr = random(100, width / 2);
    let sx = cos(ang) * tr;
    let sy = sin(ang) * tr;
    bolts.push(new bolt(sx, sy, RAD));
  }

  for (let i = 0; i < bolts.length; i++){
    bolts[i].update(t);
  }
  for (let i = 0; i < bolts.length; i++){
    bolts[i].display(t);
  }
  for (let i = 0; i < arcs.length; i++) {
    arcs[i].update(t);
  }
  for (let i = 0; i < arcs.length; i++){
    arcs[i].display(t);
  }

  t += 0.1;
  stroke(255, 0, 0);
  pop();
}

// Need to shine like a ray of LIGHT
// Fade in fade out scenes so figure it out

class my_arc {
  constructor(deg, rad, t) {
    this.td = deg;
    this.r = rad;
    this.ts = t;
    this.span = random(0.3 * PI, 1.2 * PI);
    this.max_width = random(5, 20);
  }

  update(t) {
    this.lt = t - this.ts;
    if (this.lt < this.span) {
      this.tdp = this.td + this.lt;
      this.tdm = this.td - this.lt;
    }
  }

  display(t) {
    if (this.lt < this.span) {
      stroke(255, 255 - 155 * (this.lt / this.span));
      strokeWeight(this.max_width - this.max_width * (this.lt / this.span));
      noFill();
      arc(0, 0, this.r, this.r, this.td, this.tdp);
      arc(0, 0, this.r, this.r, this.tdm, this.td);
    }
  }
}

// A bolt out of the darkness flies in fast and fades
class bolt {
  constructor(xx, yy, rad) {
    this.sx = xx;
    this.sy = yy;
    this.cx = xx;
    this.cy = yy;
    this.not_done = true;
    this.r = rad;
    this.ts = t;
    this.rx = this.sx;
    this.ry = this.sy;
    this.rr = sqrt(pow(this.rx, 2) + pow(this.ry, 2));
    this.deg_out = 0;
    this.strokeWeight = 5;
  }

  update(t) {
    this.lt = t - this.ts;
    this.deg_out = atan2(this.sy, this.sx);
    this.cr = sqrt(pow(this.cx, 2) + pow(this.cy, 2));

    if (this.cr > this.r / 2 + 10 && this.not_done) {
      this.cx = this.sx - this.rx * this.lt;
      this.cy = this.sy - this.ry * this.lt;
    } else {
      if (this.not_done) {
        arcs.push(new my_arc(this.deg_out, RAD, t));
        this.cx = (this.r / 2 - 2) * cos(this.deg_out);
        this.cy = (this.r / 2 - 2) * sin(this.deg_out);
        this.not_done = false;
      }

      let fadeSpeed = 0.25;
      this.sx = lerp(this.sx, this.cx, fadeSpeed);
      this.sy = lerp(this.sy, this.cy, fadeSpeed);
      this.strokeWeight = max(0, this.strokeWeight - fadeSpeed);
    }
  }

  display(t) {
    stroke(255);
    strokeWeight(this.strokeWeight);
    line(this.sx, this.sy, this.cx, this.cy);
  }
}
