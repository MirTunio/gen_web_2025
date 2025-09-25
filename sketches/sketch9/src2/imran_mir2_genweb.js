// TUNIO 2018
// His name was Imran Mir
// Converted from Processing (Java) to p5.js

let lines = [];
let N = 400;
let other_x = [];
let other_y = [];

let kicker = [1, 0, -1];

function setup() {
  createCanvas(400, 400);
  background(255);

  for (let i = 0; i < N; i++) {
    switch (i % 4) {
      case 0:
        lines[i] = new MyRect(width + (random(200) - 100), height + (random(200) - 100), -3 * PI / 4, i); //   ^\
        break;
      case 1:
        lines[i] = new MyRect((random(200) - 100), height + (random(200) - 100), -PI / 4, i); //   /^
        break;
      case 2:
        lines[i] = new MyRect((random(200) - 100), (random(200) - 100), PI / 4, i); //   \_
        break;
      case 3:
        lines[i] = new MyRect(width + (random(200) - 100), (random(200) - 100), 3 * PI / 4, i); //   _/
        break;
    }
  }
}

function draw() {
  fill(255, 10);
  noStroke();
  rect(-1, -1, width + 1, height + 1);

  other_x = [];
  other_y = [];

  for (let i = 0; i < N; i++) {
    lines[i].update();
    other_x.push(lines[i].myxgoto);
    other_y.push(lines[i].myygoto);
  }

  for (let i = 0; i < N; i++) {
    lines[i].checkNeighbours(other_x, other_y);
  }
}

class MyRect {
  constructor(xin, yin, angle, mydex) {
    this.T = 0;
    this.Tstep = 0.2 + random(1) / 100;
    this.myx = xin;
    this.myy = yin;
    this.mya = angle;
    this.myxgoto = 0;
    this.myygoto = 0;
    this.mystroke = 0;

    this.step = 3;
    this.myd = mydex;
    this.norway_factor = 6;

    this.lastcollwith = -1;
    this.thiscollwith = -1;

    this.kickme = 0;
  }

  update() {
    strokeCap(SQUARE);
    strokeWeight(3);
    stroke(this.mystroke);

    this.myxgoto = this.myx + this.T * this.step * cos(this.mya);
    this.myygoto = this.myy + this.T * this.step * sin(this.mya);

    if (random(1) > 0.9) {
      this.kickme = kicker[int(random(3))];
      this.myx = this.myx + this.kickme * this.step * cos(this.mya);
      this.myy = this.myy - this.kickme * this.step * sin(this.mya);
    }

    line(this.myx, this.myy, this.myxgoto, this.myygoto);
    this.T += this.Tstep;
  }

  change(newangle) {
    this.myx = this.myx + this.T * this.step * cos(this.mya);
    this.myy = this.myy + this.T * this.step * sin(this.mya);
    this.T = 0;
    this.mya = newangle;
  }

  checkNeighbours(nx, ny) {
    let mindist = 999999999;

    for (let i = 0; i < N; i++) {
      let cdist = dist(this.myxgoto, this.myygoto, nx[i], ny[i]);
      if (cdist <= mindist && i !== this.myd) {
        mindist = cdist;
        this.thiscollwith = i;
      }
    }

    if (mindist <= this.norway_factor && this.thiscollwith !== this.lastcollwith) {
      this.change(this.mya + PI / 2);
      this.lastcollwith = this.thiscollwith;
    }
  }
}
