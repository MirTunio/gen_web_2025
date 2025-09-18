// TUNIO 2025
// TINNITUS

let snaps = [];
var t = 0.0;
let isActive = false; // Initially false

function setup(){
  createCanvas(400, 400);
  //createCanvas(windowWidth*0.9, windowHeight*0.9);
  background(0);
  stroke(255, 10);
  fill(255,10);
  noStroke();
  strokeWeight(4);
  colorMode(HSB, 360, 100, 100, 255);
  frameRate(40);
  snaps.push(new snap(width/2, height/2, t, 0, 1));
}

function draw(){
  noStroke();
  fill(0, 0, 0, 10);
  rect(0,0,width,height);
  for (let i = 0; i < snaps.length; i++) {
    snaps[i].update(t);
  }
  for (let i = 0; i < snaps.length; i++) {
    snaps[i].display(t);
  }
  
  t+=0.15;
  
  if(t>350){
    noLoop();
  }
  
  noFill();
  stroke(255);
  rect(0,0,width,height);
}


class snap {
  constructor(xx, yy, tc, deg, par_in) {
    this.xx = xx;
    this.yy = yy;
    this.tc = tc;
    this.w = 25;
    
    this.fx = xx;
    this.fy = yy;
    this.sfx = xx;
    this.sfy = yy;
    this.deg = 0;
    this.degs = deg + (t - this.tc) - PI;
    
    this.tilt = random([PI + HALF_PI, PI,  HALF_PI, PI + HALF_PI, HALF_PI, ]);
    this.par = par_in * -1;
    this.speed = 0.3 + 0.7 * random();
    
    this.ready = false;
    this.kill = false;
    this.hears = true;
  }

  update(t) {
    if(this.hears === true){
      this.deg = this.degs + this.par * (t - this.tc) * this.speed;
      this.fx = this.xx + this.w * cos(this.deg);
      this.fy = this.yy + this.w * sin(this.deg);
    }
    
    if(this.ready === false){
      this.sfx = this.fx;
      this.sfy = this.fy;
    }
    this.ready = true;
      
    if(abs(this.deg - this.degs) >= this.tilt-0.1){
      let sx = this.fx;
      let sy = this.fy;
      let degout = round(this.deg / HALF_PI) * HALF_PI
       
      if(this.hears === true){
        snaps.push(new snap(sx, sy, t, degout, this.par));
        if(random()>0.90){
          snaps.push(new snap(sx, sy, t, degout, this.par * -1));
        }
        this.hears = false;
      }
    }
  }
  
  display(t) {
    if(this.kill === false && this.hears === false){
      if(random()>0.80){
        stroke(0, 100, 0,);
      } else {
        stroke(0, 100, max(40, 100 - (t-this.tc)),);
      }
      strokeWeight(0.5);
      beginShape();
      vertex(this.fx+random(5), this.fy+random(5))
      vertex(this.xx+random(5), this.yy+random(5))
      vertex(this.sfx+random(5), this.sfy+random(5))
      endShape();
      
      if((t-this.tc) > 80){
        this.kill = true;
        let index = snaps.indexOf(this);
          if (index !== -1) {
            snaps.splice(index, 1);
          }
      }
      
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth*0.9, windowHeight*0.9);
}
