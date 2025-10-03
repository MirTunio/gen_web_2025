// TUNIO 2024
// Bedouin

let lines = [];
let t = 0;

function setup() {
  createCanvas(420, 420);
  background(237, 225, 199);
  frameRate(30);
  lines.push(new worldline(width/2, height/4, 0, 2));
  lines.push(new worldline(width/3, height/4, 0, 2));  
	noFill();
  strokeWeight(15);
  stroke(255);
  rect(-8, -8, width+16, height+16, 30);
}

function draw() {
  if (t<75){
    fill(237, 225, 199, 5);
    noStroke();
    rect(0, 0, width, height);
    for (let i = 0; i < lines.length; i++) {
      lines[i].update(t);
      lines[i].display(t);
    }
    noFill();
    strokeWeight(15);
    stroke(255);
    rect(-8, -8, width+16, height+16, 30);
    t += 0.1;
  }
  //fill(255);
  //ellipse(width/2, height/2, 60);
  //text(round(t*100)/100, width/2, height/2);
}


class worldline {
  constructor(sx, sy, dir, ttl) {
    this.xx = sx;
    this.yy = sy;
    this.dir = dir;
    //this.sw = 1.1 + 1.0 * random();
    this.sw = 1.1 + 0.6 * random();
    this.vv = 0.9; // vel
    this.ttl = ttl;
    this.dot_size = this.sw * 1.4;
    this.dot_space = this.dot_size * 2;
    this.dotting = false;
    this.xd1 = 0;
    this.yd1 = 0;
    this.xd2 = 0;
    this.yd2 = 0;
    this.t_born = t;
    this.lifetime = 80 * random();
    this.t_shift = 120.123123123 * random();
  }

  update(t) {
    //if((t-this.t_born)>this.lifetime){
    //  return;
    //}
    this.xx += this.vv * sin(this.dir);
    this.yy += this.vv * cos(this.dir);

    if ((random()>0.98) && (this.ttl > 0)) {

      if (random()>0.999) {
        this.lifetime = 0;
      }

      if (random()>0.50) {
        if (random()>0.50) {
          lines.push(new worldline(this.xx, this.yy, this.dir + PI/4, this.ttl - 1));
        } else {
          lines.push(new worldline(this.xx, this.yy, this.dir - PI/4, this.ttl - 1));
        }
      } else {
        if (random()>0.50) {
          lines.push(new worldline(this.xx, this.yy, this.dir + PI/2, this.ttl - 1));
        } else {
          lines.push(new worldline(this.xx, this.yy, this.dir - PI/2, this.ttl - 1));
        }
      }
    }

    if (random()>0.998) {
      this.ttl = 2;
    }

    if (this.xx > width) {
      this.xx = 0;
    }
    if (this.xx < 0) {
      this.xx = width;
    }
    if (this.yy > height) {
      this.yy = 0;
    }
    if (this.yy < 0) {
      this.yy = height;
    }
  }

  display(t) {
    //if((t-this.t_born)>this.lifetime){
    //  return;
    //}
    // this worldline
    stroke(0);
    strokeWeight(this.sw);
    point(this.xx, this.yy);
    point(-1 * (this.xx - width/2) + width/2, this.yy);

    // dots
    if ((random()>0.99) || (this.dotting)) {
      this.dotting = true;
      if (round((t + this.t_shift)*10)%10 == 0) {
        strokeWeight(this.dot_size);
        this.xd1 = this.dot_space * sin(this.dir+PI/2);
        this.yd1 = this.dot_space * cos(this.dir+PI/2);
        this.xd2 = this.dot_space * sin(this.dir-PI/2);
        this.yd2 = this.dot_space * cos(this.dir-PI/2);
        point(this.xx + this.xd1, this.yy + this.yd1);
        point(this.xx + this.xd2, this.yy + this.yd2);
        point(-1 * (this.xx + this.xd1 - width/2) + width/2, this.yy + this.yd1);
        point(-1 * (this.xx + this.xd2 - width/2) + width/2, this.yy + this.yd2);
      }
      if (random()>0.97) {
        this.dotting = false;
      }
    }
  }
}

function mouseClicked() {
  background(237, 225, 199);
  t=0;
  lines = [];
  lines.push(new worldline(width/2, height/4, 0, 2));
  lines.push(new worldline(width/3, height/4, 0, 2));
}

function keyPressed(){
  if (key == ' '){ //this means space bar, since it is a space inside of the single quotes 
    t=99999;
  }
}