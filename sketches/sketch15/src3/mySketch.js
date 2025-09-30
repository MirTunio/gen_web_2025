// TUNIO 2020
// A state of perpetual departure

let depart = [];
let bg = 250;//100;
let a = 0; //15;

function setup() {
  createCanvas(1440, 400);
  background(bg);
  smooth();

  for (let i = 0; i < 1; i++) {
    depart.push(new fine());
  }
}

function draw() {
  fill(bg, a);
  
  noStroke();
  rect(0,0,width,height);

  for (let i = 0; i <depart.length; i++) {
    depart[i].keep();
    depart[i].leaving();
    
    if(this.time - this.trigger > height){
      deparat.splice(i, 1);
    }
    
  }
  
  if(random(1000)>900){
    depart.push(new fine());
  }
}


class fine {
  constructor() {
    this.time = 0;
    this.deg = 0;
    this.leave = 0;
    this.vel = 0.6 + random(0.5);
    this.flex = random([1, -1,]);
    this.size = 5 + random(30);
    this.ydis = this.size - 5;// random(0, 50);
    this.trigger = random(width-this.ydis);
    
    //this.randomColor = color(random(255),random(255),random(255)); //fullran
    this.randomColor = color(random(255)); //bw ran
    //this.randomColor = color(random(255),0,0); //rouge ran
  }
  
  keep() {
    this.time += this.vel;
  }
  
  leaving() {
    push();
        
    //stroke(0, 50);
    stroke(this.randomColor);
    strokeWeight(this.size);
    strokeCap(SQUARE);
    
    
    if(this.time > this.trigger){
      //stroke(255, 0, 0, 50);
      translate(this.trigger, height/2);
      rotate(this.deg);
      if(abs(this.deg) <= PI/2-0.02){
        this.deg += -1*this.flex*(this.vel/this.ydis);
      } else {
        this.deg = -1*this.flex*PI/2;
        translate(this.leave, 0);
        this.leave += this.vel;
      }
    } else { 
      translate(this.time, height/2);
    }
    
    strokeWeight(3);
    line(2, this.flex*this.ydis-this.size/2, 2, this.flex*this.ydis+this.size/2);
    
    //strokeWeight(2);
    //point(0,0);
    
    pop();
    
  }
}
  