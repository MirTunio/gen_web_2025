//TUNIO 2024
// UTH FARIDA
// Bakhsya

/*
sound on
 click to start
 
 اٹھ فریدا ستیا دنیا ویکھن جا
 جے کوئی مل جائے بخشیا
 تے توں وی بخشیا جائے
 
 Abida:
 Uth Farida suttiya dunya vekhan ja
 Je koi mil jaye bakhsiya
 Te tu vi bakhsya jaye
 
 My Meaning:
 Wake up Farid and go see the world
 So you may find someone to forgive
 And perhaps, you too may be forgiven
 
 Baba Fareed:
 Uth Farida mela vekhan ja,
 Je koi mil jaye bakshiya ve,
 Tu vi bakshya ja.
 
 Default Meaning:
 Wake up Farid and go see the world
 So you may find someone who is forgiven
 And so you too may learn how to be forgiven
 
 To Do Visuals:
   Kathputli tamasha
   Text multiple pixels / colors or things
   Hala Tiles + Truchet
   
 */
 
p5.disableFriendlyErrors = true;

var uth;
var wait;
let waitmax = 100;//5000;
var xn = 0;
var yn = 0;
let boxw = 0;
var xshift = 3;
var yshift = 0;
var start = false;
var do_this = true;
var time, other_time;
var wait;
let other_wait = 100;//11000;


let dunyas = [];
var t = 0.0;
var closing = false;

var dim = 0;

function preload() {
  uth = loadSound('uth.mp3');
}


function setup() {
  dim = round(0.95 * min(windowWidth, windowHeight));
  boxw = dim / 4;
  cnv = createCanvas(dim, dim);
  background(0);
  wait = random(12000, 24500); //100;// 24500; // fore start tiles
  waitmax = random(3000, 7000); // 100;//5000; // twixt tiles
  other_wait = random(1000, 13000); // 100;//11000;  // end closing show
  
  time = millis();
  uth.play();
  uth.setVolume(0.40);
  fill(255);
  textAlign(CENTER);
  
  getAudioContext().suspend();
}

function draw() {
  if (!start) {
    time = millis();
    text('', width/2, height/2); // click
  } else {
    noCursor();
  }

  if ((millis() - time >= wait) && (do_this)) {
    uth.play();
    uth.setVolume(random(0.30, 0.60));
    wait = random(waitmax);
    time = millis();

    betterbg(xn+boxw*xshift, yn+boxw*yshift, boxw, boxw);

    xshift -= 1;
    if (xshift<=-1) {
      xshift = 3;
      yshift += 1;
    }
    if (yshift>=4) {
      fill(0);
      do_this = false;
    }
  }

  if (do_this) {
    other_time = millis();
  }

  for (let i = 0; i < dunyas.length; i++) {
    dunyas[i].update(t);
    dunyas[i].display(t, closing);
  }
  
  
  if (millis() - other_time >= other_wait) {
    var fontsizenow = map(height, 0, 800, 15, 30);
    textSize(fontsizenow);
    noStroke();
    //fill(0);
    //text('تے توں وی بخشیا جائے', width/2, height/2 - 14);
    //fill(0,150);
    //text('تے توں وی بخشیا جائے', width/2+1, height/2+2 - 14);
    
    colorMode(HSB, 360, 100, 100);
    fill(0);
    text('تے توں وی بخشیا جائے', width/2+0.5, height/2+0.5 - 14);
    fill(4, 66, 57);
    text('تے توں وی بخشیا جائے', width/2, height/2 - 14);
    
    fill(4, 66, 40, max(0, random(-400,2)));
    text('  بخشیا         ', width/2, height/2 - 14 + height * random()); // FIX THIS
    closing = true;
    
  }
  
  if((closing) && !(uth.isPlaying())){
    //background(255);
    copy(cnv, 0, 0, width, height, 0, 0, width, height);
    cursor();
    noLoop();
  }
  
  
  t+=0.01;
}

function mousePressed() {
  getAudioContext().resume();
  if (!start) {
    background(0);
    var fontsizenow = map(height, 0, 800, 15, 30);
    textSize(fontsizenow);
    noStroke();
    text('جے کوئی مل جائے بخشیا', width/2, height/2);
  }
  start = true;
}


function betterbg(xloc, yloc, thisw, thish){
  dunyas.push(new dunya(xloc, yloc, thisw, thish));
}

// a generative tile like shrine mosaics

class dunya {
  constructor(sx, sy, ww, hh) {
    this.xx = sx;
    this.yy = sy;
    this.ww = ww;
    this.hh = hh;
    
    this.ts = random(1);
    this.ns = random(100);
    this.rr = 0;
    this.gg = 0;
    this.bb = 0;  
    
    var smoothing = 0.6;
    var binCount = 256;//1024;
    this.fft = new p5.FFT(smoothing, binCount);
    this.fft.setInput(uth);
    
    colorMode(HSB, 360, 100, 100);
    fill(43, 21, 100);
    noStroke();
    rect(sx-1, sy-1, ww+2, hh+2);
    colorMode(RGB);
    
  }

  update(t) {
    this.rr = 255 * noise(t+this.ns);
    this.gg = 255 * noise(t+25000+this.ns);
    this.bb = 255 * noise(t+50000+this.ns);
  }

  display(t, closing) {
    stroke(255, 0, 0);
    let cx = this.xx + this.ww/2;
    let cy = this.yy + this.hh/2;
    let th = t * (2.5 + this.ts) + this.ns; // 
    
    let fx = cx + (this.ww/2) * cos(th);
    let fy = cy + (this.hh/2) * sin(th);
    
    strokeWeight(1);
      
    colorMode(HSB, 360, 100, 100);
    var spectrum = this.fft.analyze();
    
    for(let i=0; i<spectrum.length; i++){
      var value = spectrum[i];
      var rcord = map(i, 0, spectrum.length, 0, 2 * this.ww);
      
      if(value==0){
        stroke(4, 66, 57, 0);//57);
      } else {
        //stroke(value, 50);
        strokeWeight((i * 4 / spectrum.length) * 2 * value/255);
        stroke(4, 66, 57, value/1000);
      }
      
      point(cx + rcord * cos(th/2 + 0.5 * noise(255/value+300+rcord+this.xx+this.yy)), cy + rcord * sin(th/2 + 0.5 * noise(255/value+400+rcord+this.xx+this.yy)));
    }
    colorMode(RGB);

  }
}
