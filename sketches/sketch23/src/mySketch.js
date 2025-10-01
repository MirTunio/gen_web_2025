// TUNIO 2023
// direction

var t=0;
var t2=0;
var t3=0;
let pathx = [];
let pathy = [];
nmx = 0;
nmy = 0;
nfx = 0;
nfy = 0;
dir = 0;
odir = 0;
let seed = 0;
phase = 1;


function setup() {
  createCanvas(600, 600);
  frameRate(60);
  background(255);
  pathx[0] = width / 2;
  pathy[0] = height / 2;
  pathx[1] = width / 2;
  pathy[1] = height / 2;
  
  seed = int(random(1000000));
  seed = 689737;
  randomSeed(seed);
  noiseSeed(seed);
  rotate3DZ(cube, PI / 4 - 0.120);
  rotate3DX(cube, PI / 4 - 0.120);
}


function draw() {
  if(phase == 1){
    phase_1();
  } else if(phase == 2){
    phase_2();
  }else if(phase == 3){
    phase_3();
  }
}


function phase_1(){
  background(255);
  stroke(0);
  strokeWeight(6);
  noFill();
  rect(0,0,width,height);
  
  push(); // MOVE WITH THE LATEST RECTS
  translate(-1 * (pathx[pathx.length-1] + pathx[pathx.length-2]) / 2 + width / 2, 
            -1 * (pathy[pathx.length-1] + pathy[pathx.length-2]) / 2 + height / 2);

  noStroke();
  if(random() > 0.95){
    fill(255, 0, 0, min(25 + 230 * t / 100, 255));
    strokeWeight(0);
    stroke(255, 0, 0, min(25 + 230 * t / 100, 255));
  } else {
    fill(0, min(25 + 230 * t / 100, 255));
    strokeWeight(0);
    stroke(0, min(25 + 230 * t / 100, 255));
  }
  beginShape(QUAD_STRIP);
  for(let i=0; i<pathx.length-1; i+=2){
    vertex(pathx[i], pathy[i]);
    vertex(pathx[i+1], pathy[i+1]);
  }
  endShape();
  pop();
  
  t += 0.015;
  
  odir = dir;
  dir += ((noise(t) - 0.5)) / 5 + 0.005;
  step = 30;
  ribw = 30 + t * 5;
  
  fid = pathx.length;
  
  
  omx = pathx[fid - 2];
  omy = pathy[fid - 2]; //old main y
  ofx = pathx[fid-1];
  ofy = pathy[fid-1]; //old follow y
  
  nmx = omx + step * sin(dir);
  nmy = omy + step * cos(dir);
  
  nfx = nmx + ribw * cos(dir);
  nfy = nmy - ribw * sin(dir);
  
  append(pathx, nmx);
  append(pathy, nmy);
  append(pathx, nfx);
  append(pathy, nfy);
  
  // for seed 689737
  if(ribw > 0.5 + sqrt(pow(width, 2) + pow(height, 2))/2){
    phase = 2;
    //ribw += t * 50;
  }
}


function phase_2(){
  noStroke();
  fill(0, min(255, t2));
  rect(0,0,width,height);
  t2+=1;
  // if(t2>280){
  if(t2>180){
    fill(255);  
    rect(0,0,width,height);
    phase = 3;
  }
}

//~~~~~~~~~~~~~~~~~~ CodePen ~ Rotating Cube with p5.js ~ Ruslan Marin ~~~~~~~~~~~~~~~~~~~~~~~~
let csize = 18;
const nodes = [
  {x:-1 * csize, y: -1 * csize, z: -1 * csize},
  {x:-1 * csize, y: -1 * csize, z: csize},
  {x:-1 * csize, y: csize, z: -1 * csize},
  {x:-1 * csize, y: csize, z: csize},  
  {x:csize, y: -1 * csize, z: -1 * csize},  
  {x:csize, y: -1 * csize, z: csize},  
  {x:csize, y: csize, z: -1 * csize},  
  {x:csize, y: csize, z: csize}  
];

const cube = {
  nodes,
  edges: [
    { begin: nodes[0], end: nodes[1] },
    { begin: nodes[1], end: nodes[3] },
    { begin: nodes[3], end: nodes[2] },
    { begin: nodes[2], end: nodes[0] },
    { begin: nodes[4], end: nodes[5] },
    { begin: nodes[5], end: nodes[7] },
    { begin: nodes[7], end: nodes[6] },
    { begin: nodes[6], end: nodes[4] },
    { begin: nodes[0], end: nodes[4] },
    { begin: nodes[1], end: nodes[5] },
    { begin: nodes[2], end: nodes[6] },
    { begin: nodes[3], end: nodes[7] },
    //{ begin: nodes[2], end: nodes[5] },
    //{ begin: nodes[0], end: nodes[7] },
    //{ begin: nodes[3], end: nodes[4] },
    //{ begin: nodes[1], end: nodes[6] },
  ]
};

function rotate3DZ (figure, theta){  
  theta = -theta;
  for (let n = 0; n < figure.nodes.length; n++) {
    const x = figure.nodes[n].x;
    const y = figure.nodes[n].y;
    figure.nodes[n].x = x * Math.cos(theta) - y * Math.sin(theta);
    figure.nodes[n].y = y * Math.cos(theta) + x * Math.sin(theta);
  }
};

function rotate3DX(figure, theta){  
  theta = -theta;
  for (let n = 0; n < figure.nodes.length; n++) {
    const y = figure.nodes[n].y;
    const z = figure.nodes[n].z;
    figure.nodes[n].y = y * Math.cos(theta) - z * Math.sin(theta);
    figure.nodes[n].z = z * Math.cos(theta) + y * Math.sin(theta);
  }
};

function rotate3DY(figure, theta){  
  theta = -theta;
  for (let n = 0; n < figure.nodes.length; n++) {
    const x = figure.nodes[n].x;
    const z = figure.nodes[n].z;
    figure.nodes[n].x = x * Math.cos(theta) - z * Math.sin(theta);
    figure.nodes[n].z = z * Math.cos(theta) + x * Math.sin(theta);
  }
};


function phase_3(){
  // rotating cube
  stroke(0);
  strokeWeight(0.5);
  push();
  translate(width/2, height/2);
  background(255);
  for (let n = 0; n < cube.edges.length; n++) {
      line(cube.edges[n].begin.x, cube.edges[n].begin.y, cube.edges[n].end.x, cube.edges[n].end.y);
    }
  
  rotate3DY(cube, 0.06); // this 
  rotate3DZ(cube, 0.06 * noise(t3));
  rotate3DX(cube, 0.06 * noise(t3+91223));
  pop();
  
  t3+=0.1;
  
}













